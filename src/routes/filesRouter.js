const fileController = require("../controllers/fileController.js");
const authJwt = require("../middlewares/authJwt.js");
const router = require("express").Router();
const verifyMultipleImage = require("../middlewares/verifyMultipleImage.js");

/**
 * @openapi
 * /api/files/uploadFiles:
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
// router.post('/uploadFiles', addImage);

router.post(
  "/uploadFiles",
  authJwt.verifyToken,
  verifyMultipleImage.uploadFile.array("files", 5),
  verifyMultipleImage.multerErrorHandler,
  fileController.addMultipleImages
);

module.exports = router;
