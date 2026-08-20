import { useState, useEffect } from "react";
import API, { getFileUrl } from "../api";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
    education: "",
    experience: "",
    preferredRole: "",
    preferredLocation: "",
    expectedSalary: 0,
  });

  const [photoUploading, setPhotoUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/profile");
      const user = res.data.user;
      setProfile(user);
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
        skills: Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || "",
        education: user.education || "",
        experience: user.experience || "",
        preferredRole: user.preferredRole || "",
        preferredLocation: user.preferredLocation || "",
        expectedSalary: user.expectedSalary || 0,
      });
    } catch (err) {
      console.error("Fetch Profile Error:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to load profile",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      const skillsArray = form.skills
        ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        ...form,
        skills: skillsArray,
        expectedSalary: Number(form.expectedSalary),
      };

      const res = await API.put("/api/profile", payload);
      setProfile(res.data.user);
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      console.error("Update Profile Error:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image file size should be less than 5MB" });
      return;
    }

    try {
      setPhotoUploading(true);
      setMessage({ type: "", text: "" });
      const formData = new FormData();
      formData.append("photo", file);

      const res = await API.post("/api/profile/photo", formData);

      setProfile((prev) => ({ ...prev, profilePhoto: res.data.profilePhoto }));
      setMessage({ type: "success", text: "Profile photo uploaded successfully!" });
    } catch (err) {
      console.error("Photo Upload Error:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to upload profile photo",
      });
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: "error", text: "Resume file size should be less than 10MB" });
      return;
    }

    try {
      setResumeUploading(true);
      setMessage({ type: "", text: "" });
      const formData = new FormData();
      formData.append("resume", file);

      const res = await API.post("/api/profile/resume", formData);

      setProfile((prev) => ({ ...prev, resume: res.data.resume }));
      setMessage({ type: "success", text: "Resume uploaded successfully!" });
    } catch (err) {
      console.error("Resume Upload Error:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to upload resume",
      });
    } finally {
      setResumeUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-skeleton">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-line full"></div>
          <div className="skeleton-line half"></div>
        </div>
      </div>
    );
  }

  const avatarUrl = profile?.profilePhoto
    ? getFileUrl(profile.profilePhoto)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        profile?.name || "User"
      )}&background=4f46e5&color=fff&size=150`;

  return (
    <div className="profile-page">
      <div className="profile-container">
        {message.text && (
          <div className={`notification-toast ${message.type}`}>
            {message.type === "success" ? "✓ " : "⚠️ "}
            {message.text}
          </div>
        )}

        {/* Profile Header */}
        <div className="profile-header-card">
          <div className="avatar-wrapper">
            <img src={avatarUrl} alt={profile?.name} className="profile-avatar-img" />
            <label className="upload-photo-badge" title="Upload Photo">
              📷
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                disabled={photoUploading}
                style={{ display: "none" }}
              />
            </label>
            {photoUploading && <span className="upload-spinner">Uploading...</span>}
          </div>

          <div className="header-info">
            <h1>{profile?.name}</h1>
            <p className="user-email">✉️ {profile?.email}</p>
            <span className="user-role-badge">{profile?.role?.toUpperCase()}</span>
          </div>

          {!editing && (
            <button className="edit-btn-primary" onClick={() => setEditing(true)}>
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {/* Profile Content */}
        {!editing ? (
          <div className="profile-grid">
            <div className="profile-card">
              <h3>Basic Information</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="label">Full Name</span>
                  <span className="val">{profile?.name || "Not specified"}</span>
                </div>
                <div className="info-item">
                  <span className="label">Phone</span>
                  <span className="val">{profile?.phone || "Not specified"}</span>
                </div>
                <div className="info-item">
                  <span className="label">Location</span>
                  <span className="val">{profile?.location || "Not specified"}</span>
                </div>
                <div className="info-item">
                  <span className="label">Bio</span>
                  <span className="val">{profile?.bio || "No bio added yet"}</span>
                </div>
              </div>
            </div>

            <div className="profile-card">
              <h3>Professional Information</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="label">Preferred Role</span>
                  <span className="val">{profile?.preferredRole || "Not specified"}</span>
                </div>
                <div className="info-item">
                  <span className="label">Preferred Location</span>
                  <span className="val">{profile?.preferredLocation || "Not specified"}</span>
                </div>
                <div className="info-item">
                  <span className="label">Experience Level</span>
                  <span className="val">{profile?.experience || "Not specified"}</span>
                </div>
                <div className="info-item">
                  <span className="label">Education</span>
                  <span className="val">{profile?.education || "Not specified"}</span>
                </div>
                <div className="info-item">
                  <span className="label">Expected Salary</span>
                  <span className="val">
                    {profile?.expectedSalary ? `₹${profile.expectedSalary}` : "Not specified"}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-card full-width">
              <h3>Skills</h3>
              <div className="skills-tags-container">
                {profile?.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, idx) => (
                    <span key={idx} className="skill-pill">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="empty-text">No skills added yet.</p>
                )}
              </div>
            </div>

            {/* Resume Upload Card */}
            <div className="profile-card full-width">
              <h3>Resume Document</h3>
              <div className="resume-section-body">
                {profile?.resume ? (
                  <div className="resume-info-box">
                    <div className="file-icon">📄</div>
                    <div className="file-meta">
                      <strong>Uploaded Resume</strong>
                      <span>{profile.resume.split("/").pop()}</span>
                    </div>
                    <div className="resume-actions">
                      <a
                        href={getFileUrl(profile.resume)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary"
                      >
                        👁️ View Resume
                      </a>
                      <a
                        href={getFileUrl(profile.resume)}
                        download
                        className="btn-secondary"
                      >
                        ⬇️ Download
                      </a>
                      <label className="btn-outline">
                        🔄 Replace Resume
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          disabled={resumeUploading}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="resume-upload-dropzone">
                    <p>No resume uploaded yet. Upload your PDF or DOC resume to apply faster!</p>
                    <label className="btn-primary">
                      {resumeUploading ? "Uploading..." : "📤 Upload Resume"}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        disabled={resumeUploading}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Edit Profile Form */
          <form onSubmit={handleUpdateProfile} className="edit-profile-form">
            <h2>Edit Profile Information</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, India"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Preferred Role</label>
                <input
                  type="text"
                  placeholder="e.g. Full Stack Developer"
                  value={form.preferredRole}
                  onChange={(e) => setForm({ ...form, preferredRole: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Preferred Location</label>
                <input
                  type="text"
                  placeholder="e.g. Remote / Bangalore"
                  value={form.preferredLocation}
                  onChange={(e) => setForm({ ...form, preferredLocation: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Experience Level</label>
                <input
                  type="text"
                  placeholder="e.g. 2+ years"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Education</label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech in CS"
                  value={form.education}
                  onChange={(e) => setForm({ ...form, education: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Expected Salary (₹)</label>
                <input
                  type="number"
                  placeholder="800000"
                  value={form.expectedSalary}
                  onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })}
                />
              </div>

              <div className="form-group full-width">
                <label>Skills (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="React, Node.js, Express, MongoDB, JavaScript"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                />
              </div>

              <div className="form-group full-width">
                <label>About / Bio</label>
                <textarea
                  rows="4"
                  placeholder="Write a brief professional summary..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? "Saving..." : "💾 Save Changes"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
