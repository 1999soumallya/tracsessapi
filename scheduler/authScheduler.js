const { scheduleJob } = require("node-schedule");
const moment = require("moment-timezone");
const VerificationModel = require("../models/VerificationModel");

scheduleJob('*/1 * * * *', async () => {
    await VerificationModel.deleteMany({ expired: { $lt: moment().utc().format() } })
})