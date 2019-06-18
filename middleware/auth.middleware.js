let crypto = require('crypto')
const mongoose = require('mongoose')
const userSM = require('../models/schemas/user.schema.js')
const lUser = userSM.userModel

//ToDo: Fix callback if username does not exist
module.exports = (req, res, next) => {
    try {


        let signature = req.params.signature;

        lUser.findOne({
                username: req.body.username
            })
            .then((luser) => {
                if (luser === null) {
                    res.status(403).send({
                        Error: "User does not exist!"
                    })
                    //session.reject()
                } else {
                    if (saltHashPassword(req.body.password, luser)){

                        let key = luser.streamingKey;

                        res.status(200).json({ message: key })

                        next()
                    }else {
                        res.status(400).send({
                            Error: "Incorrect credentials!"
                        })
                    }
                }
            }) 
    } catch (error) {
        res.status(401).json({ message: "Login error" })
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
    }else {
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

