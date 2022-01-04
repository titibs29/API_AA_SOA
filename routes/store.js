const express = require('express');

const router = express.Router();

const authProp = require('../middleware/authProp');

const storeCtrl = require('../controllers/store');


// afficher un article
router.get('/:id', storeCtrl.showOne);

// creer un article
router.post('/', storeCtrl.create);

//modifier un article
router.put('/:id', storeCtrl.modify);

//supprimer un article
router.delete('/:id', storeCtrl.del);

// afficher tout le magasin
router.get('/', storeCtrl.showAll);

module.exports = router;