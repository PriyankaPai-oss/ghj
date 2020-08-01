const mongoose = require("mongoose");
const path = require('path');
const crypto = require('crypto');
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');

const tutorSchema = new mongoose.Schema({
    firstName: { type: String, required: true }, 
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password:{ type: String, required: true }, 
    gender: { type: String },
    followingSemesterGrade: { type: String },
    subjects: { type: String },
    experience: { type: String },
    availableHours: { type: Number },
    numberOfStudents: { type: String },
    duration: { type: String },
    reasonToTutor: { type: String },
    comments: { type: String },    
    transcript: { type: String },
    cv: { type: String },
    status: {
        type: String,
        index: true
    }
});

tutorSchema.statics.addTutor = function addtutor(reqBody, next) {
    let TutorModel = mongoose.model('tutor', tutorSchema);
    let username = reqBody.body.email;
    let tutor = new TutorModel({
        firstName: reqBody.body.firstName, 
        lastName: reqBody.body.lastName,
        username: reqBody.body.email,
        password: reqBody.body.password,
        email: reqBody.body.email,
        gender: reqBody.body.gender,
        followingSemesterGrade: reqBody.body.grade,
        subjects: reqBody.body.subjects,
        experience: reqBody.body.experience,
        availableHours: reqBody.body.hours,
        numberOfStudents: reqBody.body.students,
        duration: reqBody.body.duration,
        reasonToTutor: reqBody.body.reason,
        comments: reqBody.body.comments,    
        transcript: reqBody.body.transcript,
        cv: reqBody.body.cv,
        status: "ok"
    });
    tutor.save(function(err) {
        if (err) {
            console.log("error occurred when calling addTutor()");
            console.log(err);
            next(err);
        } else {
            console.log("successfully add new user: " + reqBody.body.email);
            next(null);
        }
    });
};

tutorSchema.statics.findTutor = function findtutor(username, next) {
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

module.exports = mongoose.model('tutor', tutorSchema);
