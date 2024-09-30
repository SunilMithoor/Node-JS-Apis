// import controllers user
const userController = require("../controllers/userController.js");
const authJwt = require("../middlewares/authJwt.js");
// router
const router = require("express").Router();

// use routers

/** POST Methods */
/**
 * @openapi
 * '/api/user/addUser':
 *   post:
 *     tags:
 *       - User Controller
 *     summary: Create a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *               - firstName
 *               - lastName
 *               - fcmToken
 *               - dateOfBirth
 *             properties:
 *               userName:
 *                 type: string
 *                 default: sunil
 *               password:
 *                 type: string
 *                 default: sunil20!@
 *               firstName:
 *                 type: string
 *                 default: sunil
 *               lastName:
 *                 type: string
 *                 default: mg
 *               fcmToken:
 *                 type: string
 *                 default: wergedwgwegweg
 *               dateOfBirth:
 *                 type: string
 *                 default: 2024-05-23
 *     responses:
 *       201:
 *         description: Created
 *       409:
 *         description: Conflict
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */
router.post("/addUser", userController.addUser);

/** POST Methods */
/**
 * @openapi
 * '/api/user/loginUser':
 *   post:
 *     tags:
 *       - User Controller
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 default: sunil
 *               password:
 *                 type: string
 *                 default: sunil20!@
 *     responses:
 *       200:
 *         description: Success
 *       409:
 *         description: Conflict
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */
router.post("/loginUser", userController.loginUser);

/** GET Methods */
/**
 * @openapi
 * '/api/user/getAllUsers':
 *  get:
 *     tags:
 *     - User Controller
 *     security:
 *     - Authorization: []
 *     summary: Get users list
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get("/getAllUsers", authJwt.verifyToken, userController.getAllUsers);

/** GET Methods */
/**
 * @openapi
 * '/api/user/getUserById':
 *  get:
 *     tags:
 *     - User Controller
 *     security:
 *     - Authorization: []
 *     summary: Get user data by id
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get("/getUserById", authJwt.verifyToken, userController.getUserById);

/** DELETE Methods */
/**
 * @openapi
 * '/api/user/deleteUser':
 *  delete:
 *     tags:
 *     - User Controller
 *     security:
 *     - Authorization: []
 *     summary: Delete user by Id
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.delete("/deleteUser", authJwt.verifyToken, userController.deleteUser);

/** Get Methods */
/**
 * @openapi
 * '/api/user/logoutUser':
 *  get:
 *     tags:
 *     - User Controller
 *     security:
 *     - Authorization: []
 *     summary: Logout user
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get("/logoutUser", authJwt.verifyToken, userController.logoutUser);

/** Get Methods */
/**
 * @openapi
 * '/api/user/getUserData':
 *  get:
 *     tags:
 *     - User Controller
 *     security:
 *     - Authorization: []
 *     summary: Get user data
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get("/getUserData", authJwt.verifyToken, userController.getUserData);

module.exports = router;
