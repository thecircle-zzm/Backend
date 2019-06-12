const mongoose = require('mongoose')
const userSM = require('../models/schemas/user.schema.js')
var crypto = require('crypto');
const lUser = userSM.userModel


function createUser(req, res) {

    let usernameNew = req.body.username || ''
    let emailNew = req.body.email || ''
    let passwordNew = req.body.password || ''
    let publicKeyNew = req.body.publicKey || ''
    let hashNew;
    let saltNew;


    lUser.findOne ({ username: usernameNew }) 
     .then((luser) =>{
        if(luser === null)
        {
            


            var genRandomString = function(length){
                return crypto.randomBytes(Math.ceil(length/2))
                        .toString('hex') /** convert to hex */
                        .slice(0,length);   /** return required num of char */
            };

            var sha512 = function(password, salt){
                var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
                hash.update(password);
                var value = hash.digest('hex');
                return {
                    salt:salt,
                    passwordHash:value
                };
            };

            function saltHashPassword(userpassword) {
                var salt = genRandomString(16); /** Salt length 16 or var */
                var passwordData = sha512(userpassword, salt);
                console.log('UserPassword = '+userpassword);
                console.log('Passwordhash = '+passwordData.passwordHash);
                hashNew = passwordData.passwordHash;
                saltNew = passwordData.salt;
                console.log('nSalt = '+passwordData.salt);
            }
            
            saltHashPassword(passwordNew);


            let newUser = new lUser({
                username: usernameNew,
                email: emailNew,
                passwordHash: hashNew,
                passwordSalt: saltNew,
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
            res.status(403).send({Error: "User already exists!"})
            session.reject();
        }

     })
}

    



module.exports = {
    createUser
}