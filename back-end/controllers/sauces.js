const sauces = require('../models/sauces');
const fs = require('fs');


exports.createSauces = (req, res, next) => {

    const sauceObjt = JSON.parse(req.body.sauce)
    delete sauceObjt._id;


    const sauce = new sauces({
        ...sauceObjt,

        // Création de l'URL de l'image  
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [" "],
        usersDisliked: [" "],
        userId: req.auth.userId
    });
    sauce
        .save()
        .then((message) => res.status(201).send({ message }))
        .catch((err) => res.status(500).send(err))

};



exports.modifySauce = (req, res, next) => {
    sauces.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                res.status(404).json({ error: error });
            }
            //si ce n'est pas l'auteur de la sauce 

            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'not authorized' });
            }
            else {
                const sauceObjt = req.file ?
                    {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    } : { ...req.body };

                sauces.updateOne({ _id: req.params.id }, { ...sauceObjt, _id: req.params.id })
                    .then(() => res.status(201).json({ message: 'la sauce a bien etais modifier' }))
                    .catch((error) => res.status(400).json({ error: error }));;
            }
        });
};

//trouver sur un site mais je ne comprends pas reelement comment elle foctionne
exports.deleteSauce = (req, res, next) => {
    sauces.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                res.status(404).json({ error: error });
            }
            //si ce n'est pas l'auteur de la sauce 

            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'not authorized' });
            }
            else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    sauces.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Deleted!' }))
                        .catch((error) => res.status(400).json({ error: error }));
                });
            }
        })
};
exports.getOneSauce = (req, res, next) => {
    sauces.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
};
exports.getAllSauce = (req, res, next) => {
    sauces.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    // Si l'utilisateur aime la sauce
    if (req.body.like === 1) {
        // On ajoute 1 like et on l'envoie dans le tableau "usersLiked"
        sauces.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
            .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
            .catch(error => res.status(400).json({ error }));
    } else if (req.body.like === -1) {
        // Si l'utilisateur n'aime pas la sauce
        // On ajoute 1 dislike et on l'envoie dans le tableau "usersDisliked"
        sauces.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
            .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
            .catch(error => res.status(400).json({ error }));
    } else {
        // Si like === 0 l'utilisateur supprime son vote
        sauces.findOne({ _id: req.params.id })
            .then(sauce => {
                // Si le tableau "userLiked" contient l'ID de l'utilisateur
                if (sauce.usersLiked.includes(req.body.userId)) {
                    // On enlève un like du tableau "userLiked" 
                    sauces.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    // Si le tableau "userDisliked" contient l'ID de l'utilisateur
                    // On enlève un dislike du tableau "userDisliked" 
                    sauces.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                        .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }));
    }
};