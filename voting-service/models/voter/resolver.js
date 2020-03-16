const Voter = require('./schema').Voters;
const authRoles = require('../../authRoles').resolverToRole;
const DistrictResolver = require('../district/resolver');


// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// UPDATED
const addVoter = (parent, args, context) => {
  if (!authRoles[context.payload.role].includes('addVoter')) throw new Error(`User ${context.payload.role} cannot access resolver addVoter`);

  const newVoter = new Voter({
    email: args.email,
    district: args.district
  });

  return new Promise((resolve, reject) => {
    if (!validateEmail(args.email)) throw new Error('Email is not valid');

    DistrictResolver.getDistrict(null, { id: args.district }, context)
    .then((e) => {
      // we can add
      newVoter.save((err, res) => {
        err ? reject(err) : resolve(res);
      });
    }
      
    )
    .catch((e) => {
      reject(new Error('The district does not exist'));
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
  console.log("finding email")

  if (!authRoles[context.payload.role].includes('getVoterByEmail')) throw new Error(`User ${context.payload.role} cannot access resolver getVoterByEmail`);
  console.log("finding email")
  Voter.findOne({ email: args.email }, (err, res) => {
    console.log("res is ", JSON.stringify(res))
    if (err || res.length === 0) { return reject("This voter email does not exist"); }
    return resolve(res);
  });
});

module.exports = {
  addVoter, getVoters, getVoter, getVoterByEmail,
};
