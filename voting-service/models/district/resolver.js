const District = require("./schema").Districts;


const addDistrict = (parent, args) => {
  console.log("in here")
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

module.exports = { addDistrict, getDistrict, getDistricts }


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
