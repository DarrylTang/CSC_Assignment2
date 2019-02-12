var aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');


aws.config.update({
    // Your SECRET ACCESS KEY from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
    secretAccessKey: "PPuXBioNnURdncaS414+qbbIB5Arym2aw9bna0wY",
    // Not working key, Your ACCESS KEY ID from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
    accessKeyId: "ASIA6EZFZYG2LR5LNRH2",
    sessionToken: "FQoGZXIvYXdzEGEaDOSu9nhuSIS+3Tb+PSL1AgUqAjdSTr3FCylIJluGBrAy6MemojvuSjoK5TEwODn20JfK0JscprAkLSlqXsTyz3PP0H/FbmDohHqXElNNulG7gScnFfvi9w+87f8JZRvsd3RSMUM3njJCO+S5Hr3m7MDsv/nHCa/+f7Ur9+sYTaP8wwY0S6b5pow9dcNLhgN8HfiXPPNt+M6m0FkUDTDT0XJRiW6K4kOCpPl3vIZww4nL15FChvhokCkkxDijDGMA9go+3yuSshOUnnpkM9A4l1UhEWrk0YhT8k74CrQDbr8OfhLli8Byf0ogOmUOFfExFEByw4mwWGBzqKI+ZolKcHiB1yqT8GLH4JcU+oBGjVPbqVdF33tdtlAPESCTVkTEf1y0wfA+1lDr/oHXo371IDd5VHMYWPHh9A1/4uYGqnOOkxXUmQfNtrgebCb4ycgGROz8tRVFwW8dxCuVMQzO97BtUxWV3OaMg/UN0eVFlTmge8lC3WY0qFwq7WhSxLuYqFQBe3IogfqJ4wU=",
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
    bucket: 'cscimagetest',
    //acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname , userid: 'plswork', description: 'omg i like this image alot pls like me'});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString()+'.jpeg')
    }
  })
})

module.exports = upload;

