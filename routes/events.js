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
// router.post('/events', (req, res, next) => {
// 	// create the book using the values from the request body	
// 	// console.log(req.body)
// 	// const title = req.body.title
// 	const { title, description, author, rating } = req.body
// 	// console.log(title, description, author, rating)

// 	// create a new book
// 	Book.create({
// 		title: title,
// 		description: description,
// 		rating: rating,
// 		author: author
// 	})
// 		.then(createdBook => {
// 			console.log(createdBook)
// 			// show the book details for the created book
// 			// res.render('books/details', { book: createdBook })
// 			res.redirect(`/books/${createdBook._id}`)
// 		})
// });

module.exports = router