const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()
require('./connection/Connection')

const app = express()

const port = process.env.PORT || 3000

// Express server config
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

//Routes List
app.use('/api/role', require('./routes/RoleRoute'))
app.use('/api/permission', require('./routes/PermissionRoute'))
app.use('/api/file', require('./routes/ImageRoute'))
app.use('/api/user', require('./routes/UserRoutes'))
app.use('/api/organizer', require('./routes/OrganizerRoutes'))
app.use('/api/event', require('./routes/EventRoute'))
app.use('/api/session', require('./routes/SessionRoute'))
app.use('/api/vehicle-category', require('./routes/VehicleCategoryRoute'))
app.use('/api/vehicle', require('./routes/VehicleRoute'))
app.use('/api/vehicle-type', require('./routes/VehicleTypeRoute'))
app.use('/api/period', require('./routes/PeriodRoute'))
app.use('/api/specialization', require('./routes/SpelizationCategoyRouter'))
app.use('/api/designation', require('./routes/DesignationRoute'))
app.use('/api/tuner', require('./routes/TunersRoutes'))
app.use('/api/crew', require('./routes/CrewMemberRoute'))
app.use('/api/rider', require('./routes/RiderRoute'))
app.use('/api/relation', require('./routes/RelationRoute'))
app.use('/api/gender', require('./routes/GenderRoute'))
app.use('/api/track', require('./routes/TrackRoute'))
app.use('/api/weather', require('./routes/WeatherRoute'))
app.use('/api/track-condition', require('./routes/TrackConditionRoute'))
app.use('/api/direction', require('./routes/DirectionRoute'))
app.use('/api/notification', require('./routes/NotificationRoute'))
app.use('/api/session-setup', require('./routes/SessionSetupRoute'))
app.use('/api/vehicle-setup', require('./routes/VehicleSetupRoute'))
app.use('/api/laps', require('./routes/LapsRoute'))
app.use('/api', require("./routes/CommonRoute"))
app.use('/api/suspension-settings', require('./routes/SuspensionSettingRoute'))
app.use('/api/settings', require('./routes/SettingsRoute'))

// Test api
app.use('/', (req, res) => res.send('App is running!'))

// Scheduler Jobs
require('./scheduler/authScheduler')

const options = {
    key: fs.readFileSync('public/ssl/generated-private-key.txt'),
    cert: fs.readFileSync('public/ssl/e57ea0f0beac0e9f.crt')
};

https.createServer(options, app).listen(443, () => {
    console.log(`Example app listening on port ${443}!`)
});

// HTTP server to redirect to HTTPS
http.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(port);