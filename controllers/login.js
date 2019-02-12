var express = require('express');
const mongo = require('mongodb').MongoClient;
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
let jwt = require('jsonwebtoken');
let config = require('./config');
let middleware = require('./middleware');

var app = express();

app.set('view engine', 'ejs');

/*
	Make a MongoDB connection
*/
var mongoURI = 'mongodb://localhost:27017';

mongo.connect(mongoURI, function(err, client) {
    if (err) throw err;

    const db = client.db('Internship-System');
    const collection = db.collection('slo_accounts');
    
    var bodyParser = require('body-parser');
    var jsonParser = bodyParser.json({ extended: false });
    
    app.post('/api/loginSlo', jsonParser, function (req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var query = { email: email };
        collection.find(query).toArray(function(err, result) {
            if (err) throw err;
            if(result.length > 0) {
                var member = result[0];
                bcrypt.compare(password, member.passwordHash, function(err, response) {
                    if(response) {
                        var token = jwt.sign({username: member.email},
                            config.secret,
                            { 
                                expiresIn: '12h'
                            }
                        );
                        res.send({success:true, email:member.email, token: token});
                    } else {
                        res.send({success:false});
                    }
                });
            }
            else {
                res.send({success: false});
            }
        });
    });

    app.get('/api/SloAuthState/:email', middleware.checkToken, function (req, res) {
        var email = req.params.email;
        var query = { email: email };
        collection.find(query).toArray(function(err, result) {
            if (err) throw err;
            if(result.length > 0) {
                var authState = result[0].authenticationState;
                res.send({authState: authState});
            }
        });
    });

    app.get('/api/getSlo/:email', middleware.checkToken, function (req, res) {
        var email = req.params.email;
        var query = { email: email };
        collection.find(query).toArray(function(err, result) {
            if (err) throw err;
            if(result.length > 0) {
                res.send(result[0]);
            }
        });
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


