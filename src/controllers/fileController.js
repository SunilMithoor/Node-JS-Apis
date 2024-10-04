const firebase = require("../firebase/firebase.js");
const bucket = firebase.bucket;
const fs = require("fs");
const { logger } = require("../libs/logger.js");
const appLogger = logger("Files");
const shortid = require("shortid");
const message = require("../constants/message.js");
const apiResponse = require("../response/apiResponse.js");
const serverCode = require("../response/serverCode.js");
const db = require("../../models/index.js");
const moment = require("moment");
const date = new Date();

const Files = db.file;

async function uploadImage(file, req) {
  try {
    if (!file) {
      return apiResponse.failureJsonObject(
        serverCode.badRequest,
        false,
        message.select_file
      );
    }

    const userId = req.userId; // Extract the userId from the decoded token
    appLogger.info(`User ID: ${userId}`); // Log the userId for debugging

    appLogger.info(`Image file details: 
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
    const fileType = file.mimetype;
    // const dateTime = dateTimeUtils.giveCurrentDateTime();
    const dateTime = moment(date).format("YYYY-MM-DD_HH:mm:ss");
    const folderName = `users/` + userId + `/images/`;
    const fileName = `${"Image_" + dateTime}${
      "_" + shortid.generate()
    }.${file.originalname.split(".").pop()}`;

    // const fileName =
    //   `users/` +
    //   userId +
    //   `/images/${"Image_" + dateTime}${
    //     "_" + shortid.generate()
    //   }.${file.originalname.split(".").pop()}`;

    // Save file to Firebase Storage
    await bucket
      .file(folderName + fileName)
      .save(fileBuffer, { resumable: true });

    // Generate signed URL after successful upload
    const [url] = await bucket.file(folderName + fileName).getSignedUrl({
      action: "read",
      expires: "03-01-2500",
    });

    // Insert the new files into the Files table
    const fileRecord = await Files.create({
      userId: userId,
      name: fileName,
      fileType: fileType,
      filePath: url,
      module: "none",
    });

    if (fileRecord[0] === 0) {
      // Check if the update was successful
      return apiResponse.failureJsonObject(
        serverCode.notFound,
        false,
        message.unable_upload_image_url
      );
    }

    // Delete the local file after successful upload
    fs.unlink(file.path, (err) => {
      if (err) {
        appLogger.error(`Error deleting file: ${file.path}, Error: ${err}`);
        return apiResponse.failureJsonObject(
          serverCode.internalServerError,
          false,
          message.file_deletion_failed
        );
      }
      appLogger.info(`Local file deleted: ${file.path}`);
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

const addMultipleImages = async (req, res) => {
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
