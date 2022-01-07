const jwt = require('jsonwebtoken');

const Booking = require('../models/booking');
const AccBook = require('../models/acc-book');

const auth = require('../utils/auth');


// affiche les réservations associées a ID
exports.showByAcc = (req, res, next) => {

    try {
        if (!req.body.token) {
            throw "NoToken"
        }
        if (!req.params.id) {
            throw "NoId"
        }
        const token = req.body.token;
        const id_acc = req.params.id
        const proprio = auth.isProp(token, id_acc)
        auth.isAdmin(token)
            .then(admin => {
                if (proprio || admin) {
                    AccBook.find({ acc: id_acc }, 'book').exec()
                        .then(parts => {
                            var dataToSend = []
                            if (parts.length > 0) {
                                var boucleFinie = new Promise((resolve, reject) => {

                                    parts.forEach((v, i, a) => {
                                        Booking.findOne({ _id: v.book })
                                            .then(booking => {
                                                if (booking) {
                                                    dataToSend.push(booking)
                                                }
                                                if (i === a.length - 1) resolve()
                                            })
                                            .catch(error => reject(error));

                                    })
                                })
                                    .then(() => res.status(200).json(dataToSend))
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
    }
    catch (error) {
        console.error(error)
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error });
        } else if (error == "NoToken") {
            res.status(401).json({ error });
        } else if (error == "NoId") {
            res.status(400).json({ error })
        } else {
            res.sendStatus(500);
        }

    }
};

// affiche la réservation
exports.showOne = (req, res, next) => {
    try {
        if (!req.body.token) {
            throw "NoToken"
        }
        const token = req.body.token;
        const id = req.params.id
        auth.bookProp(token, id)
            .then(proprio => {
                auth.isAdmin(token)
                    .then(admin => {
                        if (proprio || admin) {

                            Booking.findOne({ _id: id })
                                .then(booking => {
                                    AccBook.find({ book: id }, 'acc').exec()
                                        .then(parts => {
                                            var dataToSend = { ...booking._doc, participants: [] }
                                            var boucleFinie = new Promise((resolve, reject) => {
                                                parts.forEach((v, k, a) => {
                                                    dataToSend.participants.push(v.acc)
                                                    if (k === a.length - 1) resolve();
                                                })
                                            })
                                                .then(() => res.status(200).json(dataToSend))
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
                if (error instanceof jwt.TokenExpiredError) {
                    res.status(401).json({ error });
                } else if (error instanceof JsonWebTokenError) {
                    res.status(401).json({ error });
                } else {
                    console.error(error)
                    res.sendStatus(500)
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

//crée une nouvelle réservation
exports.create = (req, res, next) => {
    try {
        if (!req.body.token) {
            throw "NoToken"
        }
        if (!req.body.date) {
            throw "NoDate"
        }
        const token = req.body.token;
        const date = req.body.date
        delete req.body.token
        auth.asAccount(token)
            .then(asAcc => {
                if (asAcc) {
                    Booking.findOne({ date: date })
                        .then(booking => {
                            if (!booking) {
                                const booking = new Booking({ date: date });
                                booking.save()
                                    .then(() => {

                                        Booking.findOne({ date: date })
                                            .then(booking => {


                                                for (k in req.body.participants) {
                                                    const accbook = new AccBook({ acc: req.body.participants[k], book: booking._id })
                                                    accbook.save()
                                                }
                                                res.status(201).json({ message: booking._id })

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
                            } else {
                                res.status(400).json({ message: booking._id })
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
                    console.error(error)
                    res.sendStatus(500)
                }
            });
    }
    catch (error) {
        console.error(error)
        if (error == "NoToken") {
            res.status(401).json({ error });
        } else if (error == "NoDate") {
            res.status(400).json({ error });
        } else {
            res.sendStatus(500);
        }

    }
};

//modifie une réservation
exports.modify = (req, res, next) => {
    try {
        if (!req.body.token) {
            throw "NoToken"
        }
        const token = req.body.token;
        const id = req.params.id
        delete req.body.token
        auth.bookProp(token, id)
            .then(proprio => {
                auth.isAdmin(token)
                    .then(admin => {
                        if (admin || proprio) {
                            Booking.findOne({ _id: id })
                                .then(booking => {
                                    if (booking) {
                                        AccBook.deleteMany({ book: id })
                                            .then(accBook => {
                                                Booking.updateOne({ _id: id }, { date: req.body.date })
                                                    .then(updated => {
                                                        for (k in req.body.participants) {
                                                            const accbook = new AccBook({ acc: req.body.participants[k], book: booking._id })
                                                            accbook.save()
                                                        }
                                                        res.sendStatus(200);
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
        } else {
            res.sendStatus(500);
        }

    }
};

//supprime une réservation
exports.del = (req, res, next) => {
    try {
        if (!req.body.token) {
            throw "NoToken"
        }
        const token = req.body.token;
        const id = req.params.id
        auth.bookProp(token, id)
            .then(proprio => {
                auth.isAdmin(token)
                    .then(admin => {
                        if (proprio || admin) {
                            Booking.findOne({ _id: id })
                                .then(booking => {
                                    if (booking) {
                                        AccBook.deleteMany({ book: id })
                                            .then(accBook => {
                                                Booking.deleteOne({ _id: id })
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
                        console.error(error);
                        res.sendStatus(500);
                    });
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
        } else {
            res.sendStatus(500);
        }

    }
};