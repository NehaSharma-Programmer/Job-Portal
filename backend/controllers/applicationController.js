const Application = require("../models/Application");
const Job = require("../models/Job");

const applyJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user.userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user.userId,
      coverLetter: coverLetter || "",
    });

    res.status(201).json({
      message: "Job application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Apply Job Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user.userId,
    })
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Applications fetched successfully",
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get Applications Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not authorized to view these applicants",
      });
    }

    const applications = await Application.find({
      job: jobId,
    })
      .populate("candidate", "name email phone skills education experience")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Applicants fetched successfully",
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get Applicants Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = {
  applyJob,
  getMyApplications,
  getJobApplicants,
};
