var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var jsonParser = bodyParser.json({ extended: false});
const firebase = require('firebase');
var admin = require("firebase-admin");

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
        
        if(recaptcha == null || recaptcha == undefined || recaptcha == '') {
            res.send({ "success":false, "errorMsg" : "Please complete captcha" });
        }
        else {
            var secretKey = "6Le40ZAUAAAAALyy3BgGkhQe08NfvKTwGzweEaO0";
            var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey
                + "&response=" + recaptcha + "&remoteip=" + req.connection.remoteAddress;
            
            request(verificationUrl, function (error, response, body) {
                body = JSON.parse(body);
                
                if (body.success !== undefined && !body.success) {
                    res.send({"success":false, "errorMsg": "Failed captcha verification" });
                }
                else {
                    res.send({"success": true});
                    admin.auth().createUser({
                        email: email,
                        emailVerified: false,
                        password: password,
                        displayName: name
                      }).then(function (userRecord) {
                       /*
                        var ref = admin.database().ref("users").child(userRecord.uid);
                        ref.set({
                          email: email,
                          name: name,
                          password: md5(password),
                        });
                        */
                       // for add to db in aws 
                        console.log("Successfully created new user:", userRecord.uid);
                        res.end();
                      }).catch(function (error) {
                        console.log('Error creating new user:' + error);
                      });
                }
            });
        }
    });

module.exports = app;



