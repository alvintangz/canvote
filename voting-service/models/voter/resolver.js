const Voter = require('./schema').Voters;
const authRoles = require('../../authRoles').resolverToRole;


// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const addVoter = (parent, args, context) => {
  if (!authRoles[context.payload.role].includes('addVoter')) throw new Error(`User ${context.payload.role} cannot access resolver addVoter`)

  const newVoter = new Voter({
    email: args.email,
  });
  return new Promise((resolve, reject) => {
    if (!validateEmail(args.email)) throw new Error('Email is not valid');
    newVoter.save((err, res) => {
      err ? reject(err) : resolve(res);
    });
  });
};

const getVoters = (parent, args, context) => {
  if (!authRoles[context.payload.role].includes('addBallot')) throw new Error(`User ${context.payload.role} cannot access resolver addBallot`);
  return Voter.find({});
};

const getVoter = (parent, args, context) => new Promise((resolve, reject) => {
  if (!authRoles[context.payload.role].includes('getVoter')) throw new Error(`User ${context.payload.role} cannot access resolver getVoter`);

  Voter.findById(args.id, (err, res) => {
    err ? reject(err) : resolve(res);
  });
});

const getVoterByEmail = (parent, args, context) => new Promise((resolve, reject) => {
  if (!authRoles[context.payload.role].includes('getVoterByEmail')) throw new Error(`User ${context.payload.role} cannot access resolver getVoterByEmail`);

  Voter.find({ email: args.email }, (err, res) => {
    if (err || res.length === 0) { return reject(err); }
    return resolve(res);
  });
});

module.exports = {
  addVoter, getVoters, getVoter, getVoterByEmail,
};
