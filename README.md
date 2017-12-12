# node_intro_module3_lab
edX Introduction to NodeJS   
Module 3 Assignment Lab: MongoDB Migration Node Script

> 1.
> Walk us through the design of your project.

The file structure of the project:

~~~
db-config.js        // database configuration used by the other modules;
                    // defines db url, db names, and collection names

init-source-db.js   // stores data from the associated json files
                    // into corresponding collections in the source database;
                    // DELETES SOURCE COLLECTIONS' PREVIOUS CONTENT

migrate-data.js     // performs the migration ie. reads data from the source
                    // database and stores it into destination database;
                    // DELETES DESTINATION COLLECTION'S PREVIOUS CONTENT

[data]              // associated data in json files

[test]
  test-destination-content.js
                    // checks if the destination database includes
                    // expected content

~~~

Note:   
The values of `id` fields are copied to `_id`s.
`id`s are not stored into the database.  


> 2.
> How did you test your project to verify that it works?

The `test` folder includes [mocha](http://mochajs.org) test script,
which use [chai](http://chaijs.com) assertations. The script checks if
the destination database includes expected content. To run the script
type `mocha` or `npm test`.

> 3.
> Let us know if anything doesn't work as intended so
> your reviewers will know ahead of time.

\-
