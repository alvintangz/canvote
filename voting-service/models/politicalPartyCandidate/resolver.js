const PoliticalPartyCandidate = require("./schema").PoliticalPartyCandidates;
const PoliticalPartyResolver = require('../politicalParty/resolver')
const DistrictResolver = require('../district/resolver')


const getPoliticalPartyCandidates = (parent, args) => {
  return PoliticalPartyCandidate.find({});
}

const getPoliticalPartyCandidate = (parent, args) => {
  return new Promise((resolve, reject) => {
    PoliticalPartyCandidate.findById(args.id, (err, res) => {
      err ? reject(err) : resolve(res)
    })
  })
}

const addPoliticalPartyCandidate = (parent, args) => {
  let newPoliticalPartyCandidate = new PoliticalPartyCandidate({
    name: args.name,
    political_party: args.political_party,
    district: args.district
  });

    return new Promise((resolve, reject) => {
      // check political party exists
      PoliticalPartyResolver.getPoliticalParty(null, {id: args.political_party})
      .then((e) => {
        if (e == null) { return reject({err: "The political party does not exist"}) }

        // check district exists
        DistrictResolver.getDistrict(null, {id: args.district})        
        .then((e) => {
          if (e == null) { return reject({err: "The district does not exist"}) }

          // we can add
          newPoliticalPartyCandidate.save((err, res) => {
              err ? reject(err) : resolve(res)
            })          
          }
        )
        .catch((e) => {
          reject({err: "The district does not exist"})
        }
      )})
      .catch((e) => {
        reject({err: "The political party does not exist"})
      })
    })
}

const updatePoliticalPartyCandidate = (parent, args) => {

    return new Promise((resolve, reject) => {
      PoliticalPartyResolver.getPoliticalParty(null, {id: args.political_party})
      .then((e) => {
        // check district is good
        DistrictResolver.getDistrict(null, {id: args.district})        
        .then(
          // we can add
          PoliticalPartyCandidate.findOneAndUpdate({_id: args.id},
            {$set: {name: args.name, political_party: args.political_party, district: args.district}}, { new: true },
            (err, res) => {
              err ? reject(err) : resolve(res)
            })      
        )
        .catch((e) => {
          reject({err: "The district does not exist"})
        }
      )})
      .catch((e) => {
        reject({err: "The political party does not exist"})
      })
    })

}

const deletePoliticalPartyCandidate = (parent, args) => {
  return new Promise((resolve, reject) => {
    PoliticalPartyCandidate.findByIdAndRemove({_id: args.id}, (err, res) => {
      err ? reject(err) : resolve(res)
    })
  })
};


module.exports = { getPoliticalPartyCandidates, getPoliticalPartyCandidate, addPoliticalPartyCandidate, updatePoliticalPartyCandidate, deletePoliticalPartyCandidate }

