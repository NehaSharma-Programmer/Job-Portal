
const Job = require("../models/Job");
const User = require("../models/User");
const {
  getAIRecommendation,
} = require("../services/aiService");
const createJob = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
  return res.status(403).json({
    message: "Only recruiters can create jobs",
  });
}
    const {
      title,
      company,
      description,
      location,
      skills,
      experience,
      salary,
      jobType,
    } = req.body;

    const job = await Job.create({
      title,
      company,
      description,
      location,
      skills,
      experience,
      salary,
      jobType,
      postedBy: req.user.userId,
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Jobs fetched successfully",
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get Jobs Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const jobs = await Job.find();

    const userSkills = user.skills.map((skill) =>
      skill.toLowerCase()
    );

    const recommendedJobs = jobs
      .map((job) => {
        const jobSkills = job.skills.map((skill) =>
          skill.toLowerCase()
        );

        const matchedSkills = jobSkills.filter((skill) =>
          userSkills.includes(skill)
        );

        const matchPercentage =
          jobSkills.length > 0
            ? Math.round(
                (matchedSkills.length / jobSkills.length) * 100
              )
            : 0;

        return {
          job,
          matchPercentage,
          matchedSkills,
        };
      })
      .filter((item) => item.matchPercentage > 0)
      .sort(
        (a, b) => b.matchPercentage - a.matchPercentage
      );

    res.status(200).json({
      message: "Recommended jobs fetched successfully",
      count: recommendedJobs.length,
      recommendations: recommendedJobs,
    });
  } catch (error) {
    console.error("Recommended Jobs Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const getAIRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "candidate") {
      return res.status(403).json({
        message: "Only candidates can get AI recommendations",
      });
    }

    const jobs = await Job.find();

    if (jobs.length === 0) {
      return res.status(404).json({
        message: "No jobs available",
      });
    }

    const aiResult = await getAIRecommendation(user, jobs);

    const recommendations = aiResult.recommendations.map(
      (recommendation) => {
        const job = jobs.find(
          (job) =>
            job._id.toString() === recommendation.jobId
        );

        return {
          job,
          matchPercentage: recommendation.matchPercentage,
          reason: recommendation.reason,
        };
      }
    );

    res.status(200).json({
      message: "AI job recommendations fetched successfully",
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    console.error("AI Recommendation Controller Error:", error);

    res.status(500).json({
      message: "AI recommendation failed",
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getRecommendedJobs,
  getAIRecommendedJobs,
};
