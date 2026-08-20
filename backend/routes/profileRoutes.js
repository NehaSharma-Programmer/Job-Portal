
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

router.get("/", protect, getProfile);

router.put("/", protect, updateProfile);

router.post(
  "/photo",
  protect,
  upload.single("photo"),
  uploadPhoto
);

router.post(
  "/resume",
  protect,
  upload.single("resume"),
  uploadResume
);



module.exports = router;

