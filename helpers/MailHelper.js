const nodemailer = require('nodemailer')
const fs = require('fs')
const Handlebars = require('handlebars')

const createTransport = () => {
    return new Promise((resolve, reject) => {
        const transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        transport.verify().then(() => {
            resolve(transport)
        }).catch((error) => {
            reject(error)
        })
    })
}

const readHtml = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) reject(err)
            resolve(data)
        })
    })
}

const compileTemplate = (filePath, dynamicElement = {}) => {
    return new Promise((resolve, reject) => {
        readHtml(filePath).then((details) => {
            const template = Handlebars.compile(details)
            resolve(template(dynamicElement))
        }).catch((error) => {
            reject(error)
        })
    })
}

exports.sendMail = (filePath, dynamicElement, userEmail, subject,) => {
    return new Promise((resolve, reject) => {
        createTransport().then((transport) => {
            compileTemplate(filePath, dynamicElement).then((html) => {
                transport.sendMail({ from: process.env.EMAIL_USER, to: userEmail, subject: subject, html: html }, (error, info) => {
                    if (error) reject(error)
                    resolve(info)
                })
            }).catch((error) => {
                reject(error)
            })
        }).catch((error) => {
            reject(error)
        })
    })
}