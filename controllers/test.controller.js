const userSM = require('../models/schemas/user.schema.js')
const lUser = userSM.userModel


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
        .then((err, luser) => {
            if (err){
                return (err)
            }
            if (luser === null) {


                let newUser = new lUser()
                newUser.username = usernameNew
                newUser.email = emailNew
                newUser.PasswordHash = newUser.generateHash(passwordNew)
                newUser.streamingKey = newUser.generateStreamKey()
                newUser.publicKey = publicKeyNew


                

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
            }

        })

}

module.exports = {
    createUser
}