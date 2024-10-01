const multer = require("multer");
const fs = require("fs");
const message = require("../constants/message.js");
const apiResponse = require("../response/apiResponse.js");
const serverCode = require("../response/serverCode.js");
const dateTimeUtils = require("../utils/dateTimeUtils.js");
const { logger } = require("../libs/logger.js");
const verifyLogger = logger("VerifyImage");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(message.upload_only_images, false);
    return;
  }
};

// Ensure 'uploads/' directory exists
const uploadDir = "./tmp/images";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Creates the folder if it doesn't exist
}

// Configure storage
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // cb(null, uniqueSuffix + '-' + file.originalname); // Set a unique filename

    const dateTime = dateTimeUtils.giveCurrentDateTime();
    const fileName = "Image_" + dateTime;
    cb(null, fileName);
  },
});

var uploadFile = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit to 2MB
});

// Multer configuration for handling both single and multiple file uploads
// var uploadFile = multer({
//   storage: storage,
//   fileFilter: imageFilter,
//   limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
// }).fields([
//   { name: "singleFile", maxCount: 1 }, // Handle single file uploads under 'singleFile'
//   { name: "multipleFiles", maxCount: 10 }, // Handle multiple file uploads under 'multipleFiles'
// ]);

// const cpUpload = upload.fields([
//   { name: "singleFile", maxCount: 1 },
//   { name: "multipleFiles", maxCount: 5 },
// ]);

// var uploadFile=multer({
//     storage: storage,
//     fileFilter: imageFilter,
//     limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
//   }).fields(cpUpload)

// Custom error handling middleware
const multerErrorHandler = (err, req, res, next) => {
  verifyLogger.error(`error  :: ${err}`);
  if (err instanceof multer.MulterError) {
    // Handle multer errors
    if (err.code === "LIMIT_FILE_SIZE") {
      // Read the file from disk
      // const filePath = req.file.path;
      // // Delete the file from local storage once uploaded
      // fs.unlink(filePath, (err) => {
      //   if (err) {
      //     verifyLogger.error(`Error deleting file: ${err}`);
      //   } else {
      //     verifyLogger.info(`File deleted from local storage: ${filePath}`);
      //   }
      // });

      return res
        .status(serverCode.badRequest)
        .send(
          apiResponse.serverErrorJsonObject(
            res.statusCode,
            false,
            message.file_size_error
          )
        );
    }
  } else if (err instanceof Error) {
    // Handle any other errors
    return res
      .status(serverCode.badRequest)
      .send(
        apiResponse.serverErrorJsonObject(
          res.statusCode,
          false,
          message.file_upload_error
        )
      );
  }

  // Call next() if the error is not handled
  next(err);
};

module.exports = {
  uploadFile,
  multerErrorHandler,
};
