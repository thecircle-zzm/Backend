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


        let signature = req.header('signature')
        let payload = convertStringToArrayBufferView(JSON.stringify(req.body))

        lUser.findOne({
                username: req.header('username')
            })
            .then((luser) => {

                // If user is not found
                if (luser === null) {
                    res.status(403).send({
                        Error: "User does not exist!"
                    })
                } 
                
                // If user is found
                else {

                    // Logging
                    console.dir(luser.publicKey)
                    console.dir(req.header('signature'))


                    let pKey = new NodeRSA({b: 2048});

                    pKey.importKey(luser.publicKey, 'public')

                    console.log(pKey)

                    let vResult = pKey.verify(payload, signature, 'hex', 'hex')

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