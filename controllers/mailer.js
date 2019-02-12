var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ extended: false});

app.post('/sendEmail', jsonParser, function (req, res) {
    var bcc = req.body.bcc;
    var cc = req.body.cc;
    var subject = req.body.subject;
    var email = '<html>' + req.body.text + '</html>';
    
    var mailoption = {
        from: '"Lifetime Talents Team" <fypinternship2018.2019@gmail.com>',
        bcc: bcc,
        cc: cc,
        subject: subject,
        html: email
    };
    emailer.sendMail(mailoption, function(error, info) {
        if(error) {
            console.log(error);
        }
    });
    res.send({success: true});
});

module.exports = app;

var emailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "fypinternship2018.2019@gmail.com",
        pass: "fyp12345!!",
    }
});