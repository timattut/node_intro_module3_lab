
process.env.NODE_ENV = 'test';

//
// test-destination-content.js
//

const chai = require('chai');
chai.should();

const MongoClient = require('mongodb').MongoClient;

const {
  databaseURL,
  destinationDB,
  customerCol
} = require('../db-config');

const URL = databaseURL + destinationDB;

//
// sample customers
//

const cust_1 = {
  "_id": "1",
  "first_name": "Ario",
  "last_name": "Noteyoung",
  "email": "anoteyoung0@nhs.uk",
  "gender": "Male",
  "ip_address": "99.5.160.227",
  "ssn": "509-86-9654",
  "credit_card": "5602256742685208",
  "bitcoin": "179BsXQkUuC6NKYNsQkdmKQKbMBPmJtEHB",
  "street_address": "0227 Kropf Court",
  "country":"United States",
  "city":"New Orleans",
  "state":"Louisiana",
  "phone":"504-981-8641"
};

const cust_30 = {
  "_id": "30",
  "first_name": "Merrie",
  "last_name": "Baldacco",
  "email": "mbaldaccot@slate.com",
  "gender": "Female",
  "ip_address": "181.115.108.14",
  "ssn": "339-27-2129",
  "credit_card": "3581751255145905",
  "bitcoin": "1Ghx1JUMXRbUUUp4ecjm9h13zAhjKkLC2G",
  "street_address": "06 Butterfield Place",
  "country":"United States",
  "city":"Irving",
  "state":"Texas",
  "phone":"817-838-0774"
};

const cust_1000 = {
  "_id": "1000",
  "first_name": "Gisele",
  "last_name": "Wigmore",
  "email": "gwigmorerr@nature.com",
  "gender": "Female",
  "ip_address": "42.153.152.249",
  "ssn": "832-14-1698",
  "credit_card": "67617562455393416",
  "bitcoin": "19Kvf5X9LdYUymh2oeNA9gGh6rR4ykoe6x",
  "street_address": "2374 Lillian Court",
  "country":"United States",
  "city":"Anniston",
  "state":"Alabama",
  "phone":"256-300-9875"
};

//
// tests
//

describe('Test Database Content', function() {

  let db = null;

  before(function(done){
    MongoClient.connect(URL, function(err, dbD) {
      db = dbD;
      done();
    });
  });

  after(function(){
    db.close(function(){
      setTimeout(function () { // wait to get the test summary
        process.exit(0);
      }, 100);
    });
  });

  it('should contain 1000 customers', function(done){
    db.collection(customerCol).find().count(function(err, count){
      count.should.be.equal(1000);
      done();
    });
  });

  it('should contain proper customer #1', function(done){
    db.collection(customerCol).findOne({_id:"1"}, function(err, customer){
      customer.should.be.deep.equal(cust_1);
      done();
    });
  });

  it('should contain proper customer #30', function(done){
    db.collection(customerCol).findOne({_id:"30"}, function(err, customer){
      customer.should.be.deep.equal(cust_30);
      done();
    });
  });

  it('should contain proper customer #1000', function(done){
    db.collection(customerCol).findOne({_id:"1000"}, function(err, customer){
      customer.should.be.deep.equal(cust_1000);
      done();
    });
  });

}); // describe
