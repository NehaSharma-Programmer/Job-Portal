const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === "photo") {
    const photoTypes = [".jpg", ".jpeg", ".png", ".webp"];
    if (photoTypes.includes(extension)) {
      return cb(null, true);
    }
    return cb(
      new Error("Only JPG, JPEG, PNG and WebP files are allowed for profile photo")
    );
  }

  if (file.fieldname === "resume") {
    const resumeTypes = [".pdf", ".doc", ".docx"];
    if (resumeTypes.includes(extension)) {
      return cb(null, true);
    }
    return cb(
      new Error("Only PDF, DOC and DOCX files are allowed for resume")
    );
  }

  cb(new Error("Invalid upload field"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = upload;
