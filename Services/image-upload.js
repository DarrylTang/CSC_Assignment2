var aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');


aws.config.update({
    // Your SECRET ACCESS KEY from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
    secretAccessKey: "2wV562c8+mjetzGcNMsZ4RLERJEEDw2u+vMQ/+Im",
    // Not working key, Your ACCESS KEY ID from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
    accessKeyId: "ASIA6EZFZYG2BBZTGTM7",
    sessionToken: "FQoGZXIvYXdzEGEaDOaEdURslECjTAXLkCL1AvhJNqTvHjrBfwDzCCqwOpCvMezKyaqCVxxTI2umyXsL7gIsRL9wAlszpl9nZdUjevS0/iN5EgQUt3XjZmxivJ96owFf16qdsofpfC3uF1tpX2rRZntjDNVWxj0y/SNJNCnFSCGQce3WtyLidU4lV+CHPB1UoGYRkH61xcu0mJD6IrlBEpm7DeCEh/R8p2naJvkqLKrw3J9xh0ho3WllMitr3vbxEob4k6BP48fOPlcYGuJ/gHszkd0axcIvHLGqQ7E51yOcEk0A2o5i5osG9Eiqmu7WOn4dQj8oM8/Rdkg92KRTgI1jMuUjPAbqmbdCaw6zosZ5Uj6x1iA31cMoe9y7WEljkzlBx1I6UaHLKY83sKdtiSjQ8JokYX4Mi3DE/t+Vwqez3gy8uHXtF5m59fYgqFtyuLiKZWu3Cov4aJTWD82bDjKcsCnI439w/ma+1QdFOzGW0UTHp5CVMA5ZqiDKuLuSJVPvVdbUuDK3y0K6kqR68bMox+KJ4wU=",
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
  storage: multerS3({
    s3: s3,
    bucket: 'cscimageupload',
    //acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname , userid: 'plswork'});
    },
    key: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
})

module.exports = upload;

