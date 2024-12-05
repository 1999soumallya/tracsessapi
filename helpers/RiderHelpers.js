const jsonwebtoken = require('jsonwebtoken')

exports.createInvitation = (creator, member) => {
    return jsonwebtoken.sign({ creator, member }, process.env.TOKEN_KEY)
}

exports.verifyInvitation = async (inviteLink) => {
    return jsonwebtoken.verify(inviteLink, process.env.TOKEN_KEY, { complete: true })
}