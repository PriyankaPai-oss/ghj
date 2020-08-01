
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');

const URI = "mongodb+srv://dbUser:summer2020@cluster0.hropv.mongodb.net/test?retryWrites=true&w=majority";

const connectDB = async() => {
    const conn = mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("DB connected");

    let gfs;
    const connect = mongoose.createConnection(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    connect.once('open', () => {
        gfs = Grid(connect.db, mongoose.mongo);
        gfs.collection('studentIds');
    })
}

module.exports = connectDB;