const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        //recuperation du tokken depuis l'en-tete de la requette
        const token = req.headers.authorization.split(' ')[1];
        //verification de la validité du token
        const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
        //recuperation du userID dans le token
        const userId = decodedToken.userId;
        //ajout de la valeurs userId dans l'obj request
        req.auth = {
            userId: userId
        };
        next();

    } catch (error) {
        res.status(401).json({ error });
    }
};


