import { CastError } from 'mongoose';
import { ValidationError, ApolloError, UserInputError } from 'apollo-server-express';

export const validationErrorToApolloUserInputError = (err) => new UserInputError(err, {
  invalidArgs: Object.keys(err.errors).map((arg) => ({
    argument: arg,
    message: err.errors[arg].message,
    valueProvided: err.errors[arg].value,
  })),
});

export const rejectErrorIfNeeded = (error, reject) => {
  if (error) {
    if (error instanceof CastError) {
      reject(new ValidationError(`"${error.value}" is not a valid identifier.`));
    } else if (error.name === 'ValidationError') {
      reject(validationErrorToApolloUserInputError(error));
    } else if (error.name === 'MongoError') {
      switch (error.code) {
        case 11000:
          reject(new UserInputError(`There is already another resource with the value for "${Object.keys(error.keyValue)[0]}": "${error.keyValue[Object.keys(error.keyValue)[0]]}". This must be unique however.`));
          break;
        default:
          reject(new ApolloError(error.errmsg));
      }
    } else {
      reject(new ApolloError(error.message));
    }
  }
  return error;
};

export const rejectNotFoundIfNeeded = (res, reject, resourceName, id) => {
  if (!res) {
    return reject(new ApolloError(`${resourceName} with id "${id}" could not be found.`, 'NOT_FOUND'));
  }
  return !res;
};
