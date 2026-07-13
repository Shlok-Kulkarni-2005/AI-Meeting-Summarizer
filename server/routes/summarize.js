const express = require("express");
const router = express.Router();
const { summarizeMeeting } = require("../controllers/summarizeController");

router.post("/", summarizeMeeting);

module.exports = router;
