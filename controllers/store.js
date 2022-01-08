const jwt = require('jsonwebtoken');

const Article = require('../models/article');

const auth = require('../utils/auth');

// afficher un article
exports.showOne = (req, res, next) => {
    try {
        if (!req.body.token) {
            throw "NoToken"
        }
        if (!/[0-9a-f]{12}/g.test(req.params.id)) {
            throw "BadIdFormat"
        }
        const token = req.body.token;
        const id = req.params.id
        auth.isAdmin(token)
            .then(admin => {
                if (admin) {
                    Article.findOne({ _id: id })
                        .then(article => {
                            if (article) {
                                res.status(200).json(article)
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
        if (error == "NoToken") {
            res.status(401).json({ error });
        } else if (error == "BadIdFormat") {
            res.status(400).json({ error });
        } else {
            res.sendStatus(500);
        }

    }
};

// creer un article
exports.create = (req, res, next) => {
    try {
        if (!req.body.token) {
            throw "NoToken"
        }
        if (!req.body.name) {
            throw "NoName"
        }
        const token = req.body.token;
        const name = req.body.name

        delete req.body.token;
        auth.isAdmin(token)
            .then(admin => {
                if (admin) {
                    Article.findOne({ name: name })
                        .then(article => {
                            if (!article) {
                                const article = new Article({ ...req.body });
                                article.save()
                                    .then(() => {
                                        Article.findOne({ name: name })
                                            .then(article => res.status(201).json({ id: article._id }))
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
                                res.status(400).json({ id: article._id })
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
        if (error == "NoToken") {
            res.status(401).json({ error });
        } else if (error == "NoName") {
            res.status(400).json({ error });
        } else if (error == "BadIdFormat") {
            res.status(400).json({ error });
        } else {
            res.sendStatus(500);
        }

    }
};

//modifier un article
exports.modify = (req, res, next) => {
    try {
        if (!req.body.token) {
            throw "NoToken"
        }
        if (!/[0-9a-f]{12}/g.test(req.params.id)) {
            throw "BadIdFormat"
        }
        const token = req.body.token;
        const id = req.params.id
        delete req.body.token;
        auth.isAdmin(token)
            .then(admin => {
                if (admin) {

                    Article.findOne({ _id: id })
                        .then(article => {
                            if (article) {
                                Article.updateOne({ _id: id }, { ...req.body, _id: id })
                                    .then(article => res.sendStatus(200))
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
        if (error == "NoToken") {
            res.status(401).json({ error });
        } else if(error == "BadIdFormat"){
            res.status(400).json({ error });
        } else {
            res.sendStatus(500);
        }

    }
};

//supprimer un article
exports.del = (req, res, next) => {
    try {
        if (!req.body.token) {
            throw "NoToken"
        }
        if (!/[0-9a-f]{12}/g.test(req.params.id)) {
            throw "BadIdFormat"
        }
        const token = req.body.token;
        const id = req.params.id
        auth.isAdmin(token)
            .then(admin => {
                if (admin) {

                    Article.findOne({ _id: id })
                        .then(article => {
                            if (article) {
                                Article.deleteOne({ _id: id })
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
        if (error == "NoToken") {
            res.status(401).json({ error });
        } else if (error == "BadIdFormat") {
            res.status(400).json({ error });
        } else {
            res.sendStatus(500);
        }

    }
};

// afficher tout le magasin
exports.showAll = (req, res, next) => {
    Article.find()
        .then(articles => res.status(200).json(articles))
        .catch(error => res.status(500).json({ error }));
};