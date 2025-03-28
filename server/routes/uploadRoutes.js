const express = require("express");
const { upload, validateUpload } = require("../middleware/uploadMiddleware");
const { UploadAvatar } = require("../controllers/uploadController");

const upLoadrouter = express.Router();

// API Upload Avatar
upLoadrouter.post(
    "/uploadAvatar",
    upload.single("file"),
    validateUpload,
    UploadAvatar
);

module.exports = upLoadrouter;