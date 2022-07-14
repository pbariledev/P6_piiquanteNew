const bcrypt = require ('bcrypt');
const User = require ('../models/user');
const jwt = require('jsonwebtoken');

const dotenv = require("dotenv");
dotenv.config();

const MY_CRYPTOJS_SECRET_TOKEN = process.env.CRYPTOJS_SECRET_TOKEN;


exports.signup = (req, res, next) => {
    User.findOne({email: req.body.email}).then(userFound => {
     if (userFound){
         return res.status(400).json({ message: 'Un compte avec cette adresse mail existe déjà.' })
     } else {
         bcrypt
         .hash(req.body.password, 10)
         .then((hash) => {
         const userToCreate = new User({
             email: req.body.email,
             password: hash
         });
         userToCreate.save()
             .then(() =>  res.status(201).json({ message: 'Utilisateur créé !' }))
             .catch(error => res.status(400).json({ error }));
     })
     .catch(error => res.status(500).json({ error }));
   };
     
    })
 }

exports.login = (req, res, next)=> {
    User.findOne({email: req.body.email})
    .then (user => {
        if (!user) {
         return res.status(401).json({error: 'utilisateur non trouvé !'})
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then (valid => {
                if(!valid) {
                    return res.status(401).json({error: 'mot de passe incorrecte !'})
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            MY_CRYPTOJS_SECRET_TOKEN,
                            { expiresIn: '24h' }
                        )
                    })
                }
            })
            .catch(error => res.status(500).json({ error }));
        }
    })
    .catch(error => res.status(500).json({ error }));
};