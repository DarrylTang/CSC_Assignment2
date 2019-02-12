var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var jsonParser = bodyParser.json({ extended: false });
const firebase = require('firebase');
var admin = require("firebase-admin");
var aws = require('aws-sdk');
aws.config.update({
    // Your SECRET ACCESS KEY from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
    secretAccessKey: "IZxkRBuBUrFPhqhrh8w9MzSzr+DfCYIyscMW/rMD",
    // Not working key, Your ACCESS KEY ID from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
    accessKeyId: "AKIAJQ7WMYCEPABVB7CQ",
    region: 'ap-southeast-1' // region of your bucket
});

// Create the DynamoDB service object
var ddb = new aws.DynamoDB({ apiVersion: '2012-08-10' });
// for firebase 
var firebaseConfig = {
    apiKey: "AIzaSyBiReRUpgbfVWb2QeUaGrtFQS3NYdrm2r4",
    authDomain: "cscassignment-6c46c.firebaseapp.com",
    databaseURL: "https://cscassignment-6c46c.firebaseio.com",
    projectId: "cscassignment",
    storageBucket: "cscassignment.appspot.com",
    messagingSenderId: "705266244318"
};
firebase.initializeApp(firebaseConfig);

var serviceAccount = require("../cscassignment-firebase-adminsdk-4elk8-0aac5c8180.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cscassignment-6c46c.firebaseio.com"
});

app.post('/register', jsonParser, function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var recaptcha = req.body.recaptcha;
    var hostName = req.body.hostName;
    var name = req.body.name;
    console.log(recaptcha + "HI");

    if (recaptcha == null || recaptcha == undefined || recaptcha == '') {
        res.send({ "success": false, "errorMsg": "Please complete captcha" });
    }
    else {
        var secretKey = "6Le40ZAUAAAAALyy3BgGkhQe08NfvKTwGzweEaO0";
        var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey
            + "&response=" + recaptcha + "&remoteip=" + req.connection.remoteAddress;

        request(verificationUrl, function (error, response, body) {
            body = JSON.parse(body);

            if (body.success !== undefined && !body.success) {
                res.send({ "success": false, "errorMsg": "Failed captcha verification" });
            }
            else {
                admin.auth().createUser({
                    email: email,
                    emailVerified: false,
                    password: password,
                    displayName: name
                }).then(function (userRecord) {
                    var params = {
                        TableName: 'users',
                        Item: {
                            uid: {
                                S: userRecord.uid,
                            },
                            email: {
                                S: email,
                            },
                            name: {
                                S: name
                            }
                        },
                    };         
                    ddb.putItem(params, function (err, data) {
                        if (err) {
                            console.log("Error", err);
                        } else {
                         //   console.log("Success", data); 
                        res.send({"success": true});
                        }
                    });
                    // for add to db in aws 
                    console.log("Successfully created new user:", userRecord.uid);
                    //res.end();                
                   // return res.redirect('http://localhost:3000/');
                }).catch(function (error) {
                    console.log('Error creating new user:' + error);
                });
            }
        });
    }
});

module.exports = app;



