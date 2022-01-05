const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Account = require('../models/account');


// login
exports.login = (req, res, next) =>{
    console.log('login');
    res.sendStatus(200);
};

//signin
exports.signin = (req, res, next) => {
    console.log('création du compte '+ req.body.name);
    Account.findOne({ name: req.body.name })
        .then(user => {
            if(user){
                console.log('utilisateur déjà existant')
                res.status(400).json({ message: "utilisateur déjà existant" });
            }else{
                bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        const account = new Account({
                            name: req.body.name,
                            password: hash,
                            role: 2,
                            birthday: req.body.birthday
                        });
                        account.save()
                            .then(() => {
                                Account.findOne({ name: req.body.name })
                                    .then(user => res.status(201).json({ message: user._id }))
                                    .catch(error => res.status(500).json({ error }));
                            })
                            .catch(error => res.status(400).json({ error }));
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
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