const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const { uploadFile } = require("../controllers/uploadController");

router.post("/", upload.single("audio"), uploadFile);

module.exports = router;
