const Booking = require('../models/booking');
const AccBook = require('../models/acc-book');

const auth = require('../middleware/auth');

// affiche les réservations associées a ID
exports.showByAcc = (req, res, next) =>{
    console.log('montre toute les réservations associées à un compte');
    res.sendStatus(200);
};

// affiche la réservation
exports.showOne = (req, res, next) =>{
    console.log('montre une réservation');
    res.sendStatus(200);
};

//crée une nouvelle réservation
exports.create = (req, res, next) =>{
    console.log('crée une réservatiopn');
    res.sendStatus(200);
};

//modifie une réservation
exports.modify = (req, res, next) =>{
    console.log('modifie une réservation');
    res.sendStatus(200);
};

//supprime une réservation
exports.del = (req, res, next) =>{
    console.log('supprime une réservation');
    res.sendStatus(200);
};