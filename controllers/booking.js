const Booking = require('../models/booking');
const AccBook = require('../models/acc-book');

const auth = require('../middleware/auth');


// affiche les réservations associées a ID
exports.showByAcc = (req, res, next) => {
    console.log('montre toute les réservations associées à un compte');
    res.sendStatus(200);
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
                            const dataToSend = {...booking._doc, participants:[]}
                            
                            parts.forEach((v, k) => {
                                dataToSend.participants.push(v.acc)
                            })
                            
                            res.status(200).json(dataToSend);
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

    auth.asAccount(req.body.token)
        .then(asAcc => {
            if (asAcc) {
                Booking.findOne({ date: req.body.date })
                    .then(booking => {
                        if (booking) {
                            res.status(400).json({ message: booking._id })
                        } else {
                            delete req.body.token
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
    auth.asAccount(req.body.token)
        .then(asAcc => {
        })
        .catch(error => res.status(500).json({ error }));
};

//supprime une réservation
exports.del = (req, res, next) => {
    console.log('supprime une réservation');
    res.sendStatus(200);
};