// import controllers images
const imageController = require("../controllers/imageController.js");
const authJwt = require("../middlewares/authJwt.js");
const verifyImage = require("../middlewares/verifyImage.js");
const verifyMultipleImage = require("../middlewares/verifyMultipleImage.js");


// router
const router = require("express").Router();

/**
 * @openapi
 * /api/images/uploadImage:
 *   post:
 *     tags:
 *       - Image Controller
 *     summary: Upload Image
 *     security:
 *       - Authorization: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       409:
 *         description: Conflict
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */

// router.post("/uploadImage", imageController.uploadImage);
router.post(
  "/uploadImage",
  authJwt.verifyToken,
  verifyImage.uploadFile.single("file"),
  verifyImage.multerErrorHandler,
  imageController.uploadImage
);

/**
 * @openapi
 * /api/images/uploadMultipleImage:
 *   post:
 *     tags:
 *       - Image Controller
 *     summary: Upload Multiple Images
 *     security:
 *       - Authorization: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                   description: Array of image files to upload
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *       409:
 *         description: Conflict
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */

router.post(
  "/uploadMultipleImage",
  authJwt.verifyToken,
  verifyMultipleImage.uploadFile.array("files",5),
  verifyMultipleImage.multerErrorHandler,
  imageController.uploadMultipleImage
);

module.exports = router;
