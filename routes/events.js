const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const Events = require('../models/Event');
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const userEditAccess = require("../middleware/userEditAccess");


router.get('/events', (req, res, next) => {
    console.log(req.user)
    Events.find()
    .then(eventsFromDB => {
        eventsFromDB
        .sort(function(a, b) {
            var keyA = new Date(a.date),
              keyB = new Date(b.date);
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          })
            // .map(event => {
            //    return {
            //        ...event,
            //        date: event.date.slice(0,10)
            //    } 
            // })
        //   })
        //console.log(eventsFromDB)
        // render the view
        res.render('events/index.hbs', { eventList: eventsFromDB })
    })
    .catch(err => next(err))
})

router.get('/events/add',isLoggedIn, (req, res, next) => {
    res.render('events/addEvent')
})

router.post('/events/add', isLoggedIn, (req, res, next) => {
  //  console.log(req.user)
    //console.log(req.body)
    //const id = req.params
    //console.log(id)
    //res.send(req.body)
    const {title, date,genre,street,city,zipcode,about,indoors,cost,minAge,artists} = req.body
    if(zipcode.length!==5){
        res.render('events/addEvent', { message: 'Please provide a valid zipcode' });
        return
    }
    if(title.length===0){
       // console.log('date ======' + date.length)
        res.render('events/addEvent', { message: 'Please provide a Title for your event' });
        return
    }
    if(date.length===0){
        res.render('events/addEvent', { message: 'Please choose a date' });
        return
    }
        // var now = new Date()
        // var month = now.getMonth()+1
        // var year = now.getFullYear()
        // var day = now.getDay()
        // console.log(date)
        // console.log(now)
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

router.get('/myevents', isLoggedIn, (req, res, next) => {
   //s console.log(reqs)
	Events.find({
        creator: req.user
    }).populate('creator')
		.then(eventsFromDB => {
			res.render('events/viewEvents.hbs', { events: eventsFromDB })
		})
        
		.catch(err => next(err))
});



router.get('/event/:id', (req, res, next) => {
	const id = req.params.id
    const loggedInUserName = req.user
    let identification = false
	Events.findById(id).populate('creator')
		.then(eventsFromDB => {
            if(req.user){
                if(loggedInUserName.username===eventsFromDB.creator.username){
                    identification = true
                }
            }
           
            
			res.render('events/eventDetails', { events: eventsFromDB, loggedInUserName: loggedInUserName, identification: identification })
		})
		.catch(err => next(err))
});


router.get('/event/edit/:id', userEditAccess,(req, res, next) => {
	const id = req.params.id

	Events.findById(id)
		.then(eventsFromDB => {
			console.log(eventsFromDB)
		
			res.render('events/editForm', { events: eventsFromDB })
		})
		.catch(err => next(err))
});

router.post('/event/edit/:id', userEditAccess,(req, res, next) => {
	const id = req.params.id
	// retrieve the values from the request body
	const { title, date ,genre, street, city, zipcode, about, artists } = req.body
	
	Events.findByIdAndUpdate(id, {
		title,
		date,
		genre,
		street,
        city,
        zipcode,
        about,
        artists,

	}, { new: true })
		.then(updatedEvent => {
			console.log(updatedEvent)
			// redirect to the details of the updated book
			res.redirect(`/event/${updatedEvent._id}`)
		})
		.catch(err => next(err))
});



router.get('/event/delete/:id',userEditAccess, (req,res,next) => {
	const id = req.params.id
    Events.findByIdAndDelete(id)
	.then(() => {
		res.redirect('/events')
	})
	.catch(err => next(err))
})
module.exports = router
