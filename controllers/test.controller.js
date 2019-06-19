const userSM = require('../models/schemas/user.schema.js')
var crypto = require('crypto')
const lUser = userSM.userModel

let genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hex */
        .slice(0, length) /** return required num of char */
}


// let sha512 = function (password, salt) {
//     let hash = crypto.createHmac('sha512', salt) /** Hashing algorithm sha512 */
//     hash.update(password)
//     let value = hash.digest('hex')
//     return {
//         salt: salt,
//         passwordHash: value
//     }
// }

// function saltHashPassword(userpassword) {
//     let salt = genRandomString(16) /** Salt length 16 or var */
//     let passwordData = sha512(userpassword, salt)

//     let pHash = passwordData.passwordHash
//     let pSalt = passwordData.salt
//     return {
//         pHash, pSalt
//     }
// }


function createUser(req, res) {
    let usernameNew = req.body.username 
    let emailNew = req.body.email 
    let publicKeyNew = req.body.publicKey 

    let genKey = crypto.randomBytes(Math.ceil(16 / 2))
         .toString('hex') /** convert to hex */
        .slice(0, 16) /** return required num of char */

    lUser.findOne({
            username: usernameNew
        })
        .then((luser) => {
            if (luser === null) {

                

                let newUser = new lUser({
                    username: usernameNew,
                    email: emailNew,
                    tokens : 0,
                    publicKey: publicKeyNew,
                    streamingKey: genKey
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