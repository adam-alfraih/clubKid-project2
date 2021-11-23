const Events = require('../models/Event');
module.exports = (req, res, next) => {
    // this middleware checks if the loggedInUser has created the viewed event
    Events.findById(req.params.id).populate('creator')
    .then(eventFromDb => {
        //res.send(req.user.username)
        if(req.user.username !== eventFromDb.creator.username ){
            res.redirect('/')
        }
        else{
            next();
        }
    })
};