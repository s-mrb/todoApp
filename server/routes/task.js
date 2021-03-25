const Task = require("../db/models/task");
const express = require("express");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});


// Get /task?completed=true
// Get /task?limit=10&skip=0
router.get("/tasks", auth,async (req, res) => {

  const match = {}

  if(req.query.completed){
    match.completed = req.query.completed === 'true';
  }
  try {
    // const tasks = await Task.find({owner:req.user._id}); 
    // res.send(tasks);
    // OR

    await req.user.populate({
      path : 'tasks',
      match ,
      options:{
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip)
      }
    }).execPopulate();
    res.send(req.user.tasks);
    // no need to set status 200, as it is default
    
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {

  const _id = req.params.id;


  try 
  {
    // const task = await Task.findById(id);
    const task = await Task.findOne({_id, owner:req.user._id});
    console.log(task)
    if (!task) {
      return res.status(404).send();
    }
    // no need to set status 200, as it is default
    res.send(task);
  } catch (e) {
    res.status(500);
    res.send(e);
  }
});

router.patch("/task/:id",auth ,async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const task = await Task.findOne({_id:req.params.id, owner:req.user._id})

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => (user[update] = req.body[update]));
    await task.save();

    // no need to set status 200, as it is default
    res.send(user);
  } catch (e) {
    res.status(400);
    res.send();
  }
});

router.delete("/tasks/:id", auth,async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id})

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
