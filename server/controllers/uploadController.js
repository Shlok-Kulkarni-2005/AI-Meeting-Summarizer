async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      throw new Error("NO_FILE");
    }

    res.json({
      message: "File uploaded successfully",
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileSizeKB: Math.round(req.file.size / 1024),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadFile };
