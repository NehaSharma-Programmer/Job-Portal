const express = require("express");

const router = express.Router();

const {
  createJob,
  getAllJobs,
  getRecommendedJobs,
   getAIRecommendedJobs,
     deleteJob,
} = require("../controllers/jobController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, createJob);

router.get("/", getAllJobs);
router.get("/recommended", protect, getRecommendedJobs);
router.get("/ai-recommended", protect, getAIRecommendedJobs);
router.delete("/:id", protect, deleteJob);
module.exports = router;
