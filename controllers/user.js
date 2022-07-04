const bcrypt = require ('bcrypt');
const User =require ('../models/User');

   exports.signup = (req, res, next) => {
    console.log('signup')
    User.findOne({email: req.body.email}).then(UserFound => {
     if (UserFound){
         res.status(400).json({ message: 'Utilisateur deja existant !'  })
     }
    })
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

 exports.login = (req, res, next)=> {
     
 };