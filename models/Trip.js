const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const tripSchema = new Schema({
    name: String,
    //initlocation: String,
    //finallocation: String,
    traveler: { type: Schema.Types.ObjectId, ref: 'User' },
    followers: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
    comments: [{
        review: String,
        creator: { type: Schema.Types.ObjectId, ref: 'User' }
    }],
    initdate: Date,
    gallery: []
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
