const userSM = require('../models/schemas/user.schema.js')
var crypto = require('crypto')
const lUser = userSM.userModel

let genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hex */
        .slice(0, length) /** return required num of char */
}

let sha512 = function (password, salt) {
    let hash = crypto.createHmac('sha512', salt) /** Hashing algorithm sha512 */
    hash.update(password)
    let value = hash.digest('hex')
    return {
        salt: salt,
        passwordHash: value
    }
}

function saltHashPassword(userpassword) {
    let salt = genRandomString(16) /** Salt length 16 or var */
    let passwordData = sha512(userpassword, salt)
    return {
        passwordData
    }
}


function createUser(req, res) {

    let usernameNew = req.body.username 
    let emailNew = req.body.email 
    let passwordNew = req.body.password 
    let publicKeyNew = req.body.publicKey 
   // let hashNew
    //let saltNew

    lUser.findOne({
            username: usernameNew
        })
        .then((luser) => {
            if (luser === null) {

                

                let passData = saltHashPassword(passwordNew)

                let newUser = new lUser({
                    username: usernameNew,
                    email: emailNew,
                    passwordHash: passData.passwordHash,
                    passwordSalt: passData.salt,
                    publicKey: publicKeyNew
                })

                newUser.save(function (err) {
                    if (err) {
                        res.status(500).json(err).end()
                    } else {
                        res.status(200).send()
                    }
                })

            } else {
                res.status(403).send({
                    Error: "User already exists!"
                })
                //session.reject()
            }

        })

}

module.exports = {
    createUser
}