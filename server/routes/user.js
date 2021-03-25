const User = require("../db/models/user");
const express = require("express");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require('sharp');
const {sendWelcomeEmail} = require('../email/email');
const {sendCancelationEmail} = require('../email/email');
const router = new express.Router();


router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});


router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send();
    }
    // no need to set status 200, as it is default
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});



router.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const user = await User.findById(req.params.id);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    // below code does not run with middleware
    //   const user = await User.findByIdAndUpdate(req.params.id, req.body,{new:true, runValidators:true})

    if (!user) {
      return res.status(404).send();
    }

    // no need to set status 200, as it is default
    res.send(user);
  } catch (e) {
    res.status(400);
    res.send();
  }
});

// router.delete("/users/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);

//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

const upload = multer({
  // dest:'avatars',
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return cb(new Error("Please upload a jpg/jpeg or png file"));
    }

    // if (!file.originalname.match(/\.(doc|docx)$/)){
    //   return cb(new Error("Please upload a doc/docx"))
    // }

    // if (!file.originalname.endsWith('.pdf')){
    //   return cb(new Error('Please upload a pdf'));
    // }

    cb(undefined, true);
  },
});



router.get('/users/:id/avatar', async (req,res)=>{
  try{
    const user = await User.findById(req.params.id)

    if(!user || !user.avatar){
      throw new Error();
    }

    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  }
  catch(e){
    res.status(404).send();
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);


router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancelationEmail(req.user.email, req.user.name);

    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
