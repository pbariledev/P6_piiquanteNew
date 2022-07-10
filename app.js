const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

const sauceRoutes = require('./routes/sauce');
const authRoutes = require('./routes/user');


mongoose.connect('mongodb+srv://admin_pierre:admin_pierre@cluster0.exd8u.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(helmet());

app.use(cors())
app.get('/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})
 app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})

app.use(express.json());

app.use('/api/sauce', sauceRoutes);
app.use('/api/auth', authRoutes);


module.exports = app;