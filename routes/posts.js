const express = require("express");
const postController = require("../controllers/post.controller");
const checkAuthMiddleware = require("../middleware/check-auth");

const router = express.Router();

router.get("/", postController.index);

module.exports = router;
