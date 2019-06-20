let log = (tag, message) => {

    let emoji = 'X'

    if (tag == 'chat') emoji = '💬'
    if (tag == 'stream') emoji = '🎬'
    if (tag == 'collection') emoji = '💾'
    if (tag == 'api') emoji = '⚙️ '


    console.log(emoji + " [" + tag.toUpperCase() + "] - " + message)
}

module.exports = log