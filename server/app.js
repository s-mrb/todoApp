/*          
                      ~~~~~~IMPORTANT~~~~~~

                      --IF YOU ARE ON LOCALHOST THEN DO JUST ONE CHANGE, 
                      WRITE PORT NUMBER BELOW AND IN client/js/weather.js and client/js/index.js

                      IF ON HEROKU THEN JUST COMMENT port_no from client/js/weather.js and client/js/index.js
*/
var port = process.env.PORT;



require("./db/connection/mongoose");
const userRoute = require("./routes/user");
const taskRoute = require("./routes/task");
const express = require("express");


const app = express();




// receive data as json automatically
app.use(express.json());

app.use(userRoute);
app.use(taskRoute);


const Task = require('./db/models/task');
const User = require("./db/models/user");

const main = async ()=>{
  // const task = await Task.findById('5f6eecbf3114a13ab33fda85');
  // await task.populate('owner').execPopulate();
  // console.log(task.owner)

  const user = await User.findById('5f6f136be1d0cc566e624067');
  await user.populate('tasks').execPopulate();
  console.log(user.tasks)
}
// main();




app.listen(port, () => {
  console.log("Server on port " + port);
});
