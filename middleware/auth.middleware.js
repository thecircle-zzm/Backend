let crypto = require('crypto')
const mongoose = require('mongoose')
const userSM = require('../models/schemas/user.schema.js')
const lUser = userSM.userModel
let user; 

//ToDo: Fix callback if username does not exist
module.exports = (req, res, next) => {
    try {
        lUser.findOne({
                username: req.body.username
            })
            .then((luser) => {
                user = luser
                if (luser === null) {
                    res.status(403).send({
                        Error: "User does not exist!"
                    })
                    //session.reject()
                } else {
                    saltHashPassword(req.body.password)
                    next()
                }
            }) 
    } catch (error) {
        res.status(401).json({ message: "Login error" })
        //session.reject()
    }
}

function saltHashPassword(userpassword) {
    var salt = user.passwordSalt
    var passwordData = sha512(userpassword, salt)
    console.log('UserPassword = ' + userpassword)
    console.log('Passwordhash = ' + passwordData.passwordHash)
    console.log('nSalt = ' + passwordData.salt)

    if (passwordData.passwordHash == user.passwordHash) {
        console.log('Passwords match')
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

