const express = require('express');

const router = express.Router();

const authProp = require('../middleware/authProp');

const bookingCtrl = require('../controllers/booking');

// affiche les réservations associées a ID
router.get('/byAcc/:id', bookingCtrl.showByAcc);

// affiche la réservation
router.get('/:id', bookingCtrl.showOne);

//crée une nouvelle réservation
router.post('/', bookingCtrl.create);

//modifie une réservation
router.put('/:id', bookingCtrl.modify);

//supprime une réservation
router.delete('/:id', bookingCtrl.del);

module.exports = router;