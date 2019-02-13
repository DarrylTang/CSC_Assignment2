var aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
//var descriptions = req.body.description;

var s3Bucket = new aws.S3( { params: {Bucket: 'cscimageuploading'} } )
aws.config.update({
  // Your SECRET ACCESS KEY from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
  secretAccessKey: "<SECRET ACCESS KEY>",
  // Not working key, Your ACCESS KEY ID from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
  accessKeyId: "<ACCESS ID>",
  sessionToken: "<SESSION TOKEN>",
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

var description = ["I love CSC <3"];

 var index =  0; 

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'cscimageupload',
    //acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname , userid: 'plswork', description: description[index]});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString()+'.jpg')
    }
  })
});


// https://stackoverflow.com/questions/32702431/display-images-fetched-from-s3

//ar s3Url = 'https://s3-us-east-1.amazonaws.com/cscimageuploading/';
var bucket = new aws.S3({params: {Bucket: 'cscimageupload' }});
  bucket.listObjects(function (err, data) {
    if (err) {
      console.log(err);
    } else {
      
      bucket.allImageData = data.Contents;
      console.log(data.Contents);
    }
  });

module.exports = upload;

