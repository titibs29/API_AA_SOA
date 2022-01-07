const Booking = require('../models/booking');
const AccBook = require('../models/acc-book');

const auth = require('../middleware/auth');


// affiche les réservations associées a ID
exports.showByAcc = (req, res, next) => {
    console.log('montre toute les réservations associées à un compte');
    const token = req.body.token
    const id_acc = req.params.id
    const proprio = auth.isProp(token, id_acc)
    auth.isAdmin(token)
        .then(admin => {
            console.log(proprio,admin)
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
                            boucleFinie
                                .then(() => res.status(200).json(dataToSend) )
                                .catch(error => res.status(500).json({ error }));
                        } else {
                            res.sendStatus(404)
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            } else {
                res.sendStatus(403)
            }
        })
        .catch(error => res.status(500).json({ error }));

};

// affiche la réservation
exports.showOne = (req, res, next) => {
    console.log('montre une réservation');
    const token = req.body.token;
    auth.bookProp(token, req.params.id)
        .then(proprio => {
            auth.isAdmin(token)
                .then(admin => {
                    if (proprio || admin) {

                        Booking.findOne({ _id: req.params.id })
                            .then(booking => {
                                AccBook.find({ book: req.params.id }, 'acc').exec()
                                    .then(parts => {
                                        var dataToSend = { ...booking._doc, participants: [] }

                                        var boucleFinie = new Promise((resolve, reject) => {

                                            parts.forEach((v, k, a) => {
                                                dataToSend.participants.push(v.acc)
                                                if(k === a.length -1) resolve();
                                            })
                                        })

                                        boucleFinie
                                        .then(() => res.status(200).json(dataToSend))
                                        .catch(error => res.status(500).json({ error }));
                                        
                                    })
                                    .catch(error => res.status(500).json({ error }));
                            })
                            .catch(error => res.status(500).json({ error }));

                    } else {
                        res.sendStatus(403)
                    }
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//crée une nouvelle réservation
exports.create = (req, res, next) => {
    console.log('crée une réservation');
    const token = req.body.token
    delete req.body.token

    auth.asAccount(token)
        .then(asAcc => {
            if (asAcc) {
                Booking.findOne({ date: req.body.date })
                    .then(booking => {
                        if (!booking) {
                            const booking = new Booking({ date: req.body.date });
                            booking.save()
                                .then(() => {

                                    Booking.findOne({ date: req.body.date })
                                        .then(booking => {


                                            for (k in req.body.participants) {
                                                const accbook = new AccBook({ acc: req.body.participants[k], book: booking._id })
                                                accbook.save()
                                            }
                                            res.status(201).json({ message: booking._id })

                                        })
                                        .catch(error => res.status(500).json({ error }));
                                }).catch(error => {
                                    res.status(400).json({ erreur: error });
                                });
                        } else {
                            res.status(400).json({ message: booking._id })
                        }
                    })
                    .catch(error => res.status(500).json({ error }));

            } else {
                res.sendStatus(403);
            }

        })
        .catch(error => res.status(500).json({ error }));
};

//modifie une réservation
exports.modify = (req, res, next) => {
    console.log('modifie une réservation');
    const token = req.body.token
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
                                                    res.sendStatus(200)
                                                })
                                                .catch(error => res.status(500).json({ error }));
                                        })
                                        .catch(error => res.status(500).json({ error }));
                                } else {
                                    res.sendStatus(404)
                                }
                            })
                            .catch(error => res.status(500).json({ error }));
                    } else {
                        res.sendStatus(403)
                    }
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//supprime une réservation
exports.del = (req, res, next) => {
    console.log('supprime une réservation');
    const token = req.body.token
    const id = req.params.id
    auth.bookProp(token, id)
        .then(proprio => {
            auth.isAdmin(token)
                .then(admin => {
                    if (proprio || admin) {
                        Booking.findOne({ _id: id })
                            .then(booking => {
                                if (!booking) {
                                    res.status(404).json({ message: "réservation inexistante" })
                                } else {
                                    AccBook.deleteMany({ book: id })
                                        .then(accBook => {
                                            Booking.deleteOne({ _id: id })
                                                .then(() => res.status(200).json({ message: "réservation supprimée" }))
                                                .catch(error => res.status(500).json({ error }));
                                        })
                                        .catch(error => res.status(500).json({ error }));

                                }
                            })
                            .catch(error => res.status(500).json({ error }));
                    } else {
                        res.sendStatus(403);
                    }
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};