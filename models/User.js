const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({ 
    username: { type: String, required: true },
    email: { 
        type: String, 
        match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 
        unique: true 
    },
    password: { type: String, minlength: 6, required: true },
    profilepic: { type: String, default: '/images/logo.jpeg' },
    createdtrips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
    favoritetrips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }]
    
});

const User = mongoose.model("User", userSchema);

module.exports = User;
