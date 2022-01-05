const Article = require('../models/article');

const auth = require('../middleware/auth');

// afficher un article
exports.showOne = (req, res, next) =>{
    console.log('affiche un article');
    res.sendStatus(200);
};

// creer un article
exports.create = (req, res, next) =>{
    console.log('crée un article');
    res.sendStatus(200);
};

//modifier un article
exports.modify = (req, res, next) =>{
    console.log('modifie un article');
    res.sendStatus(200);
};

//supprimer un article
exports.del = (req, res, next) =>{
    console.log('supprime un article');
    res.sendStatus(200);
};

// afficher tout le magasin
exports.showAll = (req, res, next) =>{
    console.log('affiche tout le magasin');
    res.sendStatus(200);
};