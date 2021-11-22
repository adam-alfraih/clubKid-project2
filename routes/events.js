const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const Events = require('../models/Event');

router.get('/events', (req, res, next) => {
    Events.find()
    .then(eventsFromDB => {
        console.log(eventsFromDB)
        // render the view
        res.render('events/index.hbs', { eventList: eventsFromDB })
    })
    .catch(err => next(err))
})

router.get('/events/add', (req, res, next) => {
    res.render('events/addEvent')
})

router.post('/events/add', (req, res, next) => {
    console.log(req.body)
    //res.send(req.body)
    const {title, date,genre,street,city,zipcode,about,indoors,cost,minAge,artists} = req.body
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
        artists: artists
    })
    .then(createdCel => {
        res.redirect('add')
    })
})


router.get('/event/:id', (req, res, next) => {
	const id = req.params.id
	Events.findById(id)
		.then(eventsFromDB => {
			res.render('events/eventDetails', { events: eventsFromDB })
		})
		.catch(err => next(err))
});


module.exports = router