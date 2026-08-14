
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: String,
      default: "Fresher",
    },

    salary: {
      type: Number,
      default: 0,
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Remote"],
      default: "Full-time",
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);