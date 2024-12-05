const bcryptjs = require("bcryptjs");
const TokenModel = require("../models/TokenModel");
const jwt = require("jsonwebtoken");

exports.encryptpassword = async (password) => {
    let salt = bcryptjs.genSaltSync(10)
    return bcryptjs.hashSync(password, salt)
}

exports.compairpassword = async (password, haspassword) => {
    return bcryptjs.compareSync(password, haspassword)
}

exports.tokens = async (id) => {
    return new Promise(function (resolve, reject) {
        TokenModel.deleteMany({ organizer: id }).then(() => {
            TokenModel.create({ organizer: id, token: jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: '100y' }) }).then((result) => {
                resolve(result.token)
            }).catch((error) => {
                reject(error)
            })
        }).catch((error) => {
            reject(error)
        })
    })
}

exports.resettokens = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: '1d' })
}

exports.verifytoken = async (organizertoken) => {
    return jwt.verify(organizertoken, process.env.TOKEN_KEY, { complete: true })
}

exports.decodetoken = (token) => {
    return jwt.decode(token, { complete: true })
}