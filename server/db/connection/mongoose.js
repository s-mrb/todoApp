

/*  
              MONGODB  
*/

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const connectionURL = 'mongodb://127.0.0.1:27017';
// const databaseName = 'task-manager';
// MongoClient.connect(connectionURL,{useNewUrlParser: true, useUnifiedTopology: true }, (error, client)=>{
//     if (error){
//         return console.log(error);
//     }
//     const db = client.db(databaseName);
//     db.collection('users').insertOne({
//         name : 'Name',
//         age: "age"
//     });
// });

/*
                                              MONGOOSE
*/


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB_URL,{
  useCreateIndex : true,
  useNewUrlParser : true,
  useUnifiedTopology: true
});
