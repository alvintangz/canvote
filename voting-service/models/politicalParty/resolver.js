const PoliticalParty = require('./schema').PoliticalParties;


const getPoliticalParties = (parent, args) => PoliticalParty.find({});

const getPoliticalParty = (parent, args) => new Promise((resolve, reject) => {
  PoliticalParty.findById(args.id, (err, res) => {
    err ? reject(err) : resolve(res);
  });
});

const getPoliticalPartyByName = (parent, args) => new Promise((resolve, reject) => {
  PoliticalParty.find({ name: args.name }, (err, res) => {
    if (err || res.length == 0) { return reject(res); }
    return resolve(res);
  });
});

const addPoliticalParty = (parent, args) => {
  const newPoliticalParty = new PoliticalParty({
    name: args.name,
    colour: args.colour,
  });
  return new Promise((resolve, reject) => {
    newPoliticalParty.save((err, res) => {
      err ? reject(err) : resolve(res);
    });
  });
};

const updatePoliticalParty = (parent, args) => new Promise((resolve, reject) => {
  PoliticalParty.findOneAndUpdate({ _id: args.id },
    { $set: { name: args.name, colour: args.colour } }, { new: true },
    (err, res) => {
      err ? reject(err) : resolve(res);
    });
});

const deletePoliticalParty = (parent, args) => new Promise((resolve, reject) => {
  PoliticalParty.findByIdAndRemove({ _id: args.id }, (err, res) => {
    err ? reject(err) : resolve(res);
  });
});


module.exports = {
  getPoliticalParties, getPoliticalParty, getPoliticalPartyByName, addPoliticalParty, updatePoliticalParty, deletePoliticalParty,
};
