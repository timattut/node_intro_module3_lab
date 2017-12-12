
//
// init-source-db.js
//

const MongoClient = require('mongodb').MongoClient;

const {
  databaseURL,
  sourceDB,
  customerCol,
  addressCol
} = require('./db-config');

const URL = databaseURL + sourceDB;

const CustomerData = './data/m3-customer-data.json';
const AddressData = './data/m3-customer-address-data.json';

MongoClient.connect(URL).then(function(db) {

  Promise.all([

    db.collection(customerCol).deleteMany({}),
    db.collection(addressCol).deleteMany({})

  ]).then(function(res){

    console.log(`${sourceDB}:${customerCol}: ${res[0].deletedCount} docs deleted`);
    console.log(`${sourceDB}:${addressCol}: ${res[1].deletedCount} docs deleted`);

    // import customers; replace 'id' with '_id'
    let customers = require(CustomerData).map(function(customer){
      customer._id = customer.id;
      delete customer.id;
      return customer;
    });

    // import addresses; add '_id' field
    let addresses = require(AddressData).map(function(address, index){
      address._id = (index + 1).toString();
      return address;
    });

    Promise.all([

      db.collection(customerCol).insertMany(customers),
      db.collection(addressCol).insertMany(addresses)

    ]).then(function(res){

      db.close();

      console.log(`${sourceDB}:${customerCol}: ${res[0].insertedCount} docs inserted`);
      console.log(`${sourceDB}:${addressCol}: ${res[1].insertedCount} docs inserted`);

    }).catch(function(err){

      db.close();
      console.error(err);

    }); // insertMany

  }).catch(function(err){

    db.close();
    console.error(err);

  }); // deleteMany

}).catch(function(err){

  console.error(err);

}); // connect
