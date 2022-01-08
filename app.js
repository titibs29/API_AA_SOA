const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const accountRoutes = require('./routes/account');
const piRoutes = require('./routes/pi');
const bookingRoutes = require('./routes/booking');
const articlesRoutes = require('./routes/store');
const webRoutes = require('./routes/web');

const app = express();

// connexion à la BD
mongoose.connect('mongodb://127.0.0.1:27017/soadb',
{
  useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('connexion à mongoDB réussie !'))
  .catch(() => console.log('connexion à mongoDB échouée !'));


// CORS
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());


app.use('/acc', accountRoutes);
app.use('/pi', piRoutes);
app.use('/book',bookingRoutes);
app.use('/store',articlesRoutes);
app.use('/web',webRoutes);
app.use('/teapot', function (req,res) {res.sendStatus(418)})

// chemin par défaut
app.get('/*', (req,res,next) => {res.sendStatus(404);});
app.all('/*', (req, res) => {res.sendStatus(405)}) // interdit avec une autre méthode

module.exports = app;