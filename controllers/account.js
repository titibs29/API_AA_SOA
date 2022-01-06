const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');
const account = require('../models/account');

const Account = require('../models/account');


// login
exports.login = (req, res, next) => {
    console.log('login de', req.body.name);

    Account.findOne({ name: req.body.name })
        .then(account => {
            if (!account) {
                return res.status(401).json({ error: 'utilisateur introuvable !' });
            }

            bcrypt.compare(req.body.password, account.password, (err, ret) => {
                if (err) return res.status(500).json({ error });
                if (!ret) return res.status(401).json({ error: 'mot de passe incorrect !' });

                res.status(200).json({
                    userId: account._id,
                    token: jwt.sign(
                        { userId: account._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                });
            })


        })
        .catch(error => res.status(500).json({ error }));

};

//signin
exports.signin = (req, res, next) => {
    console.log('création du compte de ' + req.body.name);
    Account.findOne({ name: req.body.name })
        .then(user => {
            if (user) {
                console.log('erreur: utilisateur déjà existant')
                res.status(400).json({ message: "utilisateur deja existant" });
            } else {
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
                                    .then(user => res.status(201).json({ userId: user._id }))
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
exports.showOne = (req, res, next) => {
    console.log('montre un compte');
    const token = req.body.token;
    const id = req.params.id;
    const proprio = auth.isProp(token, id);
    auth.isAdmin(token)
        .then(admin => {
            if (proprio || admin) {
                Account.findOne({ _id: req.params.id })
                    .then(account => res.status(200).json(account))
                    .catch(error => res.status(404).json({ error }));
            } else {

                res.sendStatus(403);
            }
        })
        .catch(error => res.status(500).json({ error }));
};

//modifie un compte
exports.modify = (req, res, next) => {
    console.log('modifie un compte');
    const token = req.body.token;
    const id = req.params.id;
    const proprio = auth.isProp(token, id);
    auth.isAdmin(token)
        .then(admin => {
            if (proprio && !admin) {
                delete req.body.role;
            }
            if (proprio || admin) {

                if (req.body.password) {
                    bcrypt.hash(req.body.password, 10)
                        .then(hash => {
                            delete req.body.token;
                            delete req.body.password
                            account.updateOne({ _id: req.params.id }, { password: hash, _id: req.params.id, ...req.body })
                                .then(() => res.status(200).json({ message: 'compte modifié !' }))
                                .catch(error => res.status(400).json({ error }));
                        })
                        .catch(error => res.status(500).json({ error }));
                } else {
                    delete req.body.token;
                    account.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'compte modifié !' }))
                        .catch(error => res.status(400).json({ error }));
                }


            } else {

                res.sendStatus(403)

            };
        })
        .catch(error => res.status(500).json({ error }))






};

// supprime un compte
exports.del = (req, res, next) => {
    console.log('supprime un compte ');

    if (!req.body.token || !req.body.userId) {
        res.status(403).json({ message: 'informations manquantes !' });
    }
    const token = req.body.token;
    const idToDel = req.params.id;

    const proprio = auth.isProp(token, idToDel)
    auth.isAdmin(token)
        .then(admin => {

            if (admin || proprio) {

                Account.findOne({ _id: idToDel })
                    .then(account => {
                        if (!account) {
                            res.status(400).json({ message: "le compte n'existe pas" });
                        } else {
                            Account.deleteOne({ _id: req.params.id })
                                .then(() => res.status(200).json({ message: 'compte supprimé !' }))
                                .catch(error => res.status(400).json({ error }));
                        };
                    })
                    .catch(error => res.status(500).json({ error }));

            } else {

                res.sendStatus(403);
            };
        })
        .catch(error => res.status(500).json({ error }));

};

// afficher tout les comptes
exports.showAll = (req, res, next) => {
    console.log('montre tout les comptes');
    auth.isAdmin(req.body.token)
        .then(admin => {
            if (admin) {
                Account.find()
                    .then(accounts => res.status(200).json(accounts))
                    .catch(error => res.status(400).json({ error }));
            } else {
                res.sendStatus(403);
            }
        })
        .catch(error => res.status(500).json({ error }))
};