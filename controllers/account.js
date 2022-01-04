const Account = require('../models/account');


// login
exports.login = (req, res, next) =>{
    console.log('login');
};

//signin
exports.signin = (req, res, next) =>{
    console.log('signin');
};

// affiche un seul compte
exports.showOne = (req, res, next) =>{
    console.log('montre un compte');
};

//modifie un compte
exports.modify = (req, res, next) =>{
    console.log('modifie un compte')
};

// supprime un compte
exports.del = (req, res, next) =>{
    console.log('supprime un compte');
};

// afficher tout les comptes
exports.showAll = (req, res, next) =>{
    console.log('montre tout les comptes');
};