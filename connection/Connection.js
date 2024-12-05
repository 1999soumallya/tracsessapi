const { default: mongoose } = require("mongoose");

mongoose.connect(process.env.MONGO_URL)
const db = mongoose.connection

db.on('connected', () => console.log('Database connected!'))
db.on('disconnect', () => console.log('Database disconnected!'))
db.on('error', console.error.bind(console,'MongoDB connection error: '));