
//
// migrate-data.js
//

const assert = require('assert');
const parallel = require('async/parallel');

const MongoClient = require('mongodb').MongoClient;

const {
  databaseURL,
  sourceDB,
  destinationDB,
  customerCol,
  addressCol
} = require('./db-config');

const URL = databaseURL + sourceDB;

//
// obtain batch size
//

let = batchSize = parseInt(process.argv[2]);

if (![10, 50, 500].includes(batchSize)) {
  console.log('Usage: node migrate-data {10|50|500}')
  process.exit(1);
}

//
// migrate data
//

MongoClient.connect(URL).then(function(dbS) {

  let dbD = dbS.db(destinationDB);

  Promise.all([

    dbS.collection(customerCol).find().count(),
    dbS.collection(addressCol).find().count(),
    dbD.collection(customerCol).deleteMany({})

  ]).then(function(res){

    console.log(`${sourceDB}:${customerCol}: ${res[0]} docs counted`);
    console.log(`${sourceDB}:${addressCol}: ${res[1]} docs counted`);
    assert.equal(res[0], res[1], 'source collection sizes should be equal');

    console.log(`${destinationDB}:${customerCol}: ${res[2].deletedCount} docs deleted`);
    let docsTotal = res[0];

    //
    // prepare tasks
    //

    let tasks = [];

    for(var loopCounter = 0; loopCounter < docsTotal; loopCounter += batchSize) {

      let docsToSkip = loopCounter;

      tasks.push(function(callback){

        Promise.all([

          dbS.collection(customerCol).find().sort({_id:1}).skip(docsToSkip).limit(batchSize).toArray(),
          dbS.collection(addressCol).find().sort({_id:1}).skip(docsToSkip).limit(batchSize).toArray()

        ]).then(function(docsArr){

          let customerBatch = docsArr[0];
          let addressBatch = docsArr[1];

          console.log(`${sourceDB}:${customerCol}: ${customerBatch.length} docs read`);
          console.log(`${sourceDB}:${addressCol}: ${addressBatch.length} docs read`);

          customerBatch.forEach(function(customer, i){
            Object.assign(customer, addressBatch[i])
          });

          dbD.collection(customerCol).insertMany(customerBatch).then(function(res){

            console.log(`${destinationDB}:${customerCol}: ${res.insertedCount} docs inserted`);
            callback();

          }).catch(function(err){

            console.error(err);
            callback(err);

          }); // insertMany

        }).catch(function(err){

          console.error(err);
          callback(err);

        }); // find
      }); // push task
    } // for

    //
    // run tasks
    //

    parallel(tasks, function(err, results) {

      dbS.close();
      err || console.log('done');
      err && console.error('error');

    }); // parallel

  }).catch(function(err){

    console.error(err);
    dbS.close();

  }); // find & deleteMany

}).catch(function(err){

  console.error(err);

}); // connect
