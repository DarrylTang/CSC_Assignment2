var aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
//var descriptions = req.body.description;

var s3Bucket = new aws.S3( { params: {Bucket: 'cscimageuploading'} } )
aws.config.update({
  // Your SECRET ACCESS KEY from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
  secretAccessKey: "L7K0Z1FXYK2p8jd39cFy+G2MstjekwLA4gFmyZZu",
  // Not working key, Your ACCESS KEY ID from AWS should go here,
  // Never share it!
  // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
  accessKeyId: "ASIA6EZFZYG2NCJNGOWP",
  sessionToken: "FQoGZXIvYXdzEGYaDErk8CG+UMtwVjArqyL1Ai5jr1KZ0h5TiO9FIX8oZA37ToVktGY0ymeohDy+e3cYMh+faulvSs1lbOTN73fUrrdWcSZYa6XifdHmcIgYJ3g7Zk7bDhbn1QdbZafcEytvma4h7XoEaQgbUXVQZev4XrmES6TzeO3p+mHodk+zR8ZxFAKz5o4qVywScTtqLEzVU2dlF/+TudVAQLWxJ62iVvqt95E1dEj5ktuX1cDILqPOULlT1q+g1ZR3oJC3Bgl35YVurAyDzSbvDpF6Qu20TU/0B9N2L+hAmcLRJDa02K65uQVqZ8cZDJPmfSwiP7lkgtirgBk4txxo4yo7sHuoSD5zQn0WcQ5LIxIe+9RxD6/Ov8+uSbmrDyx8Fmhx/vF8nBSgfatukFTvhBk3iWW7ChY8iprC8rudu9TXbThpRg/wZ2p+/lN5v0KYOKCJV6e/UuzungCOOgWLKfmWq5xtVI262Ho79tLIhCjH9zgVoVTVu9hCXVY6n4+cKrYHHjwUKD12ZQwo8vGK4wU=",
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

var description = ["I love CSC <3", "SOC BEST SCHOOL", "if you can find thi s it means its too late", "i love mr G his teaching is very nice please give us the distinction", ""];

 var index =  Math.floor(Math.random() * 4) + 1; 

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

