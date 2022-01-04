const express = require('express');

const router = express.Router();

const authProp = require('../middleware/authProp');

const webCtrl = require('../controllers/web');


// rediriger vers la page web
router.get('/', webCtrl);

module.exports = router;