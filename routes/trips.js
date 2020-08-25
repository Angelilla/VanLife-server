var express = require('express');
var router = express.Router();

const { isLoggedIn } = require("../helpers/middlewares");

const User = require('../models/User');
const Trip = require('../models/Trip');



router.get('/:id', (req, res, next) => {
    
  Trip
      .findById(req.params.id)
      .populate('comments.creator traveler followers')
      .then(tripDetail => {
          //console.log(tripDetail);
          res.json( tripDetail)
              
      })
      .catch(error => {
      console.log(error);
      });
  
});

router.get('/', (req, res, next) => {

  Trip
    .find()
    .then(allTrips => {
      res.json(allTrips).status(200)
    })
    .catch(error => {
      console.log(error);
    });

})

router.put('/:id/edit', (req, res, next) => {
  
  const { name, initdate } = req.body;

  Trip
    .findByIdAndUpdate(
      req.params.id,
      { $set: { name, initdate } },
      { new: true }
    )
    .then( (tripUpdate) => {
      console.log(tripUpdate);
      res.json(tripUpdate);
    })
    .catch(error => {
      console.log('Error while retrieving trip details: ', error);
  })
});

router.post('/:id/delete',  (req, res, params) => {

  const currUser = req.session.currentUser._id;

  Trip
    .findByIdAndDelete(req.params.id)
    .then(delTrip => {

      User
        .findByIdAndUpdate(
          currUser,
          { $pull: { createdtrips: delTrip._id } },
          { new: true }
        )
        .then((user) => {
          console.log(user);
          res.json(user)
        })
        .catch(error => {
          console.log(error);
        });

        res.json(delTrip)
    })
    .catch(error => {
      console.log(error);
    });
});

router.post('/:id/add-favourite',  (req, res, params) => {

  const {tripId, userId} = req.body;

  Trip
    .findByIdAndUpdate(
      req.params.id,
      { $push: {followers: userId} },
      { new: true })
    .then(favouriteTrip => {

      //console.log(favouriteTrip)
      User
        .findByIdAndUpdate(
        userId,
        { $push: { favoritetrips: tripId } },
        { new: true }
        )
        .then((user) => {
            //console.log(user);
            res.json(user)
        })
        .catch(error => {
          console.log(error);
        });

        res.json(favouriteTrip)
    })
    .catch(error => {
      console.log(error);
    });

});

router.post('/:id/delete-favourite',  (req, res, params) => {

  const {tripId, userId} = req.body;

  Trip
    .findByIdAndUpdate(
      req.params.id, 
      { $pull: {followers: userId} },
      { new: true }
    )
    .then(favouriteTrip => {

      //console.log(favouriteTrip)
      User
        .findByIdAndUpdate(
          userId,
          { $pull: { favoritetrips: tripId } },
          { new: true }
        )
        .then((user) => {
          console.log(user);
          res.json(user)
        })
        .catch(error => {
          console.log(error);
        });

        res.json(favouriteTrip)

    })
    .catch(error => {
      console.log('Error deleting the trip: ', error);
  });

});

router.post('/:id/review',  (req, res, params) => {

  const currUser = req.session.currentUser._id;
  const { review } = req.body;
  const comment = { review : review, creator: currUser };

  const tripId = req.params.id;
  console.log(comment);
  Trip
    .findByIdAndUpdate(
    tripId,
    { $push: { comments: comment} },
    { new: true }
    )
    .then((review) => {
      console.log('comentario creado', review);

      console.log(review)
      res.json(review)
        
    })
    .catch(error => {
      console.log(error);
    });

});


module.exports = router;