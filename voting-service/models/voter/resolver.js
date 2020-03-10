const Voter = require('./schema').Voters;

// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const addVoter = (parent, args) => {
  const newVoter = new Voter({
    email: args.email,
  });
  return new Promise((resolve, reject) => {
    if (!validateEmail(args.email)) { return reject({ err: 'Email is not valid' }); }
    newVoter.save((err, res) => {
      err ? reject(err) : resolve(res);
    });
  });
};

const getVoters = (parent, args) => Voter.find({});

const getVoter = (parent, args) => new Promise((resolve, reject) => {
  Voter.findById(args.id, (err, res) => {
    err ? reject(err) : resolve(res);
  });
});

const getVoterByEmail = (parent, args) => new Promise((resolve, reject) => {
  Voter.find({ email: args.email }, (err, res) => {
    if (err || res.length == 0) { return reject(err); }
    return resolve(res);
  });
});

module.exports = {
  addVoter, getVoters, getVoter, getVoterByEmail,
};
