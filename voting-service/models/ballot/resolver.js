const Ballot = require("./schema").Ballots;
const PoliticalPartyCandidateResolver = require('../politicalPartyCandidate/resolver')

const addBallot = (parent, args) => {
  let newBallot = new Ballot({
    candidate: args.candidate
  });
    return new Promise((resolve, reject) => {
      // check political party exists
      PoliticalPartyCandidateResolver.getPoliticalPartyCandidate(null, {id: args.candidate})
      .then((e) => {
        if (e == null) { return reject({err: "The candidate does not exist"}) }
        // check district exists
          // we can add
            newBallot.save((err, res) => {
            err ? reject(err) : resolve(res)
        })   
      })
      .catch((e) => {
        reject({err: "The candidate does not exist"})      
      })
    }
  )}

const getBallots = (parent, args) => {
  return Ballot.find({});
}

const getBallot = (parent, args) => {
  return new Promise((resolve, reject) => {
    Ballot.findById(args.id, (err, res) => {
      err ? reject(err) : resolve(res)
    })
  })
}

const getBallotByCandidate = (parent, args) => {
  console.log(args)
  return new Promise((resolve, reject) => {
    Ballot.find({candidate: args.candidate}, (err, res) => {
      console.log(res)
      if (err || res.length == 0) {return reject(err)}
      return resolve(res)
    })
  })
}



module.exports = { addBallot, getBallots, getBallot, getBallotByCandidate }
