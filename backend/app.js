const express = require('express');
const app = express();
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
var multer = require('multer');

const crypto=require('crypto');
const mongoose = require('mongoose');
//const xoauth2=require('xoauth');
const mailer=require("nodemailer");


const URI = "mongodb+srv://dbUser:summer2020@cluster0.hropv.mongodb.net/test?retryWrites=true&w=majority";

const bdp=require('body-parser');
// //const prod=require('./api/routes/Send.js');

const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');

const path=require('path');
const apiRouter = require('./routes/api');
var connectDB = require('./models/Connection');

connectDB();

app.use(express.json({ extended: false}));
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser());
app.use(methodOverride('_method'));
//app.use(multer)
app.set('view engine', 'ejs');

app.use('/api', apiRouter);


app.use(bodyParser());

const storage = new GridFsStorage({
  url: URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'student_uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
// on server this will be http://localhost:post/cssFiles
app.use('/cssFiles',express.static(path.join(__dirname + '../../testhomepg/testhomepg/')));
app.use(express.static('./studentsignup'))
//app.use('/images',express.static(__dirname + '/studentsignup/'));

// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null,'/uploads/')
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.originalname)
//     }
//   });
   
var upload = multer({storage: storage});

app.get('/', function(req, resp) {
    //console.log(__dirname)
    resp.sendFile('home.html', {root:path.join(__dirname, './')});
    //resp.send("this works");
})

app.get('/tutorsignups', function(req,resp) {
    //console.log('Data:' + JSON.stringify(req.body));
    console.log("tutor signup form works!")
    resp.sendFile('tutorsignups.html', {root:path.join(__dirname, '../')});
})

app.get('/studentsignup', function(req,resp) {
    console.log("student signup form works!")
    resp.sendFile('studentsignup.html', {root:path.join(__dirname,"../studentsignup")});
})

app.get('/renderform.js', function(req, resp) {
    console.log('render form sent')
    resp.sendFile('renderform.js', {root:path.join(__dirname, '../')})
})

app.post('/tutorsubmit',  upload.array('files', 2), function(req, res) {
    console.log(req.body);
    console.log(req.files)
    console.log('Data:' + JSON.stringify(req.body));

    //let upload = multer({ storage: storage}).single('transcript');

    // upload(req, res, function(err) {
    //     // req.file contains information of uploaded file
    //     // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            res.send(req.fileValidationError);
        }
        else if (!req.file) {
            res.send('Please select an image to upload');
        }
        else {
            res.send('this shit works!!!');
        }
    // })

    console.log('File print out' + req.files)
    //resp.redirect('/api/tutor/register');
    //res.json({message: 'tutor message recieved!!!'})
    //resp.send('hsahsaj')
    // this is the header issue
    //resp.sendFile('tutorthankyou.html', {root:path.join(__dirname)})
})

// app.post('/tutorsubmit',  upload.single('transcript'), function(req, res) {
//     console.log(req.body);
//     console.log(req.files)
//     console.log(req.body.tutor_trans)
//     console.log('Data:' + JSON.stringify(req.body));

//     //let upload = multer({ storage: storage}).single('transcript');

//     // upload(req, res, function(err) {
//     //     // req.file contains information of uploaded file
//     //     // req.body contains information of text fields, if there were any

//         if (req.fileValidationError) {
//             res.send(req.fileValidationError);
//         }
//         else if (!req.file) {
//             res.send('Please select an image to upload');
//         }
//         else {
//             res.send('this shit works!!!');
//         }
//     // })

//     console.log(req.files)
//     //resp.redirect('/api/tutor/register');
//     //res.json({message: 'tutor message recieved!!!'})
//     //resp.send('hsahsaj')
//     // this is the header issue
//     //resp.sendFile('tutorthankyou.html', {root:path.join(__dirname)})
// })

// const methodOverride=require('method-override');
// const storage=multer.diskStorage({
//   destination :function(req,file,cb){
//     cb(null,'./uploads');
//   },
//   filename :function(req,file,cb){
//     cb(null,new Date().toISOString()+file.originalname);
//   }
// });
const fileFilter=(req,file,cb)=>{


  if(file.mimetype==='image/jpeg' || file.mimetype==='image/jpg' || file.mimetype==='image/png'){
    cb(null,true);

  }
  else{
    cb(null,false);
  }
};

let gfs;
const conn = mongoose.createConnection(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
conn.once('open', function () {
   gfs = Grid(conn.db, mongoose.mongo);

   gfs.collection('uploads');
})


//const upload = multer({ storage });
const upload2=multer({
  storage:storage,
  fileFilter:fileFilter

});

var connectDB = require('./models/Connection');
const Student=require('./models/Student');
connectDB();

app.use(express.static('uploads'));

app.use(bdp.urlencoded({ extended: false }))



// app.post('/Send', function (req, res) {
//   res.send(JSON.stringify(req.body)); 
//   console.log(req.body)
// });


app.post("/Send",upload.single('prodImage'),(req,res,next)=>{
  console.log("in the send");
 console.log(req.file);

   const DBElement=new Student({
    username: req.body.email,
    passwordHash: '',
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    email:req.body.email,
    gender:req.body.gender,
    city:req.body.city,
    state:req.body.firstName,
    country:req.body.firstName,
    school:req.body.firstName,
    grade:req.body.grade,
    subjects:req.body.subjects,
    reasonForTutor:req.body.firstName,
    duration:req.body.duration,
    sessionFreq:req.body.sessionFreq,
    eligibilityForFreeTutor:req.body.firstName,

   });
  //  DBElement.save().then(data=>{
  //   console.log("Body----->"+req.body);
  //   //alert("yes! done");
     
  //  });

  //  const transporter=mailer.createTransport({
  //   service:'gmail',
  //   auth:{

  //     // xoauth2:xoauth2.createXOAuth2Generator({
  //     user:'inplacelearn@gmail.com',
  //    password:'Password@1234'
  
  //   // })
  // }
  // });
  
  // var mailOptions={
  //   from :'no-reply@learninplace.com',
  //   to:req.body.email,
  //   subject:'Registration Confirmed at LearnInPlace',
  //   text:'<h1>Thanks for Signing Up</h1>'
  // };
  
  // transporter.sendMail(mailOptions,function(error,info){
  // if(error){
  //   console.log(error);
  
  // }
  // else{
  //   console.log('Email sent :'+info.response);
  // }
  // });

  return res.redirect('/finalpage.html');
  
 
});

// app.get('/contact',(req,res)=>{
  // const transporter=mailer.createTransport({
  //   service:'gmail',
  //   auth:{

  //     // xoauth2:xoauth2.createXOAuth2Generator({
  //     user:'inplacelearn@gmail.com',
  //    password:'Password@1234'
  
  //   // })
  // }
  // });
  
  // var mailOptions={
  //   from :'no-reply@learninplace.com',
  //   to:req.body.email,
  //   subject:'Registration Confirmed at LearnInPlace',
  //   text:'<h1>Thanks for Signing Up</h1>'
  // };
  
  // transporter.sendMail(mailOptions,function(error,info){
  // if(error){
  //   console.log(error);
  
  // }
  // else{
  //   console.log('Email sent :'+info.response);
  // }
  // });
// });

app.get(/^(.+)$/, function(req,resp) {
      console.log(req.params[0] + ' GET')
      resp.sendFile(req.params[0], {root:path.join(__dirname)});
})

//retrieve fikes 
app.get('/files',(req,res)=>{
  gfs.files.find().toArray((err,files)=>{
    if(!files || files.length===0){
      return res.status(404).json({
        err :'No file exists'
      });
    }
    return res.json(files);
  });
})

    app.post('/tutorthankyou', (req, res) => {
        console.log(req.body);
      });

    //   app.post('/StudentAlert', (req, res) => {
    //     console.log(req.body)
    //   });

    // app.post('/Send', function(req, res) {
    //     console.log("BODY"+req.body); //Output=> like { searchid: 'Array of checked checkbox' }
    //     console.log("SEARCH"+req.body.searchid); // to get array of checked checkbox
    
    //    res.sendFile(__dirname + '/test.html')
    //     //res.send(JSON.stringify(req.body))
    //     console.log(req.body)
    //   });
   
    


app.get('/tutorthankyou', function(req, resp) {
    console.log("tutor thankyou sent")
    //resp.sendFile('tutorthankyou.html', {root:path.join(__dirname, '../')})
    resp.sendFile('tutorthankyou.html', { root: './' });
})

const port = process.env.PORT || '3003';
app.listen(port, () => console.log("server started;"));

module.exports=app;
