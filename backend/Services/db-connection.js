const mongoose = require('mongoose');



module.exports.createDBConnection = async () => {
    // configure logs
    

    // Connect to database
    mongoose
        .connect(`${process.env.MONGO_URI}`, {
            useUnifiedTopology: true
        })
        .then(() => {
            console.log('Connected to mongodb.');
        })
        .catch((error) => {
            console.log("Database Connection Error: ",error);
        });
    mongoose.set('debug', true);
    const conn = mongoose.connection;

    conn.on('error', (error) => console.log("Database Connection Error: " + error));

    conn.once('open', () => console.log('Connection to Database is successful'));

    conn.once('disconnected', () => console.log('Disconnected from database'));

    module.exports.conn = conn;
}