const jwt = require('jsonwebtoken');

const Pi = require('../models/pi');

const auth = require('../utils/auth');

// affiche un pi
exports.showOne = (req, res, next) => {

    Pi.findOne({ _id: req.params.id })
        .then(pi => {
            if (pi) {
                res.status(200).json(pi);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(error => {
            console.error(error);
            res.sendStatus(500);
        });
};

// crée un  pi
exports.create = (req, res, next) => {
    try {
        if (!req.body.token) {
            throw "NoToken"
        }
        if (!req.body.name) {
            throw "NoName"
        }
        const token = req.body.token;
        delete req.body.token;
        auth.isAdmin(token)
            .then(admin => {
                if (admin) {

                    Pi.findOne({ name: req.body.name })
                        .then(pi => {
                            if (!pi) {
                                const pi = new Pi({ ...req.body });
                                pi.save()
                                    .then(() => {
                                        Pi.findOne({ name: req.body.name })
                                            .then(pi => res.status(201).json({ id: pi._id }))
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
                                res.status(400).json({ id: pi._id });
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
                console.error(error);
                res.sendStatus(500);
            });
    }
    catch (error) {
        console.error(error)
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error });
        } else if (error == "NoToken") {
            res.status(401).json({ error });
        } else if (error == "NoName") {
            res.status(400).json({ error });
        } else {
            res.sendStatus(500);
        }

    }
};

// modifie un pi
exports.modify = (req, res, next) => {
    try {
        if (!req.body.token) {
            throw "NoToken"
        }
        const token = req.body.token;
        const id = req.params.id;

        auth.isPropArtisan(token, id)
            .then(propArtisan => {
                auth.isAdmin(token)
                    .then(admin => {
                        if (admin || propArtisan) {
                            if (propArtisan) {
                                delete req.body.video;
                            }
                            Pi.findOne({ _id: id })
                                .then(pi => {
                                    if (pi) {
                                        delete req.body.token;
                                        Pi.updateOne({ _id: id }, { ...req.body, _id: id })
                                            .then(pi => res.sendStatus(200))
                                            .catch(error => {
                                                console.error(error);
                                                res.sendStatus(500);
                                            });
                                    } else {
                                        res.sendStatus(404)
                                    }
                                })
                                .catch(error => {
                                    console.error(error);
                                    res.sendStatus(500);
                                });

                        } else {
                            res.sendStatus(403)
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        res.sendStatus(500);
                    });
            })
            .catch(error => {
                console.error(error);
                res.sendStatus(500);
            });
    }
    catch (error) {
        console.error(error)
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

// supprime un pi
exports.del = (req, res, next) => {
    try {
        if (!req.body.token) {
            throw "NoToken"
        }
        const token = req.body.token;
        const id = req.params.id
        auth.isAdmin(token)
            .then(admin => {
                if (admin) {
                    Pi.findOne({ _id: id })
                        .then(pi => {
                            if (pi) {
                                Pi.deleteOne({ _id: id })
                                    .then(() => res.sendStatus(200))
                                    .catch(error => {
                                        console.error(error);
                                        res.sendStatus(500);
                                    });
                            } else {
                                res.sendStatus(404)
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

// affiche la liste
exports.showAll = (req, res, next) => {
    Pi.find()
        .then(pis => res.status(200).json(pis))
        .catch(error => {
            console.error(error);
            res.sendStatus(500);
        });
};