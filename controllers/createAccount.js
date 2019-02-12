var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ extended: false});



    var bodyParser = require('body-parser');
    var jsonParser = bodyParser.json({ extended: false });
    //var request = require('request');

app.post('/register', jsonParser, function (req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var recaptcha = req.body.recaptcha;
        var hostName = req.body.hostName;
        console.log("HI" + recaptcha);
        
        if(recaptcha != null || recaptcha != undefined || recaptcha != '') {
            var secretKey = "6Le40ZAUAAAAALyy3BgGkhQe08NfvKTwGzweEaO0";
            var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey
                + "&response=" + recaptcha + "&remoteip=" + req.connection.remoteAddress;
            request(verificationUrl, function (error, response, body) {
                body = JSON.parse(body);
                if (body.success !== undefined && !body.success) {
                    res.send({ "errorMsg": "Failed captcha verification" });
                }
                else {
                    res.send({success: true});
                }
            });
        }
        else {
            res.send({ "success":false, "errorMsg" : "Please select captcha" });
        }
    });

module.exports = app;



