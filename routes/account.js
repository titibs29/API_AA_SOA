const express = require('express');

const router = express.Router();

const accountCtrl = require('../controllers/account');

//login
router.post('/login', accountCtrl.login);

//signin
router.post('/signin', accountCtrl.signin);

// affiche un seul compte
router.get('/:id', accountCtrl.showOne);

//modifie un compte
router.put('/:id', accountCtrl.modify);

// supprime un compte
router.delete('/:id', accountCtrl.del);

// afficher tout les comptes
router.get('/', accountCtrl.showAll);

module.exports = router;