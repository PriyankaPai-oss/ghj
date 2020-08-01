const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');
const app = express();
const apiRouter = require('./routes/api');
const path = require('path');
const crypto = require('crypto');
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

var connectDB = require('./models/Connection');

// Middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// Mongo connection
const URI = "mongodb+srv://dbUser:summer2020@cluster0.hropv.mongodb.net/test?retryWrites=true&w=majority";

// Create mongo connection
const conn = mongoose.createConnection(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Init gfs
let gfs;

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

connectDB();

// Create storage engine
const storage = new GridFsStorage({
    url: URI,
    file: (req, file) => {
    console.log("process 1");

      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
  console.log("process 2");

          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
const upload = multer({ storage });


// @route GET /
// @desc Loads from
app.post('/', (req, res) => {
    res.render('index');
});

// @route POST /upload
// @desc Uploads file to DB
app.post('/upload', upload.single('file'), (req,res) => {
  res.json({ file: req.file});
});

const port = process.env.PORT || '5000';
app.listen(port, () => console.log("server started 5000;"))
