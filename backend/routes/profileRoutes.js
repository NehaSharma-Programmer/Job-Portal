
const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile,
  uploadPhoto,
  uploadResume,
} = require("../controllers/profileController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const handleUpload = (multerMiddleware) => (req, res, next) => {
  multerMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || "File upload error" });
    }
    next();
  });
};

router.get("/", protect, getProfile);

router.put("/", protect, updateProfile);

router.post(
  "/photo",
  protect,
  handleUpload(upload.single("photo")),
  uploadPhoto
);

router.post(
  "/resume",
  protect,
  handleUpload(upload.single("resume")),
  uploadResume
);



module.exports = router;

