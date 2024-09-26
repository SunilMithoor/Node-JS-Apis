const express = require('express');
const router = express.Router()

// Import routes from other files
const userRouter = require('./userRouter.js');
const imageRouter = require('./imageRouter.js');

// Combine both routers into the same route
router.use('/user', userRouter); // You can modify the path as needed
router.use('/images', imageRouter);// You can modify the path as needed

module.exports = router;