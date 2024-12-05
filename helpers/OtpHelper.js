const axios = require('axios')

axios.defaults.baseURL = process.env.OTP_BASE_URL + process.env.OTP_API_KEY

exports.sendOTP = (phone_number, otp_value, otp_template_name) => {
    return new Promise((resolve, reject) => {
        axios.post(`/SMS/${phone_number}/${otp_value}/${otp_template_name}`).then(response => {
            resolve(response.data)
        }).catch(error => {
            reject(error)
        })
    })
}