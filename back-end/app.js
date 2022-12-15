const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./route/user');
const sauceRoute = require('./route/sauces');
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors');



const app = new express();
require('dotenv').config();

//-----------------mongodb
const mangodb_co = process.env.MANGODB_CO
mongoose.connect(mangodb_co,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))
//-----------------------------


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});



/*let allowCors = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}*/


//app.use(allowCors);
app.use(bodyParser.json())
app.use(express.json());
app.use(cors())


app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoute)
app.use('/api/sauces', sauceRoute)


//helmet permet de securiser les en-tete des requette http
//app.use(helmet());

module.exports = app;

