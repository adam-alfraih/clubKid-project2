const mongoose = require('mongoose')
// const Book = require('./models/Book')
const Event = require('./models/Event')

// open up the connection to mongo
mongoose.connect('mongodb://localhost/project-2')

const events = [
	
	{
		title: "Club Event",
        date: "2021-22-11",
        genre: "Techno",
		about:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
        address: {
            street: 'Skalitzer Str 100',
            city: 'Berlin',
            zipcode: '38333'
        }, 
		artists: "DVS1",
		// creator: {{id}}
        indoors: 'outside',
        cost: '15',
        minAge: '18'


	}
];


events.forEach(event => {
    Event.create(event)
    .then(createdEvent => {
        console.log('success')
    })
})

// Event.insertMany(events)
// 	.then(createdEvent => {
// 	console.log('success')
//     mongoose.connection.close()
// 	})
//     .catch(err => {
//         console.log(err)
//     })

