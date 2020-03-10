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
  return new Promise((resolve, reject) => {
    Ballot.find({candidate: args.candidate}, (err, res) => {
      if (err || res.length == 0) {return reject(err)}
      return resolve(res)
    })
  })
}

const getBallotByPoliticalParty = (parent, args) => {
  return new Promise((resolve, reject) => {
    // get the ballots
    let result = []

    Ballot.find({}).then((a) => { 
      // console.log(a)
      a.forEach((ballot, index) => {
          // find political party
          PoliticalPartyCandidateResolver.getPoliticalPartyForCandidate(null, {id: ballot.candidate})
          .then((e) => {
              
                if (e.political_party == args.political_party) { result.push(ballot) }
                if (index == a.length - 1) {  return resolve(result) }
          })   
          .catch((e) => {
            reject({err: "The candidate does not exist"})      
          })
        })
      })
      
    })
  }      






module.exports = { addBallot, getBallots, getBallot, getBallotByCandidate, getBallotByPoliticalParty }
