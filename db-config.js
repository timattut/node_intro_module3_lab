
//
// db-config.js
//

const prefix = 'edX-MS-DEV283x-m3-';

module.exports = {
  databaseURL: "mongodb://localhost:27017/",
  sourceDB: prefix + "source",
  destinationDB: prefix + "destination",
  customerCol: prefix + "customer",
  addressCol: prefix + "address"
}
