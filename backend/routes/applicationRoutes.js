
const express = require("express");

const router = express.Router();

const {
  applyJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, applyJob);

router.get("/my", protect, getMyApplications);
router.get("/job/:jobId", protect, getJobApplicants);

router.put(
  "/:applicationId/status",
  protect,
  updateApplicationStatus
);

router.patch(
  "/:applicationId/status",
  protect,
  updateApplicationStatus
);

module.exports = router;