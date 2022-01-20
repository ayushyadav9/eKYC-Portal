const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.log('Mongoose connection error: ' + err);
});

const db = mongoose.connection;

db.on('error', () => {
    console.log('Error connecting to Database');
});