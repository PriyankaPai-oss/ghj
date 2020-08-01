const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true }, 
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password:{ type: String}, 
    gender: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    school: { type: String },
    grade: { type: Number },
    subjects: { type: String },
    reasonForTutor: { type: String },
    duration: { type: String },
    sessionFreq: { type: String },
    eligibilityForFreeTutor: { type: String },
    //uploadedStudentId: { type: String },
    status: {
        type: String,
        index: true
    }
});

studentSchema.statics.addStudent = function addStudent(reqBody, next) {
    let StudentModel = mongoose.model('student', studentSchema);
    let username = reqBody.body.email;
    let student = new StudentModel({
        firstName: reqBody.body.firstName, 
        lastName: reqBody.body.lastName,
        username: username,
        password: reqBody.body.password,
        email: username,
        gender: reqBody.body.gender,
        city: reqBody.body.city,
        state: reqBody.body.state,
        country: reqBody.body.country,
        school: reqBody.body.school,
        grade: reqBody.body.grade,
        subjects: reqBody.body.subjects,
        reasonForTutor: reqBody.body.reason,
        duration: reqBody.body.duration,
        sessionFreq: reqBody.body.session,
        eligibilityForFreeTutor: reqBody.body.eligibility,
        // uploadedStudentId: reqBody.body.studentId,
        status: "ok"
    });
    student.save(function(err) {
        if (err) {
            console.log("error occurred when calling addStudent()");
            console.log(err);
            next(err);
        } else {
            const uploaded = uploadedStudentId(username, reqBody.body.studentId);
            console.log("successfully add new user: " + username);
            next(null);
        }
    });
};

studentSchema.statics.findStudent = function findStudent(username, next) {
    this.findOne({'username': username}, function (err, user) {
        if (err) {
            // handle error
            console.log("error occurred when calling findUser()");
            console.log(err);
        }        
        if (user) {
            // check password - hashed
            next([true, true]);
        } else {
            next([false, false]);
        }
    });
};

const URI = "mongodb+srv://dbUser:summer2020@cluster0.hropv.mongodb.net/test?retryWrites=true&w=majority";

function uploadedStudentId(username, studentId) {
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
                bucketName: 'studentIds'
              };
              resolve(fileInfo);
            });
          });
        }
      });
    const upload = multer({ storage });
    upload.single(studentId)
}
module.exports = mongoose.model('student', studentSchema);