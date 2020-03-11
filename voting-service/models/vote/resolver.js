const Vote = require('./schema').Votes;
const VoterResolver = require('../voter/resolver');
const authRoles = require('../../authRoles').resolverToRole;

const addVote = (parent, args, context) => {
  if (!authRoles[context.payload.role].includes('addVote')) throw new Error(`User ${context.payload.role} cannot access resolver addVote`)

  const newVote = new Vote({
    voter: args.voter,
  });

  return new Promise((resolve, reject) => {
    // check email exists
    VoterResolver.getVoterByEmail(null, { email: args.voter })
      .then((e) => {
        if (e == null) { return reject({ err: 'The voter does not exist with this email' }); }

        // make sure this voter hasn't already voted
        getVoteByEmail(null, { email: args.voter })
          .then((e) => {
            // we can add
            newVote.save((err, res) => {
              err ? reject(err) : resolve(res);
            });
          })
          .catch((e) => reject({ err: 'This voter has already voted' }));
      })

      .catch((e) => {
        reject({ err: 'The voter does not exist with this email' });
      });
  });
};

const getVotes = (parent, args, context) => {
  if (!authRoles[context.payload.role].includes('getVotes')) throw new Error(`User ${context.payload.role} cannot access resolver getVotes`)

  return Vote.find({});
}

const getVote = (parent, args, context) => new Promise((resolve, reject) => {
  if (!authRoles[context.payload.role].includes('addBallot')) throw new Error(`User ${context.payload.role} cannot access resolver addBallot`)

  Vote.findById(args.id, (err, res) => {
    err ? reject(err) : resolve(res);
  });
});

const getVoteByEmail = (parent, args, context) => new Promise((resolve, reject) => {
  Vote.find({ voter: args.email }, (err, res) => {
    if (err) { return reject(err); }
    if (res.length == 0) { return resolve(res); }
    return reject(res);
  });
});


module.exports = { addVote, getVotes, getVote };
