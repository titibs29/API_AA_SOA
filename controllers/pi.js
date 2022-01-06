const Pi = require('../models/pi');

const auth = require('../middleware/auth');

// affiche un pi
exports.showOne = (req, res, next) => {
    console.log('affiche un pi');
    Pi.findOne({ _id: req.params.id })
        .then(pi => res.status(200).json(pi))
        .catch(error => res.status(404).json({ error }));
};

// crée un  pi
exports.create = (req, res, next) => {
    console.log('crée un pi');
    
    auth.isAdmin(req.body.token)
    .then(admin => {
        if(admin){

            Pi.findOne({name: req.body.name })
            .then(pi => {
                if (pi){
                    res.status(400).json({ message: pi._id});
                } else {
                    delete req.body.token
                    const pi = new Pi({...req.body});
                    pi.save()
                    .then(() => {
                        Pi.findOne({ name: req.body.name })
                        .then(pi => res.status(201).json({ message: pi._id }))
                        .catch(error => res.status(500).json({ error }));
                    })
                    .catch(error => res.status(500).json({ error }));
                }
            })
            .catch(error => res.status(500).json({ error }));
        }else{
            res.sendStatus(403);
        }
    })
    .catch(error => res.status(500).json({ error }));
};

// modifie un pi
exports.modify = (req, res, next) => {
    console.log('modifie un pi');
    const id = req.params.id;
    const token = req.body.token;
    
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
                        if (!pi) {
                            res.status(404).json({ message: 'point inexistant' })
                        } else {
                            delete req.body.token;
                            console.log(req.params.id)
                                Pi.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
                                    .then(pi => res.status(200).json({ message: 'point modifié' }))
                                    .catch(error => res.status(400).json({ error }));
                            }
                        })
                        .catch(error => res.status(500).json({ error }))

                } else {
                    res.sendStatus(403)
                }
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// supprime un pi
exports.del = (req, res, next) => {
    console.log('supprime un pi');
    
    auth.isAdmin(req.body.token)
        .then(admin => {
            if (admin) {
                Pi.findOne({ _id: req.params.id })
                    .then(pi => {
                        if (!pi) {
                            res.status(404).json({ message: "le pi n'existe pas" })
                        } else {
                            Pi.deleteOne({ _id: req.params.id })
                                .then(() => res.status(200).json({ message: "compte supprimé" }))
                                .catch(error => res.status(500).json({ error }));
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            } else {
                res.sendStatus(403);
            }
        })
        .catch(error => res.status(500).json({ error }));
};

// affiche la liste
exports.showAll = (req, res, next) => {
    console.log('affiche la liste des pi');
    Pi.find()
        .then(pis => res.status(200).json(pis))
        .catch(error => res.status(500).json({ error }));
};