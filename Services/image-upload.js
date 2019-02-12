var aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');


aws.config.update({
  // Your SECRET ACCESS KEY from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
  secretAccessKey: "AHHU3i9kOvy81xXreyfoXX/UwxmG4py0WlSSOheL",
  // Not working key, Your ACCESS KEY ID from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
  accessKeyId: "ASIA6EZFZYG2GOQGQ3NY",
  sessionToken: "FQoGZXIvYXdzEGMaDHdi9Qv5p/bF75ikeiL1AoEVGL8b1ckTH+QMBQh9FY1I8BJoHilBAsFPGlCSn0J+wjGabZY4jYQBAHIH5UEAoqjakwsrS6mhs4tvwO/R+JqY/gHHG72+JBjFrWmdcGzcdgnEkUVTesV4JubQmUL5Gj4Gi4SpBK+KcvCkdv09fLEO3oW4YwblHoOaie8Qt5QrE6++0wH2n9qN6pwYI7c+kC1qkdDGHBeQ8bsP0XlT3QjBBAtMSw/Il4dXaMl/OtBCdsWuePE7e6JsjmL7BpBRWp7hXQFEf0heOfFyOFQ7nNikO6PLp0lELE2P+mpF03WQlv8vuyX37oe4pOcLGfGDFBwq06o6zORZd4gXIYvxD9CEepkbEPOnASw+48Yrmwhxfui+LxfUuAOb4p1Qh6e86abdC2UpGANOla8JhLX+7Ty6LdmmwAzM16xc9pi7kOkkf9j4kdO2VnUIW1E2BG8YO4xGb55Gm5ePuZ8HRVAY1DvFH9YbeFfPKGWpY2FoTua/oeE0iswo6KaK4wU=",
  region: 'ap-southeast-1' // region of your bucket
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
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
})

module.exports = upload;

