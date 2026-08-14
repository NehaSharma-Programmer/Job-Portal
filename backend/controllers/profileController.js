
const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      location,
      bio,
      skills,
      education,
      experience,
      preferredRole,
      expectedSalary,
      resume,
    } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;
    if (education !== undefined) user.education = education;
    if (experience !== undefined) user.experience = experience;
    if (preferredRole !== undefined) {
      user.preferredRole = preferredRole;
    }
    if (expectedSalary !== undefined) {
      user.expectedSalary = expectedSalary;
    }
    if (resume !== undefined) user.resume = resume;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        location: updatedUser.location,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        education: updatedUser.education,
        experience: updatedUser.experience,
        preferredRole: updatedUser.preferredRole,
        expectedSalary: updatedUser.expectedSalary,
        resume: updatedUser.resume,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};