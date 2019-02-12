var aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
//var descriptions = req.body.description;

var s3Bucket = new aws.S3( { params: {Bucket: 'cscimageuploading'} } )
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

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
}

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'cscimageupload',
    //acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname , userid: 'plswork', description: 'omg i like this image alot pls like me'});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString()+'.jpg')
    }
  })
});


// https://stackoverflow.com/questions/32702431/display-images-fetched-from-s3

//ar s3Url = 'https://s3-us-east-1.amazonaws.com/cscimageuploading/';
var bucket = new aws.S3({params: {Bucket: 'cscimageuploading' }});
  bucket.listObjects(function (err, data) {
    if (err) {
      console.log(err);
    } else {
      
      bucket.allImageData = data.Contents;
      console.log(data.Contents);
    }
  });

module.exports = upload;

