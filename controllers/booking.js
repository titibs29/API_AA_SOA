const Booking = require('../models/booking');
const AccBook = require('../models/acc-book');

// affiche les réservations associées a ID
exports.showByAcc = (req, res, next) =>{
    console.log('montre toute les réservations associées à un compte');
};

// affiche la réservation
exports.showOne = (req, res, next) =>{
    console.log('montre une réservation');
};

//crée une nouvelle réservation
exports.create = (req, res, next) =>{
    console.log('crée une réservatiopn');
};

//modifie une réservation
exports.modify = (req, res, next) =>{
    console.log('modifie une réservation');
};

//supprime une réservation
exports.del = (req, res, next) =>{
    console.log('supprime une réservation');
};