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
  secretAccessKey: "Q3WVBK6s0qKM9hxVUNv/4KlhUPAc/QOkT5ezE259",
  // Not working key, Your ACCESS KEY ID from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
  accessKeyId: "ASIA6EZFZYG2AZOER25D",
  sessionToken: "FQoGZXIvYXdzEGYaDPfacMchLg4rhguy0SL1AmEimoylM157wQHMo54WMtZM7WvyvgDVuNv45kHZw70smziK4EVHSuPK5sQKXoJ4+g054fUiCbmDRIVSrrRvIU6UaulqtzYhsZJpwMS61AaRxas1b/UVNhbwUItc+OnIXsiXIYfzROoFFE8/1DkRoKBIwdCK2UhRngF0y61o+OkYnLhLW5RxHDrn0IuZiedFx0/FI5zxhd5ilhm3U9jBu18qC36MTgsDnwVxr5wt0JM9X73DSmqVsGZWY6nyIvJYz+I2ikBt/yy0J4ecQslK/kwxT7WbTVybWEZbAbVM8cP6p6VIZ7yLvG4AHIJowoIV+kMnH5oaMSLTNzSS/m0xPwK6IZKLCr+FSXHhaTQkkp7pBb9ucrytGgJHSKdAZ8EOz2FbwQYewzN3KYhqiFznELfLp7bDYK8hNNf2oLGnVxWsdM7PlvPtuhmmgcd37lRlDQcouLZCZZ0tfjGSo1oAVyoUWoaNI38AZ5wKtbpbyRjciJKXc0Mo6fKK4wU=",
    region: 'ap-southeast-1' // region of your bucket
});

var ddb = new aws.DynamoDB({ apiVersion: '2012-08-10' });
var s3 = new aws.S3({ params: { Bucket: 'cscimageupload' } });


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

  //Call DynamoDB to read the item from the table
  ddb.getItem(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      // console.log("Success", data.Item);
      var params = { Bucket: "cscimageupload", Key: data.Item.image_path.S };
      s3.getObject(params, function (err, data) {
        console.log("RETURN _---")
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.write(data.Body, 'binary');
        console.log(data.Metadata);
        res.end(null, 'binary');
      });

      //console.log(data)
      //return data;
    }
  });

});

app.get('/getImages', (req, res) => {
  var params = {
    TableName: "csc_image"
  };

  ddb.scan(params, (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log(data)
      res.send(data)
    }
  });

});

module.exports = app;