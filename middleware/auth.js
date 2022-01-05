const jwt = require('jsonwebtoken');

const Account = require('../models/account');
const Pi = require('../models/pi');


exports.isProp = (token, idToTest) => {

    let IsProp = false
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (idToTest && idToTest !== userId) {
        IsProp = false
    } else {
        IsProp = true
    };
    return IsProp
}


exports.isAdmin = (token, idAdmin) => {

    let IsAdmin = false
    let erreur = ''
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    Account.findOne({ _id: userId })
    .then(account => {
        if(!account) {
            IsAdmin = false;
            erreur = "le compte n'existe pas"
            return IsAdmin, erreur
        } else {
            if (userId == idAdmin) {
                if (account.role == 0) {
                    IsAdmin = true;
                };
            };
        };
    })
    .catch(error => erreur = error);

    return IsAdmin, erreur
}

exports.isPropArtisan = (token, idPi) => {

    let isArtProp = false
    let erreur = ''
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    Account.findOne({ _id: userId })
    .then(account => {
        if(!account) {
            IsartProp = false;
            erreur = "le compte n'existe pas"
            return isArtProp, erreur

        } else {
                if (account.role == 1) {
                   
                    Pi.findOne({ artisan: userId})
                    .then(pi => {
                        if(!pi){
                            IsartProp = false;
                            erreur = 'aucun Pi associé'
                            return isArtProp, erreur
                        } else {

                            if(pi.id == idPi){
                                isArtProp = true
                            }
                        }

                    })
                    .catch(error => erreur = error);




                };
        };
    })
    .catch(error => erreur = error);

    return isArtProp, erreur

}
