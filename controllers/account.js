const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const auth = require('../utils/auth');

const Account = require('../models/account');
const AccBook = require('../models/acc-book');
const { reject } = require('bcrypt/promises');


// login
exports.login = (req, res, next) => {
    try {
        if (!req.body.name) {
            throw "NoName"
        }
        if (!req.body.password) {
            throw "NoPassword"
        }
        const name = req.body.name;

        Account.findOne({ name: name })
            .then(account => {
                if (account) {

                    bcrypt.compare(req.body.password, account.password, (error, ret) => {
                        if (error) {
                            console.error(error);
                            res.sendStatus(500);
                        };
                        if (!ret) res.status(401).json({ error: 'mot de passe incorrect !' });

                        res.status(200).json({
                            id: account._id,
                            token: jwt.sign(
                                { id: account._id },
                                'RANDOM_TOKEN_SECRET',
                                { expiresIn: '24h' }
                            )
                        });
                    })
                } else {
                    res.sendStatus(404);
                }
            })
            .catch(error => {
                console.error(error);
                res.sendStatus(500);
            });
    }
    catch (e) {
        res.status(400).json({ error })
    }

};

//signin
exports.signin = (req, res, next) => {
    try {
        if (!req.body.name) {
            throw "NoName"
        }
        if (!req.body.password) {
            throw "NoPassword"
        }
        const name = req.body.name;
        Account.findOne({ name: name })
            .then(user => {
                if (!user) {
                    bcrypt.hash(req.body.password, 10)
                        .then(hash => {
                            const account = new Account({
                                name: name,
                                password: hash,
                                role: 2
                            });
                            account.save()
                                .then(() => {
                                    Account.findOne({ name: name })
                                        .then(account => res.status(201).json({ id: account._id }))
                                        .catch(error => {
                                            console.error(error);
                                            res.sendStatus(500);
                                        });
                                })
                                .catch(error => {
                                    console.error(error);
                                    res.sendStatus(500);
                                });
                        })
                        .catch(error => {
                            console.error(error)
                            res.sendStatus(500)
                        });
                } else {
                    res.status(400).json({ message: "utilisateur deja existant" });
                }
            })
            .catch(error => {
                console.error(error);
                res.sendStatus(500);
            });
    }
    catch (e) {
        res.status(400).json({ error })
    }
};

// affiche un seul compte
exports.showOne = (req, res) => {
    try {
        if (!req.body.token) {
            throw "NoToken"
        }

        const token = req.body.token;
        const id = req.params.id;

        const proprio = auth.isProp(token, id);
        auth.isAdmin(token)
            .then(admin => {
                if (proprio || admin) {
                    Account.findOne({ _id: id })
                        .then(account => {
                            if (account) {
                                delete account._doc.password;
                                res.status(200).json(account);
                            } else {
                                res.sendStatus(404);
                            }
                        })
                        .catch(error => {
                            console.error(error);
                            res.sendStatus(500);
                        });
                } else {
                    res.sendStatus(403);
                }
            })
            .catch(error => {
                if (error instanceof jwt.TokenExpiredError) {
                    res.status(401).json({ error });
                } else if (error instanceof jwt.JsonWebTokenError) {
                    res.status(401).json({ error });
                } else {
                    console.error(error);
                    res.sendStatus(500);
                }
            });
    }
    catch (error) {
        console.error(error)
        if (error == "NoToken") {
            res.status(401).json({ error });
        } else {
            res.sendStatus(500);
        }

    }
};

//modifie un compte
exports.modify = (req, res, next) => {
    try {
        if (!req.body.token) {
            throw "NoToken"
        }
        const token = req.body.token;
        delete req.body.token;
        const id = req.params.id;

        const proprio = auth.isProp(token, id);
        auth.isAdmin(token)
            .then(admin => {
                if (proprio || admin) {
                    if (proprio && !admin) {
                        delete req.body.role;
                    }
                    Account.findOne({ _id: id })
                        .then(account => {
                            if (account) {
                                if (req.body.password) {
                                    bcrypt.hash(req.body.password, 10)
                                        .then(hash => {
                                            delete req.body.password;
                                            Account.updateOne({ _id: id }, { password: hash, _id: id, ...req.body })
                                                .then(() => res.sendStatus(200))
                                                .catch(error => {
                                                    console.error(error);
                                                    res.sendStatus(500);
                                                });
                                        })
                                        .catch(error => {
                                            console.error(error);
                                            res.sendStatus(500);
                                        });
                                } else {
                                    account.updateOne({ _id: id }, { ...req.body, _id: id })
                                        .then(() => res.sendStatus(200))
                                        .catch(error => {
                                            console.error(error);
                                            res.sendStatus(500);
                                        });
                                }
                            } else {
                                res.sendStatus(404);
                            }
                        })
                        .catch(error => {
                            console.error(error);
                            res.sendStatus(500);
                        });
                } else {
                    res.sendStatus(403);
                };
            })
            .catch(error => {
                if (error instanceof jwt.TokenExpiredError) {
                    res.status(401).json({ error });
                } else if (error instanceof jwt.JsonWebTokenError) {
                    res.status(401).json({ error });
                } else {
                    console.error(error);
                    res.sendStatus(500);
                }
            })
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error });
        } else if (error == "NoToken") {
            res.status(401).json({ error });
        } else {
            res.sendStatus(500);
        }

    }
};

// supprime un compte
exports.del = (req, res, next) => {
    try {
        if (!req.body.token) {
            throw "NoToken"
        }
        const token = req.body.token;
        const idToDel = req.params.id;

        const proprio = auth.isProp(token, idToDel)
        auth.isAdmin(token)
            .then(admin => {
                if (admin || proprio) {
                    Account.findOne({ _id: idToDel })
                        .then(account => {
                            if (account) {
                                AccBook.deleteMany({ acc: idToDel })
                                    .then(accBook => {
                                        Account.deleteOne({ _id: idToDel })
                                            .then(() => res.sendStatus(200))
                                            .catch(error => {
                                                console.error(error);
                                                res.sendStatus(500);
                                            });
                                    })
                                    .catch(error => {
                                        console.error(error);
                                        res.sendStatus(500);
                                    });
                            } else {
                                res.sendStatus(404);
                            };
                        })
                        .catch(error => {
                            console.error(error);
                            res.sendStatus(500);
                        });

                } else {

                    res.sendStatus(403);
                };
            })
            .catch(error => {
                if (error instanceof jwt.TokenExpiredError) {
                    res.status(401).json({ error });
                } else if (error instanceof jwt.JsonWebTokenError) {
                    res.status(401).json({ error });
                } else {
                    console.error(error);
                    res.sendStatus(500);
                }
            });
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error });
        } else if (error == "NoToken") {
            res.status(401).json({ error });
        } else {
            res.sendStatus(500);
        }

    }
};

// afficher tout les comptes
exports.showAll = (req, res, next) => {
    try {
        if (!req.body.token) {
            throw "NoToken"
        }
        const token = req.body.token;
        auth.isAdmin(token)
            .then(admin => {
                if (admin) {
                    Account.find()
                        .then(accounts => res.status(200).json(accounts))
                        .catch(error => {
                            console.error(error);
                            res.sendStatus(500);
                        });
                } else {
                    res.sendStatus(403);
                }
            })
            .catch(error => {
                if (error instanceof jwt.TokenExpiredError) {
                    res.status(401).json({ error });
                } else if (error instanceof jwt.JsonWebTokenError) {
                    res.status(401).json({ error });
                } else {
                    console.error(error);
                    res.sendStatus(500);
                }
            });
    }
    catch (error) {
        console.error(error)
        if (error == "NoToken") {
            res.status(401).json({ error });
        } else {
            res.sendStatus(500);
        }

    }
};