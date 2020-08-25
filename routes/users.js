var express = require('express');
var router = express.Router();

const { isLoggedIn } = require("../helpers/middlewares");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User");
const Trip = require("../models/Trip");

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

router.put('/edit-profile', isLoggedIn(), (req, res, next) => {
    
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
      .then(req.session.destroy())
      .catch(error => {
          console.log(error);
      });
});

router.post('/new-trip', isLoggedIn(), (req, res, next) => {
    
    const { name, traveler, initdate } = req.body;
    const currUser = req.session.currentUser._id;
  
    Trip
      .create({ name, traveler, initdate })
      .then(newTrip => {
  
        console.log(newTrip)
        res.json(newTrip) 
  
        const tripId = newTrip._id;
        User.findByIdAndUpdate(
          currUser,
          { $push: { createdtrips: tripId} },
          { new: true }
        )
        .then((user) => {
          console.log(user);
          res.json(user)
        })
        .catch(error => {
          console.log(error);
        });
  
      })
      //.status(200)
      .catch(error => {
        console.log('Error while create the trip: ', error);
      });
  })

module.exports = router;
