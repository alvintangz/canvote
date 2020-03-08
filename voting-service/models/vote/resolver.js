const Vote = require("./schema").Votes;
const VoterResolver = require('../voter/resolver')

const addVote = (parent, args) => {
    let newVote = new Vote({
      voter: args.voter
    });




    return new Promise((resolve, reject) => {
      // check email exists
      VoterResolver.getVoterByEmail(null, {email: args.voter})
      .then((e) => {
        if (e == null) { return reject({err: "The voter does not exist with this email"}) }

        // make sure this voter hasn't already voted
          getVoteByEmail(null, {email: args.voter})
          .then((e) => {
              // we can add
              newVote.save((err, res) => {
              err ? reject(err) : resolve(res)
          })})
          .catch((e) => {
            return reject({"err": "This voter has already voted"})
          })
        })   
      
      .catch((e) => {
        reject({err: "The voter does not exist with this email"})      
      })
    }
  )}

const getVotes = (parent, args) => {
  return Vote.find({});
}

const getVote = (parent, args) => {
  return new Promise((resolve, reject) => {
    Vote.findById(args.id, (err, res) => {
      err ? reject(err) : resolve(res)
    })
  })
}

const getVoteByEmail = (parent, args) => {
  return new Promise((resolve, reject) => {
    Vote.find({voter: args.email}, (err, res) => {
      if (err) {return reject(err)}
      if (res.length == 0) {return resolve(res)}
      return reject(res)
    })
  })
}



module.exports = { addVote, getVotes, getVote }
