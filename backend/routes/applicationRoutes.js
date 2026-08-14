
const express = require("express");

const router = express.Router();

const {
  applyJob,
  getMyApplications,
  getJobApplicants,
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, applyJob);

router.get("/my", protect, getMyApplications);
router.get("/job/:jobId", protect, getJobApplicants);
module.exports = router;