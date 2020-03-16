const PoliticalParty = require('./schema').PoliticalParties;
const authRoles = require('../../authRoles').resolverToRole;


const getPoliticalParties = (parent, args, context) => {
  if (!authRoles[context.payload.role].includes('getPoliticalParties')) throw new Error(`User ${context.payload.role} cannot access resolver getPoliticalParties`);

  return PoliticalParty.find({});
};

const getPoliticalParty = (parent, args, context) => new Promise((resolve, reject) => {
  if (!authRoles[context.payload.role].includes('getPoliticalParty')) throw new Error(`User ${context.payload.role} cannot access resolver getPoliticalParty`);

  console.log('here', args.id);
  PoliticalParty.findById(args.id, (err, res) => {
    if (err) return reject(err);
    return resolve(res);
  });
});

const getPoliticalPartyByName = (parent, args, context) => new Promise((resolve, reject) => {
  if (!authRoles[context.payload.role].includes('getPoliticalPartyByName')) throw new Error(`User ${context.payload.role} cannot access resolver getPoliticalPartyByName`);

  PoliticalParty.find({ name: args.name }, (err, res) => {
    if (err || res.length === 0) { return reject(res); }
    return resolve(res);
  });
});

const addPoliticalParty = (parent, args, context) => {
  if (!authRoles[context.payload.role].includes('addPoliticalParty')) throw new Error(`User ${context.payload.role} cannot access resolver addPoliticalParty`);

  const newPoliticalParty = new PoliticalParty({
    name: args.name,
    colour: args.colour,
  });
  return new Promise((resolve, reject) => {
    newPoliticalParty.save((err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
};

const updatePoliticalParty = (parent, args, context) => new Promise((resolve, reject) => {
  if (!authRoles[context.payload.role].includes('updatePoliticalParty')) throw new Error(`User ${context.payload.role} cannot access resolver updatePoliticalParty`);

  PoliticalParty.findOneAndUpdate({ _id: args.id },
    { $set: { name: args.name, colour: args.colour } }, { new: true },
    (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
});

const deletePoliticalParty = (parent, args, context) => new Promise((resolve, reject) => {
  if (!authRoles[context.payload.role].includes('deletePoliticalParty')) throw new Error(`User ${context.payload.role} cannot access resolver deletePoliticalParty`);

  PoliticalParty.findByIdAndRemove({ _id: args.id }, (err, res) => {
    if (err) return reject(err);
    return resolve(res);
  });
});


module.exports = {
  getPoliticalParties,
  getPoliticalParty,
  getPoliticalPartyByName,
  addPoliticalParty,
  updatePoliticalParty,
  deletePoliticalParty,
};
