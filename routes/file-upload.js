const express = require("express");
const router = express.Router();

const User = require('../models/User');
const {isLoggedIn} = require("../helpers/middlewares");

// include CLOUDINARY:
const uploader = require("../config/cloudinary");

router.post("/upload", uploader.single("profilepic"), (req, res, next) => {
  console.log('file is: ', req.file)
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  res.json({ secure_url: req.file.secure_url });
});

router.patch('/update-photo', (req, res, next) => {
  //console.log(req.session.currentUser);
  const currUser = req.session.currentUser._id;
  const { profilepic } = req.body;
  console.log(profilepic)
  User
      .findByIdAndUpdate(
        currUser,
        {profilepic},
        { new: true }
      )
      .then((user) => {
        console.log(user)
        req.session.currentUser = user;
      })
      .catch(error => {
        console.log('Error while retrieving user details: ', error);
      })

});

module.exports = router;