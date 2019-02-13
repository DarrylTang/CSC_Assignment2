const express = require("express");
const router = express.Router();
var app = express();
const upload = require('../Services/image-upload');
var aws = require('aws-sdk');

const singleUpload = upload.single('image');


aws.config.update({
  // Your SECRET ACCESS KEY from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
  secretAccessKey: "Rslq70OcriZgVN+Ps1ZVYYXnmjhyIiaSMdOaiiNt",
  // Not working key, Your ACCESS KEY ID from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
  accessKeyId: "ASIAXIJZVM7MOV2PKQE5",
  sessionToken: "FQoGZXIvYXdzEGUaDDsvNJ+iIFbXxAPNJSL5Aq8VcAXhRHhgo9q0LX9eqgY2vNimK2E58ULPzLlcEfSt6nAg4nX6Hmx9sffujXQ3fP/qG0RXEOJ+yko/nftOtzEnaYiTESQds5+qf+zAMS7gR74cjR4p9VJsVf0f1KNrnRRaMdyLAhiIFwqVt1YtJ5jHsYV4mFUn0ODPKFGyR2TgdUExnASHZOdzvV0liZIA0p2uj2hUaBcEeZ5WLdyQuU/Q/0W2lmGAfv1Stw1JN6bkTzWebVhg5JKGeq/YWZ/Z3kr7JWaYJPJcEolqZJsOhC2KqpeOuTCVPgDwz+tCbEUBkd6Volod6V1Z/4DpC7pccdqVHf0PAFaR29HakybqYA5v86LEot84XJDoO1Ll+9aC2YMhUWoHldoFn43VuPalDwYg7quTJgx2U6vWRgVAteV/kXBaaOtDlj0LbveuoF8CwEKWcfAABnL4R9xoINJRaGD5fhWqYMPvtPrYr6RBH9JDNY+Hh7r2w/OZh5fJbYxhGyCraAJbofT0KPTWiuMF",
    region: 'ap-southeast-1' // region of your bucket
});

var ddb = new aws.DynamoDB({ apiVersion: '2012-08-10' });
var s3 = new aws.S3({params: {Bucket: 'cscimageuploading' }});


app.post('/image-upload', function (req, res) {
  singleUpload(req, res, function (err, some) {
    if (err) {
      return res.status(422).send({ errors: [{ title: 'Image Upload Error', detail: err.message }] });
    }

    return res.json({ 'imageUrl': req.file.location });
  });
});

app.get('/getOneImage', (req, res) => {
  var filepath = req.query.image_path;
  var userid = req.query.userid;

  console.log(filepath); 
  console.log(userid)

  var params = {
    TableName: 'csc_image',
    Key: {
      image_path: { S: filepath },
      userid: { S: userid }
    }
  };

  // Call DynamoDB to read the item from the table
  ddb.getItem(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
     // console.log("Success", data.Item);
     var params = { Bucket: "cscimageupload", Key: data.Item.image_path.S };
     s3.getObject(params, function(err, data) {
        console.log("RETURN _---")
         res.writeHead(200, {'Content-Type': 'image/jpeg'});
         res.write(data.Body, 'binary');
         res.end(null, 'binary');
     });

      //console.log(data)
      //return data;
    }
  });

})

module.exports = app;