const Ballot = require('./schema').Ballots;
const PoliticalPartyCandidateResolver = require('../politicalPartyCandidate/resolver');
const authRoles = require('../../authRoles').resolverToRole;


const addBallot = (parent, args, context) => {
  if (!authRoles[context.payload.role].includes('addBallot')) throw new Error(`User ${context.payload.role} cannot access resolver addBallot`);

  const newBallot = new Ballot({
    candidate: args.candidate,
  });
  return new Promise((resolve, reject) => {
    // check political party exists
    PoliticalPartyCandidateResolver.getPoliticalPartyCandidate(null, { id: args.candidate }, context)
      .then((e) => {
        if (e == null) { return reject(new Error('The candidate does not exist')); }
        // check district exists
        // we can add
        console.log('will add new ballot');
        newBallot.save((err, res) => {
          if (err) { console.log('err occ, here'); console.log(err); console.log('end err'); return reject(err); }
          console.log(res);
          console.log('returning res', JSON.stringify(res));
          return resolve(res);
        });
      })
      .catch((e) => {
        console.log('here');
        console.log(e);
        reject(new Error('The candidate does not exist'));
      });
  });
};

const getBallots = (parent, args, context) => {
  if (!authRoles[context.payload.role].includes('getBallots')) throw new Error(`User ${context.payload.role} cannot access resolver getBallots`);

  return Ballot.find({});
};

const getBallot = (parent, args, context) => new Promise((resolve, reject) => {
  if (!authRoles[context.payload.role].includes('getBallot')) throw new Error(`User ${context.payload.role} cannot access resolver getBallot`);

  Ballot.findById(args.id, (err, res) => {
    if (err) return reject(err);
    return resolve(res);
  });
});

const getBallotByCandidate = (parent, args, context) => new Promise((resolve, reject) => {
  if (!authRoles[context.payload.role].includes('getBallotByCandidate')) throw new Error(`User ${context.payload.role} cannot access resolver getBallotByCandidate`);

  Ballot.find({ candidate: args.candidate }, (err, res) => {
    if (err || res.length === 0) { return reject(err); }
    return resolve(res);
  });
});

const getBallotByPoliticalParty = (parent, args, context) => new Promise((resolve, reject) => {
  if (!authRoles[context.payload.role].includes('getBallotByPoliticalParty')) throw new Error(`User ${context.payload.role} cannot access resolver getBallotByPoliticalParty`);

  // get the ballots
  const result = [];

  Ballot.find({}).then((a) => {
    // console.log(a)
    a.forEach((ballot, index) => {
      // find political party
      PoliticalPartyCandidateResolver.getPoliticalPartyForCandidate(null, { id: ballot.candidate })
        .then((e) => {
          if (e.political_party === args.political_party) { result.push(ballot); }
          if (index === a.length - 1) { return resolve(result); }
        })
        .catch(() => {
          reject(new Error('The candidate does not exist'));
        });
    });
  });
});


module.exports = {
  addBallot, getBallots, getBallot, getBallotByCandidate, getBallotByPoliticalParty,
};
