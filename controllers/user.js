const bcrypt = require ('bcrypt');
const User = require ('../models/user');
const jwt = require('jsonwebtoken');


exports.signup = (req, res, next) => {
   console.log('signup')
   User.findOne({email: req.body.email}).then(UserFound => {
    if (UserFound){
        res.status(400).json({ error })
    }
   })
   bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
    const userToCreate = new User({
        email: req.body.email,
        password: hash
    });
    User.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  };

exports.login = (req, res, next)=> {
    User.findOne({email: req.body.email})
    .then (user => {
        if( user === null) {
                res.status(401).json ({message: 'utilisateur non trouvé !'})
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then (valid => {
                if(!valid) {
                    res.status(401).json ({message: 'mot de passe incorrecte !'})
                } else {
                    res.status(200).json ({
                        userId: user._id,
                        token : 'Token'
                    })
                }
            })
            .catch(error => res.status(500).json({ error }));
        }
    })
    .catch(error => res.status(500).json({ error }));
};