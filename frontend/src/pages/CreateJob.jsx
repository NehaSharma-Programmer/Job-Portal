
import { useState } from "react";
import axios from "axios";

function CreateJob() {
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

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/jobs",
        {
          title: formData.title,
          company: formData.company,
          description: formData.description,
          location: formData.location,

          skills: formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== ""),

          experience: formData.experience,
          salary: Number(formData.salary),
          jobType: formData.jobType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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
    } catch (error) {
      console.error("Create Job Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to create job"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "700px" }}>
      <h1>💼 Post a New Job</h1>

      <p>Create a new job opening for candidates.</p>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>

        <div>
          <label>Job Title</label>
          <br />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. React Developer"
            required
          />
        </div>

        <br />

        <div>
          <label>Company</label>
          <br />
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. ABC Technologies"
            required
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write job description..."
            rows="5"
            required
          />
        </div>

        <br />

        <div>
          <label>Location</label>
          <br />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Noida"
            required
          />
        </div>

        <br />

        <div>
          <label>Skills</label>
          <br />
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="React, JavaScript, Node.js"
            required
          />
          <small>
            Separate skills with commas
          </small>
        </div>

        <br />

        <div>
          <label>Experience</label>
          <br />
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="e.g. Fresher"
            required
          />
        </div>

        <br />

        <div>
          <label>Salary</label>
          <br />
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g. 600000"
            required
          />
        </div>

        <br />

        <div>
          <label>Job Type</label>
          <br />

          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
          >
            <option value="Full-time">
              Full-time
            </option>

            <option value="Part-time">
              Part-time
            </option>

            <option value="Internship">
              Internship
            </option>

            <option value="Contract">
              Contract
            </option>
          </select>
        </div>

        <br />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Posting Job..."
            : "Post Job"}
        </button>

      </form>
    </div>
  );
}

export default CreateJob;