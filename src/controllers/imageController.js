const db = require("../../models/index.js");
const message = require("../constants/message.js");
const apiResponse = require("../response/apiResponse.js");
const serverCode = require("../response/serverCode.js");
const { logger } = require("../libs/logger.js");
const appLogger = logger("Images");
const fs = require("fs");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const firebase = require("../firebase/firebase.js");
const moment = require('moment');
const date = new Date();

// create main Model
// const Images = db.images;

const User = db.user;


// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// 1. Upload Image

const uploadImage = async (req, res) => {
  try {
    appLogger.info(`uploadImage request`);
    if (req.file == undefined) {
      return res
        .status(serverCode.badRequest)
        .send(
          apiResponse.serverErrorJsonObject(
            res.statusCode,
            false,
            message.select_file
          )
        );
    }

    appLogger.info(`Image file details: 
      filename: ${req.file.filename}, 
      originalname: ${req.file.originalname}, 
      mimetype: ${req.file.mimetype}, 
      size: ${req.file.size} bytes, 
      path: ${req.file.path}`);

    const userId = req.userId; // Extract the userId from the decoded token
    appLogger.info(`User ID: ${userId}`); // Log the userId for debugging

    //Store file in db using blob and local storage

    // Ensure 'uploads/' directory exists
    // const uploadDir = "./uploads/images/";
    // if (!fs.existsSync(uploadDir)) {
    //   return res
    //     .status(serverCode.notFound)
    //     .send(
    //       apiResponse.serverErrorJsonObject(res.statusCode,false, message.not_found)
    //     );
    // }

    // Images.create({
    //   type: req.file.mimetype,
    //   name: req.file.originalname,
    //   data: fs.readFileSync(uploadDir + req.file.filename),
    // }).then(() => {
    //   // fs.writeFileSync(
    //   //   uploadDir + image.name,
    //   //   image.data
    //   // );
    //   return res
    //     .status(serverCode.ok)
    //     .send(
    //       apiResponse.successJsonObject(
    //         res.statusCode,
    //         true,
    //         message.file_uploaded,
    //         null
    //       )
    //     );
    // });

    //Store file in firebase datastore

    // Read the file from disk
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

    // const dateTime = dateTimeUtils.giveCurrentDateTime();
    const dateTime = moment(date).format('YYYY-MM-DD_HH:mm:ss'); 
    // const storageRef = ref(storage, `userId/images/${"Image_" + dateTime}`);
    const storageRef = ref(
      storage,
      `/users/` +
        userId +
        `/images/${"Image_" + dateTime}.${req.file.originalname
          .split(".")
          .pop()}`
    );

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      fileBuffer,
      metadata
    );
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    appLogger.info(`DownloadUrl  :: ${downloadURL}`);

    // Update the user table with the new image URL
    const users = await User.update(
      { imageUrl: downloadURL }, // Set the image column to the new URL
      { where: { userId: userId } } // Update where user ID matches
    );

    if (users[0] === 0) {
      // Check if the update was successful
      return res
        .status(serverCode.notFound)
        .send(
          apiResponse.failureJsonObject(
            res.statusCode,
            false,
            message.unable_upload_image_url
          )
        );
    }

    // Delete the file from local storage once uploaded
    fs.unlink(filePath, (err) => {
      if (err) {
        appLogger.error(`Error deleting file: ${err}`);
      } else {
        appLogger.info(`File deleted from local storage: ${filePath}`);
      }
    });

    return res
      .status(serverCode.ok)
      .send(
        apiResponse.successJsonObject(
          res.statusCode,
          true,
          message.uploaded_to_firebase,
          downloadURL
        )
      );
  } catch (err) {
    appLogger.error(`error  :: ${err}`);
    return res
      .status(serverCode.notFound)
      .send(
        apiResponse.serverErrorJsonObject(
          res.statusCode,
          false,
          message.server_error
        )
      );
  }
};

//2. Multiple Upload Images

const uploadMultipleImage = async (req, res) => {
  try {
    appLogger.info(`multipleUploadImage request`);
    if (
      req.files == undefined ||
      !req.files ||
      Object.keys(req.files).length === 0
    ) {
      return res
        .status(serverCode.badRequest)
        .send(
          apiResponse.serverErrorJsonObject(
            res.statusCode,
            false,
            message.select_file
          )
        );
    }

    const userId = req.userId; // Extract the userId from the decoded token
    appLogger.info(`User ID: ${userId}`); // Log the userId for debugging

    const uploadPromises = [];
    const files = req.files;
    appLogger.info(`files: ${files}`);

    const bucket = firebase.bucket;

    files.forEach((file) => {
      appLogger.info(`Image file details: 
        filename: ${file.filename}, 
        originalname: ${file.originalname}, 
        mimetype: ${file.mimetype}, 
        size: ${file.size} bytes, 
        path: ${file.path}`);

      // const dateTime = dateTimeUtils.giveCurrentDateTime();
      const dateTime = moment(date).format('YYYY-MM-DD_HH:mm:ss'); 
      const folderName = "users/" + userId + "/images/";
      const fileName = "Image_" + dateTime + "_" + file.originalname;
      const blob = bucket.file(folderName + fileName);
     
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      uploadPromises.push(
        new Promise((resolve, reject) => {
          blobStream.on("error", (error) => {
            appLogger.info(`Error: ${error}`);
            reject(error); // Reject the promise on error
          });

          blobStream.on("finish", () => {
            blob
              .getSignedUrl({
                action: "read",
                expires: "03-01-2500", // link expiration
              })
              .then((url) => {
                resolve(url[0]); // push the URL to resolve on success
                appLogger.info(`Url success: ${url}`);
              })
              .catch((error) => {
                appLogger.info(`Error: ${error}`);
                reject(error); // Reject on error in getting signed URL
              });
          });
          // Write the buffer to the blob stream and end the stream
          blobStream.end(file.buffer); // Ensure the buffer is passed here
        })
      );
    });

    const urls = await Promise.all(uploadPromises);
    appLogger.info(`DownloadUrl  :: ${urls}`);

    

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
  } catch (err) {
    appLogger.error(`error  :: ${err}`);
    return res
      .status(serverCode.notFound)
      .send(
        apiResponse.serverErrorJsonObject(
          res.statusCode,
          false,
          message.server_error
        )
      );
  }
};

module.exports = {
  uploadImage,
  uploadMultipleImage,
};
