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
  secretAccessKey: "scv2mKofr0TsyrgGdeMBaDkpgjeoDDYFm3xhDKfo",
  // Not working key, Your ACCESS KEY ID from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
  accessKeyId: "ASIA6EZFZYG2PC43P7DT",
  sessionToken: "FQoGZXIvYXdzEGQaDMGCh1h7zRyRmk8eKyL1AuLieXXlP7N659XI6044xNlmk18N7y5w2NJHQxHN5QsL3+JlF6ML5Qz7WWWZUoJmaPrzz780CrolLY3jmApE8cQexDLtjD4A4dHDHatkUmeGnLBukFOes+CYBLhLG/9Kto2VjigAKLYS+L+xVkJRvKV+PzgJ9Ac+OFP/khxSBouQjpcvUQiAe+nmNejhahpVOPki7AaUyEo111PK7ZJFSAqx6daGnKRXE6T8joXF0PQJ7hsNj1n0NWBkwYu+KmPG3RuD4IkM/xDeAI4Adeq2HeoiDlqeaWNUgdpLaWFtM9H/H2wSg6xAtErc3DsBl7OVKNj5haSMBJ7M93wxYPxvgR7Npf2tle0iG2aRaO2ArScMO6wHb3kjme6eeaSqoRNTx8IalrVppo+YTaKEMinhV390j/PWYYzxxr4O3oukUKXKzbSQiNsX1R9hBPHBcVhbEMn3doY/d7m+9bXWz6cIWPW/naHdwpHeZgwroKz75XAb5zadI1go0b2K4wU=",
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