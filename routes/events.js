const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const Events = require('../models/Event');
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");


router.get('/events', (req, res, next) => {
    Events.find()
    .then(eventsFromDB => {
        console.log(eventsFromDB)
        // render the view
        res.render('events/index.hbs', { eventList: eventsFromDB })
    })
    .catch(err => next(err))
})

router.get('/events/add',isLoggedIn, (req, res, next) => {
    res.render('events/addEvent')
})

router.post('/events/add', isLoggedIn, (req, res, next) => {
    //console.log(req.body)
    //const id = req.params
    //console.log(id)
    //res.send(req.body)
    const {title, date,genre,street,city,zipcode,about,indoors,cost,minAge,artists} = req.body
    if(zipcode.length!==5){
        res.render('events/addEvent', { message: 'Please provide a valid zipcode' });
        return
    }
   console.log(req.user) 
    Events.create({
        title: title,
        date: date,
        genre: genre,
        address: {
            street: street,
            city: city,
            zipcode: zipcode,
        },
        about: about,
        indoors: indoors,
        cost: cost,
        minAge: minAge,
        artists: artists,
        creator: req.user._id
    })
    .then(createdEvent => {    
        res.redirect(`/event/${createdEvent._id}`)   
    })
})

router.get('/event/:id', (req, res, next) => {
	const id = req.params.id
	Events.findById(id).populate('creator')
		.then(eventsFromDB => {
			res.render('events/eventDetails', { events: eventsFromDB })
		})
		.catch(err => next(err))
});

module.exports = router