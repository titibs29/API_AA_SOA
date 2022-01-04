const Pi = require('../models/pi');

// affiche un pi
exports.showOne = (req, res, next) =>{
    console.log('affiche un pi');
    res.sendStatus(200);
};

// crée un  pi
exports.create = (req, res, next) =>{
    console.log('crée un pi');
    res.sendStatus(200);
};

// modifie un pi
exports.modify = (req, res, next) =>{
    console.log('modifie un pi');
    res.sendStatus(200);
};

// supprime un pi
exports.del = (req, res, next) =>{
    console.log('supprime un pi');
    res.sendStatus(200);
};

// affiche la liste
exports.showAll = (req, res, next) =>{
    console.log('affiche la liste des pi');
    res.sendStatus(200);
};