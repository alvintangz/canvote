from app.core import logging
import datetime as dt

import jwt
import pytz

from app.core import config
from app.enums.role import RoleEnum
from app.models.user import User as UserInDB
from app.schemas.user import CurrentUser


def create_jwt_for_user_session(user: UserInDB) -> str:
    """
    Creates a JWT token from a User model for use to maintain a session.
    :param user: The User model to be put into the JWT payload.
    :return: JWT token
    """
    logging.debug('Creating a JWT for user session - %s', user.email)
    return jwt.encode(
        key=config.JWT_SESSION_SECRET_KEY,
        algorithm='HS256',
        payload={
            'sub': 'session',
            'id': user.id,
            'email': user.email,
            'name': {
                'full': user.get_full_name(),
                'first': user.first_name,
                'last': user.last_name
            },
            'role': user.role,
            'exp': dt.datetime.now(pytz.timezone(config.TIMEZONE)) + dt.timedelta(
                minutes=config.JWT_SESSION_MAX_AGE_MINUTES),
            'nbf': dt.datetime.now(pytz.timezone(config.TIMEZONE))
        }
    ).decode('utf-8')


def retrieve_current_user_from_jwt_for_user_session(token: str) -> CurrentUser:
    """
    Retrieves a User object from payload of a JWT token. Raises exception if the JWT token is not valid.
    :param token: The JWT token to decode.
    :return: User
    """
    logging.debug('Retrieving current user from JWT for user session.')
    payload = jwt.decode(token.encode('utf-8'), key=config.JWT_SESSION_SECRET_KEY, algorithm='HS256')
    logging.debug('Retrieved current user - %s', payload['email'])
    return CurrentUser(
        id=payload['id'],
        email=payload['email'],
        first_name=payload['name']['first'],
        last_name=payload['name']['last'],
        role=RoleEnum[payload['role']]
    )


def create_jwt_for_account_activation(email: str) -> str:
    """
    Creates a JWT token for account activation.
    :param email: The email to be inserted into the payload.
    :return: JWT token
    """
    logging.debug('Creating a JWT for account activation - %s', email)
    return jwt.encode(
        key=config.JWT_ACTIVATION_SECRET_KEY,
        algorithm='HS256',
        payload={
            'sub': 'activation',
            'email': email,
            'exp': dt.datetime.now(pytz.timezone(config.TIMEZONE)) + dt.timedelta(
                minutes=config.JWT_ACTIVATION_MAX_AGE_MINUTES),
            'nbf': dt.datetime.now(pytz.timezone(config.TIMEZONE))
        }
    ).decode('utf-8')


def retrieve_email_from_jwt_for_account_activation(token: str) -> str:
    """
    Retrieves an email from the payload of a JWT token. Raises exception if the JWT token is not valid.
    :param token: The JWT token to decode.
    :return: Email from JWT payload.
    """
    logging.debug("Retrieving email from JWT for account activation.")
    try:
        payload = jwt.decode(token.encode('utf-8'), key=config.JWT_ACTIVATION_SECRET_KEY, algorithm='HS256')
    except Exception as e:
        # TODO
        logging.debug('JWT issue!')
        raise e
    logging.debug("Retrieved user - %s", payload['email'])
    return payload['email']
