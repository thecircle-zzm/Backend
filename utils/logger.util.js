let log = (tag, message) => {

    let emoji = '❕'

    if (tag == 'chat') emoji = '💬'
    if (tag == 'stream') emoji = '🎬'
    if (tag == 'collection') emoji = '💾'
    if (tag == 'api') emoji = '⚙️ '
    if (tag == 'token') emoji = '💰'
    if (tag == 'screenshot') emoji = '🖼️ '
    if (tag == 'error') emoji = '🛑'

    console.log(emoji + " [" + tag.toUpperCase() + "] - " + message)
}

module.exports = log