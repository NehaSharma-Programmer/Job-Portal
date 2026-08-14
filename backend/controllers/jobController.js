
const Job = require("../models/Job");

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

module.exports = {
  createJob,
  getAllJobs,
};