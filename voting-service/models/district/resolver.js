const District = require("./schema").Districts;


const addDistrict = (parent, args) => {
  let newDistrict = new District({
    name: args.name
  });
  return new Promise((resolve, reject) => {
    newDistrict.save((err, res) => {
      err ? reject(err) : resolve(res)
    })
  })
}

const getDistricts = (parent, args) => {
  return District.find({});
}

const getDistrict = (parent, args) => {
  return new Promise((resolve, reject) => {
    District.findById(args.id, (err, res) => {
      err ? reject(err) : resolve(res)
    })
  })
}

const getDistrictByName = (parent, args) => {
  return new Promise((resolve, reject) => {
    District.find({name: args.name}, (err, res) => {
      if (err || res.length == 0) {return reject(err)}
      return resolve(res)
    })
  })
}

module.exports = { addDistrict, getDistrict, getDistricts, getDistrictByName }


// getDistricts: (parent, args) => {
//   return District.find({});
// },
// getDistrict: (parent, args) => {
//   return new Promise((resolve, reject) => {
//     District.findById(args.id, (err, res) => {
//       err ? reject(err) : resolve(res)
//     })
//   })
// }
