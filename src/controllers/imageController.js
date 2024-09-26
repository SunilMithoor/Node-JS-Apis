const db = require("../models/index.js");
const message = require("../constants/message.js");
const apiResponse = require("../response/apiResponse.js");
const serverCode = require("../response/serverCode.js");
const { logger } = require("../logger/logger.js");
const imageLogger = logger("Images");
const fs = require("fs");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const multer = require("multer");
const dateTimeUtils = require("../utils/dateTimeUtils.js");
const firebase = require('../firebase/firebase.js');

// create main Model
// const Images = db.images;

const User = db.user;

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

// 1. Upload Image

const uploadImage = async (req, res, err) => {
  try {
    imageLogger.info(`uploadImage request`);
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

    imageLogger.info(`Image file details: 
      filename: ${req.file.filename}, 
      originalname: ${req.file.originalname}, 
      mimetype: ${req.file.mimetype}, 
      size: ${req.file.size} bytes, 
      path: ${req.file.path}`);

    const userId = req.user_id; // Extract the userId from the decoded token
    imageLogger.info(`User ID: ${userId}`); // Log the userId for debugging

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

    const dateTime = dateTimeUtils.giveCurrentDateTime();
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

    imageLogger.info(`DownloadUrl  :: ${downloadURL}`);

    // Update the user table with the new image URL
    const users = await User.update(
      { image: downloadURL }, // Set the image column to the new URL
      { where: { user_id: userId } } // Update where user ID matches
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
        imageLogger.error(`Error deleting file: ${err}`);
      } else {
        imageLogger.info(`File deleted from local storage: ${filePath}`);
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
    imageLogger.error(`error  :: ${err}`);
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

// //2. Multiple Upload Images

// const uploadMultipleImage = async (req, res, err) => {
//   try {
//     imageLogger.info(`multipleUploadImage request`);
//     if (req.file == undefined) {
//       return res
//         .status(serverCode.badRequest)
//         .send(
//           apiResponse.serverErrorJsonObject(
//             res.statusCode,
//             false,
//             message.select_file
//           )
//         );
//     }

//     imageLogger.info(`Image file details: 
//       filename: ${req.file.filename}, 
//       originalname: ${req.file.originalname}, 
//       mimetype: ${req.file.mimetype}, 
//       size: ${req.file.size} bytes, 
//       path: ${req.file.path}`);

//     const userId = req.user_id; // Extract the userId from the decoded token
//     imageLogger.info(`User ID: ${userId}`); // Log the userId for debugging

//     //Store file in firebase datastore

//     const files = req.files;
//     const promises = [];

//     files.forEach(file => {
//       const blob = bucket.file(Date.now() + '-' + file.originalname);
//       const blobStream = blob.createWriteStream({
//         metadata: {
//           contentType: file.mimetype
//         }
//       });

//       blobStream.end(file.buffer);

//       promises.push(new Promise((resolve, reject) => {
//         blobStream.on('finish', () => {
//           blob.getSignedUrl({
//             action: 'read',
//             expires: '03-09-2491' // link expiration
//           }).then((url) => {
//             resolve(url[0]); // push the URL to resolve on success
//           }).catch(reject);
//         });

//         blobStream.on('error', reject);
//       }));
//     });

//     const urls = await Promise.all(promises);
 
  
//     imageLogger.info(`DownloadUrl  :: ${urls}`);

  

//     // Delete the file from local storage once uploaded
//     // fs.unlink(filePath, (err) => {
//     //   if (err) {
//     //     imageLogger.error(`Error deleting file: ${err}`);
//     //   } else {
//     //     imageLogger.info(`File deleted from local storage: ${filePath}`);
//     //   }
//     // });

//     return res
//       .status(serverCode.ok)
//       .send(
//         apiResponse.successJsonObject(
//           res.statusCode,
//           true,
//           message.uploaded_to_firebase,
//           downloadURL
//         )
//       );
//   } catch (err) {
//     imageLogger.error(`error  :: ${err}`);
//     return res
//       .status(serverCode.notFound)
//       .send(
//         apiResponse.serverErrorJsonObject(
//           res.statusCode,
//           false,
//           message.server_error
//         )
//       );
//   }
// };

module.exports = {
  uploadImage,
  // uploadMultipleImage,
};
