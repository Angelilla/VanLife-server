var express = require('express');
var router = express.Router();

const { isLoggedIn } = require("../helpers/middlewares");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//USER
router.get('/profile', isLoggedIn(), (req, res, next) => {
    
  const currUser = req.session.currentUser._id;
  console.log(currUser)

  User
      .findById(currUser)
      .populate ('createdtrips favoritetrips')
      .then((response) => res.json(response))
      .catch(error => {
          console.log(error);
      });
});

router.post('/edit-profile', isLoggedIn(), (req, res, next) => {
    
  const currUser = req.session.currentUser._id;
  console.log(currUser)

  const { username, email, password, profilepic } = req.body;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  User
        .findByIdAndUpdate(
            req.session.currentUser._id ,
            { $set: { username, email, password: hashedPassword, profilepic } },
            { new: true }
        )
        .then((userEDit) => {
            console.log(userEDit)
            req.session.currentUser = userEDit;
            res.json(userEDit);
        })
        .catch(error => {
            console.log('Error while retrieving user details: ', error);
        })

});

router.post('/delete-profile', isLoggedIn(), (req, res, next) => {
    
  const currUser = req.session.currentUser._id;
  //console.log(currUser)

  User
      .findByIdAndDelete(currUser)
      //.then(() => res.json(response))
      .catch(error => {
          console.log(error);
      });
});

module.exports = router;
