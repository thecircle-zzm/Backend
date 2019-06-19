const crypto = require('crypto')
const NodeRSA = require('node-rsa');
const mongoose = require('mongoose')
const userSM = require('../models/schemas/user.schema.js')
const lUser = userSM.userModel


function convertStringToArrayBufferView(str) {
    var bytes = new Uint8Array(str.length);
    for (var iii = 0; iii < str.length; iii++) {
        bytes[iii] = str.charCodeAt(iii);
    }

    return bytes;
}

//ToDo: Fix callback if username does not exist
module.exports = (req, res, next) => {
    try {


        let signature = req.params.signature;
        let payload = convertStringToArrayBufferView(JSON.stringify(req.body));

        lUser.findOne({
                username: req.params.username
            })
            .then((luser) => {
                if (luser === null) {
                    res.status(403).send({
                        Error: "User does not exist!"
                    })
                    //session.reject()
                } else {



                    let pKey = new NodeRSA(luser.publicKey);


                    let vResult = pKey.verify(payload, signature, 'buffer', 'string')

                    console.log(vResult)

                    if (vResult != true) {
                        res.status(401).json({
                            message: "Signature error"
                        })
                    } else {
                        next()
                    }



                }
            })
    } catch (error) {
        res.status(401).json({
            message: "Login error"
        })
        //session.reject()
    }
}

function saltHashPassword(userpassword, user) {
    var salt = user.passwordSalt
    var passwordData = sha512(userpassword, salt)
    console.log('UserPassword = ' + userpassword)
    console.log('Passwordhash = ' + passwordData.passwordHash)
    console.log('nSalt = ' + passwordData.salt)

    if (passwordData.passwordHash == user.passwordHash) {
        console.log('Passwords match')
        return true
    } else {
        return false
    }
}

var sha512 = function (password, salt) {
    var hash = crypto.createHmac('sha512', salt) /** Hashing algorithm sha512 */
    hash.update(password)
    var value = hash.digest('hex')
    return {
        salt: salt,
        passwordHash: value
    }
}
