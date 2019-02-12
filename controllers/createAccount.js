var express = require('express');
const mongo = require('mongodb').MongoClient;
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
let jwt = require('jsonwebtoken');
let config = require('./config');
let middleware = require('./middleware');

var app = express();



    var bodyParser = require('body-parser');
    var jsonParser = bodyParser.json({ extended: false });
    //var request = require('request');
    app.post('/api/registerSlo', jsonParser, function (req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var recaptcha = req.body.recaptcha;
        var hostName = req.body.hostName;
        
        if(recaptcha == null || recaptcha == undefined || recaptcha == '') {
            res.send({ "success":false, "errorMsg" : "Please select captcha" });
        }
        else {
            var secretKey = "6Le40ZAUAAAAALyy3BgGkhQe08NfvKTwGzweEaO0";
            var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey
                + "&response=" + recaptcha + "&remoteip=" + req.connection.remoteAddress;
            request(verificationUrl, function (error, response, body) {
                body = JSON.parse(body);
                if (body.success !== undefined && !body.success) {
                    res.send({ "errorMsg": "Failed captcha verification" });
                }
                else {
                    
                }
            });
        }
        bcrypt.hash(password, 5, function(err, hash) {
            var activationCode = generateRandomNumber(20);
            var obj = {
                email: email,
                passwordHash: hash,
                activationCode: activationCode,
                authenticationState: 0
            };
            collection.insertOne(obj, function(err, res) {
                if (err) {
                    console.log(err);
                }
                else {
                    var mailOptions = {
                        from: 'fypinternship2018.2019@gmail.com',
                        to: email,
                        subject: 'Internship Management System Account Verification',
                        text: 'Greetings from Internship Management System 2019 \n\n'
                            + 'Click on the link below to activate your Internship Management System account: \n\n'
                            + 'http://' + hostName + '/slo/activateSloAccount.html?email=' + email + '&activateCode=' + activationCode
                    };
                    emailer.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        }
                    });
                }
            });
            //db.close();
            res.send({success: true});
        });
    });

    app.put('/api/activateSloAccount', jsonParser, function (req, res) {
        var email = req.body.email;
        var activationCode = req.body.activateCode;
        if(email != null && email != '' && activationCode != null && activationCode != '') {
            var query = { email: email };
            collection.find(query).toArray(function(err, result) {
                if (err) throw err;
                if(result.length > 0) {
                    if(result[0].activationCode == activationCode) {
                        var queryArgs = { email: email };
                        var newvalues = { $set: {authenticationState: 1} };
                        collection.updateOne(queryArgs, newvalues, function(err, response) {
                            if (err) throw err;
                            res.send({success: true});
                        });
                    }
                }
            });
        }
    });
});

module.exports = app;


var generateRandomNumber = function(digits){
    return crypto.randomBytes(Math.ceil(digits/2)).toString('hex');
};

var emailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "fypinternship2018.2019@gmail.com",
        pass: "fyp12345!!",
    }
});


