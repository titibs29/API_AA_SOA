const express = require('express');

const router = express.Router();

const authProp = require('../middleware/authProp');

const piCtrl = require('../controllers/pi');


// affiche un pi
router.get('/:id', piCtrl.showOne);

// crée un  pi
router.post('/', piCtrl.create);

// modifie un pi
router.put('/:id', piCtrl.modify);

// supprime un pi
router.delete('/:id', piCtrl.del);

// affiche la liste
router.get('/', piCtrl.showAll);

module.exports = router;