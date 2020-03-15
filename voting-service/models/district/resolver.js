const District = require('./schema').Districts;
const authRoles = require('../../authRoles').resolverToRole;


const addDistrict = (parent, args, context) => {
  if (!authRoles[context.payload.role].includes('addDistrict')) throw new Error(`User ${context.payload.role} cannot access resolver addDistrict`);

  const newDistrict = new District({
    name: args.name,
  });
  return new Promise((resolve, reject) => {
    newDistrict.save((err, res) => {
      err ? reject(err) : resolve(res);
    });
  });
};

const getDistricts = (parent, args, context) => {
  if (!authRoles[context.payload.role].includes('getDistricts')) throw new Error(`User ${context.payload.role} cannot access resolver getDistricts`);

  return District.find({});
};

const getDistrict = (parent, args, context) => new Promise((resolve, reject) => {
  District.findById(args.id, (err, res) => {
    err ? reject(err) : resolve(res);
  });
});

const getDistrictByName = (parent, args, context) => new Promise((resolve, reject) => {
  if (!authRoles[context.payload.role].includes('getDistrictByName')) throw new Error(`User ${context.payload.role} cannot access resolver getDistrictByName`);
console.log("in dist")
  District.find({ name: args.name }, (err, res) => {
    console.log(res);
    if (err || res.length === 0) { return reject(err); }
    return resolve(res);
  });
});

const updateDistrict = (parent, args, context) => new Promise((resolve, reject) => {
  if (!authRoles[context.payload.role].includes('updateDistrict')) throw new Error(`User ${context.payload.role} cannot access resolver updateDistrict`);

  District.findOneAndUpdate({ _id: args.id },
    { $set: { name: args.name } }, { new: true },
    (err, res) => {
      err ? reject(err) : resolve(res);
    });
});

const deleteDistrict = (parent, args, context) => new Promise((resolve, reject) => {
  if (!authRoles[context.payload.role].includes('deleteDistrict')) throw new Error(`User ${context.payload.role} cannot access resolver deleteDistrict`);

  District.findByIdAndRemove({ _id: args.id }, (err, res) => {
    err ? reject(err) : resolve(res);
  });
});

module.exports = {
  addDistrict, getDistrict, getDistricts, getDistrictByName, updateDistrict, deleteDistrict,
};
