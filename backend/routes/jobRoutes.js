const express = require("express");

const router = express.Router();

const {
  createJob,
  getAllJobs,
  getMyJobs,
  getRecommendedJobs,
   getAIRecommendedJobs,
     deleteJob,
      updateJob
} = require("../controllers/jobController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, createJob);

router.get("/", getAllJobs);
router.get("/my", protect, getMyJobs);
router.get("/recommended", protect, getRecommendedJobs);
router.get("/ai-recommended", protect, getAIRecommendedJobs);
router.delete("/:id", protect, deleteJob);
router.put("/:id", protect, updateJob);
module.exports = router;
