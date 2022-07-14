const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const sauceRoutes = require('./routes/sauce');
const authRoutes = require('./routes/user');

const dotenv = require("dotenv");
dotenv.config();


mongoose.connect(`mongodb+srv://${process.env.MDB_USERNAME}:${process.env.MDB_PASSWORD}@cluster0.exd8u.mongodb.net/?retryWrites=true&w=majority`,
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

app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(cors())

app.use(express.json());

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', authRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;