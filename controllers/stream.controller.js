let get = (req, res) => {
    res.status(200).json({
        "message": "stream route"
    }).end()
}

module.exports = {
    get
}