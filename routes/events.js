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
        // eventsFromDB
        // const sliced = eventsFromDB.map(event => {
        //     return event.date.toString().slice(0,10)
        // })
        // console.log('dates', sliced)


        // /events | THIS IS THE CODE THAT ORGANIZES EVENTS FROM EARLIEST TO LATEST
        eventsFromDB
        .sort(function(a, b) {
            var keyA = new Date(a.date),
              keyB = new Date(b.date);
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          })

           // /events | DISPLAYS EVENTS AS A STRING -> 'Mon Nov 01',
            .map(event => {
               return {
                   ...event,
                   date: event.date
               } 
            })


        //   })
           console.log(eventsFromDB)
            // var newDate = eventsFromDB.date.toDateString()
            // console.log(newDate)
        res.render('events/index.hbs', { eventList: eventsFromDB, user: req.user})
    })
    .catch(err => next(err))
})




// /events |THIS IS FOR THE DATE RANGE FILTER
router.post('/events/find', (req, res, next) => {
    const {dateFrom, dateTo} = req.body
    if(dateFrom.length===0 ||dateTo.length===0){
        res.render('events/', { message: 'Please provide a date',user: req.user });
        return
    }
    // console.log(dateFrom)
    // console.log(dateTo)
    Events.find({date: {$gte: new Date (dateFrom), $lte: new Date (dateTo) } })
    .then(eventsFromDB => {
        console.log(eventsFromDB)
        res.render('events/index.hbs', { eventList: eventsFromDB,user: req.user })
    })
    
    .catch(err => next(err))
});



router.get('/events/add',isLoggedIn, (req, res, next) => {
    res.render('events/addEvent', {user: req.user})
})

router.post('/events/add', isLoggedIn, (req, res, next) => {
  
    const {title, date,genre,street,city,zipcode,about,indoors,cost,minAge,artists} = req.body
    console.log(date)
    if(zipcode.length!==5){
        res.render('events/addEvent', { message: 'Please provide a valid zipcode',user: req.user });
        return
    }
    if(title.length===0){
       // console.log('date ======' + date.length)
        res.render('events/addEvent', { message: 'Please provide a Title for your event',user: req.user });
        return
    }
    if(date.length===0){
        res.render('events/addEvent', { message: 'Please choose a date',user: req.user });
        return
    }
    const newdate = new Date(date)
    var newD = newdate.toDateString()
    
   //NEW ENTRYYYY

   //END OF NEW ENTRY

    Events.create({
        title: title,
        date: date,
        dateString: newD,
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
			res.render('events/viewEvents.hbs', { events: eventsFromDB ,user: req.user})
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
           
            
			res.render('events/eventDetails', { events: eventsFromDB, loggedInUserName: loggedInUserName, identification: identification,user: req.user })
		})
		.catch(err => next(err))
});


router.get('/event/edit/:id', userEditAccess,(req, res, next) => {
	const id = req.params.id

	Events.findById(id)
		.then(eventsFromDB => {
			console.log(eventsFromDB.date)
            var newDate = eventsFromDB.date.getFullYear() + '-' + (eventsFromDB.date.getMonth()+1) + '-' + eventsFromDB.date.getDate()
            console.log('the new date ' +newDate)
			res.render('events/editForm', { events: eventsFromDB, newDate: newDate, user: req.user})
		})
		.catch(err => next(err))
});

router.post('/event/edit/:id', userEditAccess,(req, res, next) => {
	const id = req.params.id
	// retrieve the values from the request body
	const { title, date ,genre, street, city, zipcode, about, artists } = req.body
	const newdate = new Date(date)
    var newD = newdate.toDateString()
	Events.findByIdAndUpdate(id, {
		title,
		date,
        dateString: newD,
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

router.post('/event/search', (req, res, next) => {
    const searchItem = req.body.search
    //Events.find(searchItem)
    
    Events.find({$text: {$search: searchItem.toLowerCase()}})
    .then(findedEvents => {
        res.render('events/viewEvents.hbs', { events: findedEvents ,user: req.user})
    })
})
module.exports = router