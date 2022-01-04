const Account = require('../models/account');


// login
exports.login = (req, res, next) =>{
    console.log('login');
    res.sendStatus(200);
};

//signin
exports.signin = (req, res, next) =>{
    console.log('signin');
    res.sendStatus(200);
};

// affiche un seul compte
exports.showOne = (req, res, next) =>{
    console.log('montre un compte');
    res.sendStatus(200);
};

//modifie un compte
exports.modify = (req, res, next) =>{
    console.log('modifie un compte');
    res.sendStatus(200);
};

// supprime un compte
exports.del = (req, res, next) =>{
    console.log('supprime un compte');
    res.sendStatus(200);
};

// afficher tout les comptes
exports.showAll = (req, res, next) =>{
    console.log('montre tout les comptes');
    res.sendStatus(200);
};