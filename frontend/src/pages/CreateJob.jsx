import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function CreateJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    skills: "",
    experience: "",
    salary: "",
    jobType: "Full-time",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await API.post("/api/jobs", {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        location: formData.location,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        experience: formData.experience,
        salary: Number(formData.salary),
        jobType: formData.jobType,
      });

      console.log("Job Created:", response.data);
      setMessage("Job posted successfully!");

      setFormData({
        title: "",
        company: "",
        description: "",
        location: "",
        skills: "",
        experience: "",
        salary: "",
        jobType: "Full-time",
      });

      setTimeout(() => {
        navigate("/recruiter");
      }, 1200);
    } catch (error) {
      console.error("Create Job Error:", error);
      setMessage(
        error.response?.data?.message || "Unable to create job posting"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "40px 24px",
        maxWidth: "750px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          padding: "36px",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "700",
            color: "var(--text-main)",
            marginBottom: "6px",
          }}
        >
          💼 Post a New Job
        </h1>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "14px",
            marginBottom: "24px",
          }}
        >
          Create a new career opportunity for top candidates
        </p>

        {message && (
          <div
            style={{
              padding: "12px 18px",
              marginBottom: "24px",
              borderRadius: "var(--radius-md)",
              fontSize: "14px",
              fontWeight: "500",
              background: message.includes("successfully")
                ? "var(--success-light)"
                : "var(--danger-light)",
              color: message.includes("successfully")
                ? "var(--success)"
                : "var(--danger)",
              border: `1px solid ${
                message.includes("successfully")
                  ? "var(--success)"
                  : "var(--danger)"
              }`,
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-muted)",
                  marginBottom: "6px",
                }}
              >
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior React Developer"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "var(--bg-input)",
                  color: "var(--text-main)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-muted)",
                  marginBottom: "6px",
                }}
              >
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Acme Tech"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "var(--bg-input)",
                  color: "var(--text-main)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-muted)",
                  marginBottom: "6px",
                }}
              >
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bangalore / Remote"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "var(--bg-input)",
                  color: "var(--text-main)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-muted)",
                  marginBottom: "6px",
                }}
              >
                Job Type
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "var(--bg-input)",
                  color: "var(--text-main)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  outline: "none",
                }}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-muted)",
                  marginBottom: "6px",
                }}
              >
                Experience Required *
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 2-4 years / Fresher"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "var(--bg-input)",
                  color: "var(--text-main)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--text-muted)",
                  marginBottom: "6px",
                }}
              >
                Salary (₹ per annum) *
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. 1200000"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "var(--bg-input)",
                  color: "var(--text-main)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--text-muted)",
                marginBottom: "6px",
              }}
            >
              Required Skills (Comma-separated) *
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, TypeScript, Node.js, Express"
              required
              style={{
                width: "100%",
                padding: "12px",
                background: "var(--bg-input)",
                color: "var(--text-main)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--text-muted)",
                marginBottom: "6px",
              }}
            >
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the job responsibilities, qualifications, and role expectations..."
              rows="6"
              required
              style={{
                width: "100%",
                padding: "12px",
                background: "var(--bg-input)",
                color: "var(--text-main)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                outline: "none",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "var(--primary)",
                color: "#ffffff",
                border: "none",
                padding: "12px 24px",
                borderRadius: "var(--radius-md)",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {loading ? "Posting Job..." : "➕ Post Job"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/recruiter")}
              style={{
                background: "var(--bg-card-hover)",
                color: "var(--text-main)",
                border: "1px solid var(--border-color)",
                padding: "12px 24px",
                borderRadius: "var(--radius-md)",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJob;
