const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');

const Account = require('../models/account');


// login
exports.login = (req, res, next) => {
    console.log('login');

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
    res.sendStatus(200);
};

//modifie un compte
exports.modify = (req, res, next) => {
    console.log('modifie un compte');
    res.sendStatus(200);
};

// supprime un compte
exports.del = (req, res, next) => {
    console.log('supprime un compte - securite à implementer');
    if (1/* proprio ou admin*/) {
        Account.findOne({ _id: req.params.id })
            .then(account => {
                Account.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'compte supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        res.sendStatus(403);
    }

};

// afficher tout les comptes
exports.showAll = (req, res, next) => {
    console.log('montre tout les comptes');
    res.sendStatus(200);
};