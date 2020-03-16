const Vote = require('./schema').Votes;
const VoterResolver = require('../voter/resolver');
const BallotResolver = require('../ballot/resolver');
const PoliticalPartyCandidateResolver = require('../politicalPartyCandidate/resolver');


const authRoles = require('../../authRoles').resolverToRole;

const addVote = (parent, args, context) => {
  if (!authRoles[context.payload.role].includes('addVote')) throw new Error(`User ${context.payload.role} cannot access resolver addVote`);

  const newVote = new Vote({
    voter: args.voter,
    candidate: args.candidate,
  });

  return new Promise((resolve, reject) => {
    let p1 = VoterResolver.getVoterByEmail(null, {email: args.voter}, context);
    let p2 = getVoteByEmail(null, {email: args.voter});
    let p3 = PoliticalPartyCandidateResolver.getPoliticalPartyCandidate(null, {id: args.candidate}, context);

    Promise.all([p1, p2, p3])
      .then((values) => {
        newVote.save()
          .then((a) => {
            // add to ballot
            console.log("i get here")
            BallotResolver.addBallot(null, {candidate: args.candidate}, context)
              .then((a) => { a["voter"] = args.voter; return resolve(a) })
              .catch((a) =>  reject(a))
          })
          .catch((a) => {
             reject(a)
          })
      })
      .catch((err) => {
        console.log("err occ")
        reject(new Error(err))
      })
    // check email exists
    // VoterResolver.getVoterByEmail(null, { email: args.voter }, context)
    //   .then((e) => {
    //     if (e == null) { return reject(new Error('A voter does not exist with this email')); }

    //     // make sure this voter hasn't already voted
    //     getVoteByEmail(null, { email: args.voter })
    //       .then((e) => {
    //         // we can add
    //         newVote.save()
    //           .then((a) => console.log(a))
    //           .catch((b) => console.log(err,b))
    //         // newVote.save((err, res) => {
    //         //   err ? reject(err) : resolve(res);
    //         // });
    //       })
    //       .catch((e) => reject(new Error('This voter has already voted')));
    //   })

    //   .catch((e) => {
    //     console.log("error", e);
    //     reject(new Error('The voter does not exist with this email'));
    //   });
  });
};

const getVotes = (parent, args, context) => {
  if (!authRoles[context.payload.role].includes('getVotes')) throw new Error(`User ${context.payload.role} cannot access resolver getVotes`);

  return Vote.find({});
};

const getVote = (parent, args, context) => new Promise((resolve, reject) => {
  if (!authRoles[context.payload.role].includes('addBallot')) throw new Error(`User ${context.payload.role} cannot access resolver addBallot`);

  Vote.findById(args.id, (err, res) => {
    err ? reject(err) : resolve(res);
  });
});

const getVoteByEmail = (parent, args, context) => new Promise((resolve, reject) => {
  Vote.find({ voter: args.email }, (err, res) => {
    console.log("reslength is", res.length)
    if (err) { return reject(err); }
    if (res.length === 0) { return resolve(res); }
    return reject("This voter has already voted");
  });
});


module.exports = { addVote, getVotes, getVote };
