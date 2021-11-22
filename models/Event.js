const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User.model');

const eventSchema = new Schema({
    title: String,
    date: String,
    genre: String,

    address: {
        street: String,
        city: String,
        zipcode: String
    }, 

    about: String,
    indoors: String,
    cost: Number,
    minAge: Number,

    artists: String,

	creator: {
		type: Schema.Types.ObjectId,
		// this is the name of the model that the _id refers to 
		ref: 'User'
	},

}, {
	timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;