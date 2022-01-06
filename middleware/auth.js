const jwt = require('jsonwebtoken');

const Account = require('../models/account');
const Pi = require('../models/pi');


exports.isProp = (token, idToTest) => {


    if (!token) {
        return false
    }
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const id = decodedToken.id;
    if (id && idToTest == id) {

        return true
    } else {
        return false
    };
}


exports.isAdmin = async (token) => {

    return new Promise((resolve, reject) => {
        if (!token) {
            resolve(false)
        }
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const id = decodedToken.id;

        Account.findOne({ _id: id })
            .then(account => {
                if (account) {
                    if (account.role == 0) {

                        resolve(true);

                    } else {
                        resolve(false);
                    }
                } else {

                    resolve(false);
                };
            });
    });
}


exports.isPropArtisan = async (token, idPi) => {

    return new Promise((resolve, reject) => {
        if (!token) {
            resolve(false)
        }
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const id = decodedToken.id;

        Account.findOne({ _id: id })
            .then(account => {
                if (!account) {
                    resolve(false);
                } else {
                    if (account.role == 1) {

                        Pi.findOne({ artisan: id })
                            .then(pi => {
                                if (!pi) {
                                    resolve(false);
                                } else {

                                    if (pi.id == idPi) {
                                        resolve(true);
                                    } else {
                                        resolve(false);
                                    }
                                }

                            })
                            .catch(error => reject(error));




                    } else {
                        resolve(false);
                    };
                };
            })
            .catch(error => reject(error));

        return false
    });
}
