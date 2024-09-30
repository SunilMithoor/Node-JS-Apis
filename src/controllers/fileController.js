const firebase = require("../firebase/firebase.js");
const bucket = firebase.bucket;
const fs = require("fs");
const { logger } = require("../logger/logger.js");
const fileLogger = logger("Files");
const dateTimeUtils = require("../utils/dateTimeUtils.js");
const shortid = require("shortid");
const message = require("../constants/message.js");
const apiResponse = require("../response/apiResponse.js");
const serverCode = require("../response/serverCode.js");

async function uploadImage(file,req) {
  try {
    if (!file) {
      return apiResponse.failureJsonObject(
        serverCode.badRequest,
        false,
        message.select_file
      );
    }

    const userId = req.userId; // Extract the userId from the decoded token
    fileLogger.info(`User ID: ${userId}`); // Log the userId for debugging

    fileLogger.info(`Image file details: 
      filename: ${file.filename}, 
      originalname: ${file.originalname}, 
      mimetype: ${file.mimetype}, 
      size: ${file.size} bytes, 
      path: ${file.path}`);

    // Read the file from disk
    const fileBuffer = fs.readFileSync(file.path);

    // Check if file.buffer exists
    if (!fileBuffer) {
      return apiResponse.failureJsonObject(
        serverCode.internalServerError,
        false,
        message.file_buffer_undefined
      );
    }


    const dateTime = dateTimeUtils.giveCurrentDateTime();
    const fileName =
      `users/` +
      userId +
      `/images/${"Image_" + dateTime}${
        "_" + shortid.generate()
      }.${file.originalname.split(".").pop()}`;


    // Save file to Firebase Storage
    await bucket.file(fileName).save(fileBuffer, { resumable: true });

    // Generate signed URL after successful upload
    const [url] = await bucket.file(fileName).getSignedUrl({
      action: "read",
      expires: "03-01-2500",
    });

    // Delete the local file after successful upload
    fs.unlink(file.path, (err) => {
      if (err) {
        fileLogger.error(`Error deleting file: ${file.path}, Error: ${err}`);
        return apiResponse.failureJsonObject(
          serverCode.internalServerError,
          false,
          message.file_deletion_failed
        );
      }
      fileLogger.info(`Local file deleted: ${file.path}`);
    });

    return url;
  } catch (error) {
    return apiResponse.failureJsonObject(
      serverCode.internalServerError,
      false,
      error.message
    );
  }
}

const addMultipleImages = async (req, res, next) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res
        .status(serverCode.badRequest)
        .send(
          apiResponse.failureJsonObject(
            res.statusCode,
            false,
            message.select_file
          )
        );
    }
    // const urls = await Promise.all(files.map(uploadImage));

    const urls = await Promise.all(files.map((file) => uploadImage(file, req)));

    return res
      .status(serverCode.ok)
      .send(
        apiResponse.successJsonObject(
          res.statusCode,
          true,
          message.uploaded_to_firebase,
          urls
        )
      );
  } catch (error) {
    return res
      .status(serverCode.badRequest)
      .send(
        apiResponse.serverErrorJsonObject(res.statusCode, false, error.message)
      );
  }
};

module.exports = {
  addMultipleImages,
};
