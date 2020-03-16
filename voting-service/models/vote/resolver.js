const Vote = require('./schema').Votes;
const VoterResolver = require('../voter/resolver');
const BallotResolver = require('../ballot/resolver');
const PoliticalPartyCandidateResolver = require('../politicalPartyCandidate/resolver');


const authRoles = require('../../authRoles').resolverToRole;

const getVoteByEmail = (parent, args) => new Promise((resolve, reject) => {
  Vote.find({ voter: args.email }, (err, res) => {
    console.log('reslength is', res.length);
    if (err) { return reject(err); }
    if (res.length === 0) { return resolve(res); }
    return reject(new Error('This voter has already voted'));
  });
});

const addVote = (parent, args, context) => {
  if (!authRoles[context.payload.role].includes('addVote')) throw new Error(`User ${context.payload.role} cannot access resolver addVote`);

  const newVote = new Vote({
    voter: args.voter,
    candidate: args.candidate,
  });

  return new Promise((resolve, reject) => {
    const p1 = VoterResolver.getVoterByEmail(null, { email: args.voter }, context);
    const p2 = getVoteByEmail(null, { email: args.voter });
    const p3 = PoliticalPartyCandidateResolver.getPoliticalPartyCandidate(null, { id: args.candidate }, context);

    Promise.all([p1, p2, p3])
      .then(() => {
        newVote.save()
          .then(() => {
            // add to ballot
            BallotResolver.addBallot(null, { candidate: args.candidate }, context)
              .then((res) => {
                res.voter = args.voter;
                return resolve(res);
              })
              .catch((a) => reject(a));
          })
          .catch((a) => {
            reject(a);
          });
      })
      .catch((err) => {
        console.log('err occ');
        reject(new Error(err));
      });
  });
};

const getVotes = (parent, args, context) => {
  if (!authRoles[context.payload.role].includes('getVotes')) throw new Error(`User ${context.payload.role} cannot access resolver getVotes`);

  return Vote.find({});
};

const getVote = (parent, args, context) => new Promise((resolve, reject) => {
  if (!authRoles[context.payload.role].includes('addBallot')) throw new Error(`User ${context.payload.role} cannot access resolver addBallot`);

  Vote.findById(args.id, (err, res) => {
    if (err) return reject(err);
    return resolve(res);
  });
});


module.exports = { addVote, getVotes, getVote };
