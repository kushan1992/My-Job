const express = require("express");
const jobController = require("../controllers/job.controller");
const checkAuthMiddleware = require("../middleware/check-auth");

const router = express.Router();

router.post("/", checkAuthMiddleware.checkAuth, jobController.save);

module.exports = router;
