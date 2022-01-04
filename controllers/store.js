const Article = require('../models/article');

// afficher un article
exports.showOne = (req, res, next) =>{
    console.log('affiche un article');
};

// creer un article
exports.create = (req, res, next) =>{
    console.log('crée un article');
};

//modifier un article
exports.modify = (req, res, next) =>{
    console.log('modifie un article');
};

//supprimer un article
exports.del = (req, res, next) =>{
    console.log('supprime un article');
};

// afficher tout le magasin
exports.showAll = (req, res, next) =>{
    console.log('affiche tout le magasin');
};