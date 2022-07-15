const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save()
  .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
  .catch(error => res.status(400).json({message: 'objet non créé !'}));
};


exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};


exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

exports.getOneSauce = (req,res,next) => {
    Sauce.findOne({_id: req.params.id})
    .then( sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
  };

exports.getAllSauces =(req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
  };




exports.likeDislike = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            let userLike = sauce.usersLiked.find(id => id === userId);
            let userDislike = sauce.usersDisliked.find(id => id === userId);

            switch (like) {
                case 1 :
                    if (!userLike) {
                        sauce.likes += 1;
                        sauce.usersLiked.push(userId);
                    } else {
                        throw new Error('un seul like possible!');
                    } 
                    if (userDislike) {
                        throw new Error('annuler votre dislike avant de liker!');
                    }
                break;

                case 0 :
                    if (userLike) {
                        sauce.likes -= 1;
                        sauce.usersLiked = sauce.usersLiked.filter(id => id !== userId);
                    }
                    else {
                        if (userDislike) {
                        sauce.dislikes -= 1;
                        sauce.usersDisliked = sauce.usersDisliked.filter(id => id !== userId);
                        }   
                    }
                break;

                case -1 :
                    if (!userDislike) {
                        sauce.dislikes += 1;
                        sauce.usersDisliked.push(userId);
                    } else {
                        throw new Error('un seul dislike possible!');
                    } 
                    if (userLike) {
                        throw new Error('annuler votre like avant de disliker!');
                    }
            }
            sauce.save()
                .then(() => res.status(201).json({ message: 'préférence enregistrée !' }))
                .catch(error => res.status(400).json({ error }));

            })
        .catch(error => res.status(500).json({ error : error.message }));
};