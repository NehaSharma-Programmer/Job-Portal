
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["candidate", "recruiter"],
      default: "candidate",
    },

    phone: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    education: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    preferredRole: {
      type: String,
      default: "",
    },

    expectedSalary: {
      type: Number,
      default: 0,
    },

    resume: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;