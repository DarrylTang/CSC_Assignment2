var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ extended: false });
var nodemailer = require('nodemailer');
let jwt = require('jsonwebtoken');
let config = require('./config');
let middleware = require('./middleware');
const firebase = require('firebase');
var admin = require("firebase-admin");
var app = express();

app.set('view engine', 'ejs');

app.post('/login', jsonParser, function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
        //Once the user has given the correct email and password, check the role of the user
        console.log(user.user.uid + ' signed in.');
        res.send({success: true});
    }).catch(function (error) {
        if (error.code == "auth/invalid-email" || error.code == "auth/user-not-found" || error.code == "auth/wrong-password") {
            res.send({ "success": false, "errorMsg": "Fail to login" });
        }
    });
});


module.exports = app;

var emailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "fypinternship2018.2019@gmail.com",
        pass: "fyp12345!!",
    }
});


