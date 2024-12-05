const bcryptjs = require("bcryptjs");
const TokenModel = require("../models/TokenModel");
const jwt = require("jsonwebtoken");

exports.encryptPassword = async (password) => {
    let salt = bcryptjs.genSaltSync(10)
    return bcryptjs.hashSync(password, salt)
}

exports.comparPassword = async (password, hasPassword) => {
    return bcryptjs.compareSync(password, hasPassword)
}

exports.tokens = async (id) => {
    return new Promise(function (resolve, reject) {
        TokenModel.deleteMany({ tuners: id }).then(() => {
            TokenModel.create({ tuners: id, token: jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: '100y' }) }).then((result) => {
                resolve(result.token)
            }).catch((error) => {
                reject(error)
            })
        }).catch((error) => {
            reject(error)
        })
    })
}

exports.resetTokens = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: '1d' })
}

exports.verifyToken = async (organizerToken) => {
    return jwt.verify(organizerToken, process.env.TOKEN_KEY, { complete: true })
}

exports.decodeToken = (token) => {
    return jwt.decode(token, { complete: true })
}