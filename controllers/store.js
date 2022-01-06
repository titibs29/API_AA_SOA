const Article = require('../models/article');

const auth = require('../middleware/auth');
const article = require('../models/article');

// afficher un article
exports.showOne = (req, res, next) =>{
    console.log('affiche un article');
    auth.isAdmin(req.body.token)
        .then(admin => {
            if (admin) {
                Article.findOne({ _id: req.params.id })
                    .then(article => res.status(200).json(article))
                    .catch(error => res.status(404).json({ error }));
            } else {

                res.sendStatus(403);
            }
        })
        .catch(error => res.status(500).json({ error }));
};

// creer un article
exports.create = (req, res, next) =>{
    console.log('crée un article');

    auth.isAdmin(req.body.token)
    .then(admin => {

        if(admin){

            Article.findOne({ name: req.body.name})
            .then(article => {
                if(article){
                    res.status(400).json({ message: article._id})
                }else{

                    delete req.body.token;
                    const article = new Article({ ...req.body });
                    article.save()
                    .then(() => {
                        Article.findOne({name: req.body.name})
                        .then(article => res.status(201).json({ message: article._id }))
                        .catch(error => res.status(500).json({ error }));
                    }).catch(error => {
                        res.status(400).json({ error: error });
                    });
                }
            })
            .catch(error => res.status(500).json({ error }));
            } else {
                res.sendStatus(403);
            }
    })
    .catch(error => res.status(500).json({ error }))
};

//modifier un article
exports.modify = (req, res, next) =>{
    console.log('modifie un article');
    auth.isAdmin(req.body.token)
    .then(admin => {
        if(admin){
            delete req.body.token;

            Article.findOne({_id: req.params.id})
            .then(article => {
                if(!article){

                    res.status(404).json({ message: 'article inexistant'})
                }else{
                    Article.updateOne({ _id: req.params.id}, { ...req.body, _id: req.params.id})
                    .then(article => res.status(200).json({ message: 'article modifié'}))
                    .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(500).json({ error }))
                
        }else{
            res.sendStatus(403)
        }
    })
    .catch(error => res.status(500).json({ error }));
};

//supprimer un article
exports.del = (req, res, next) =>{
    console.log('supprime un article');
    auth.isAdmin(req.body.token)
    .then(admin => {
        if(admin){

            Article.findOne({ _id: req.params.id })
            .then(article => {
                if(!article){
                    res.status(404).json({ message: "l'article n'existe pas" })
                }else{
                    Article.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "compte supprimé" }))
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

// afficher tout le magasin
exports.showAll = (req, res, next) =>{
    console.log('affiche tout le magasin');
    Article.find()
    .then(articles => res.status(200).json(articles))
    .catch(error => res.status(500).json({ error }));
};