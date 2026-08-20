import API_BASE_URL from "../api";


import { useEffect, useState } from "react";
import axios from "axios";

function CandidateDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "${API_BASE_URL}/api/jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Fetch Jobs Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      setApplicationsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "${API_BASE_URL}/api/applications/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(response.data.applications || []);
    } catch (error) {
      console.error("Fetch My Applications Error:", error);
    } finally {
      setApplicationsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
  }, []);

  const handleViewApply = (job) => {
    setSelectedJob(job);
    setCoverLetter("");
  };

  const handleCancel = () => {
    setSelectedJob(null);
    setCoverLetter("");
  };
  const handleApply = async () => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    console.log("===== APPLY DEBUG =====");
    console.log("User:", user);
    console.log("Candidate ID:", user?.id);
    console.log("Selected Job:", selectedJob);
    console.log("Job ID:", selectedJob?._id);
    console.log("Cover Letter:", coverLetter);

    if (!token) {
      alert("Please login first");
      return;
    }

    const response = await axios.post(
      "${API_BASE_URL}/api/applications",
      {
        jobId: selectedJob._id,
        coverLetter: coverLetter,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("APPLICATION RESPONSE:", response.data);

    alert(
      response.data.message ||
        "Job application submitted successfully"
    );

    setSelectedJob(null);
    setCoverLetter("");
    fetchMyApplications();
  } catch (error) {
    console.error("Apply Job Error:", error);

    console.error(
      "Backend Response:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
        "Unable to apply for this job"
    );
  }
};
  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h1>Candidate Dashboard</h1>

      <p>
        Find your next job opportunity 🚀
      </p>

      <hr />

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        <div>

          {/* JOB LIST */}
          {jobs.map((job) => (
            <div
              key={job._id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "10px",
                background: "#fff",
              }}
            >
              <h2>{job.title}</h2>

              <p>
                <strong>Company:</strong>{" "}
                {job.company}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {job.location}
              </p>

              <p>
                <strong>Job Type:</strong>{" "}
                {job.jobType}
              </p>

              <p>
                <strong>Experience:</strong>{" "}
                {job.experience}
              </p>

              <p>
                <strong>Salary:</strong>{" "}
                ₹{job.salary}
              </p>

              <p>
                {job.description}
              </p>

              <p>
                <strong>Skills:</strong>{" "}
                {job.skills?.join(", ")}
              </p>

              <button
                onClick={() => handleViewApply(job)}
                style={{
                  padding: "10px 18px",
                  cursor: "pointer",
                }}
              >
                View & Apply
              </button>
            </div>
          ))}

          {/* SELECTED JOB / APPLY SECTION */}
          {selectedJob && (
            <div
              style={{
                marginTop: "30px",
                padding: "25px",
                border: "2px solid #333",
                borderRadius: "10px",
                background: "#f9f9f9",
              }}
            >
              <h2>
                Apply for {selectedJob.title}
              </h2>

              <p>
                <strong>Company:</strong>{" "}
                {selectedJob.company}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {selectedJob.location}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {selectedJob.description}
              </p>

              <p>
                <strong>Skills:</strong>{" "}
                {selectedJob.skills?.join(", ")}
              </p>

              <h3>
                Cover Letter
              </h3>

              <textarea
                value={coverLetter}
                onChange={(e) =>
                  setCoverLetter(e.target.value)
                }
                placeholder="Write your cover letter..."
                rows="6"
                style={{
                  width: "100%",
                  padding: "12px",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />

              <div
                style={{
                  marginTop: "15px",
                }}
              >
                <button
  onClick={handleApply}
  style={{
    padding: "10px 20px",
    marginRight: "10px",
    cursor: "pointer",
  }}
>
  Apply Now
</button>

                <button
                  onClick={handleCancel}
                  style={{
                    padding: "10px 20px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      <hr style={{ margin: "40px 0" }} />

      <h2>📋 My Applications</h2>

      {applicationsLoading && <p>Loading applications...</p>}

      {!applicationsLoading && applications.length === 0 && (
        <p>You have not applied for any jobs yet.</p>
      )}

      {!applicationsLoading &&
        applications.map((application) => (
          <div
            key={application._id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              margin: "20px 0",
              borderRadius: "10px",
              background: "#fff",
            }}
          >
            <h2>{application.job?.title}</h2>

            <p>
              <strong>Company:</strong> {application.job?.company}
            </p>

            <p>
              <strong>Location:</strong> {application.job?.location}
            </p>

            <p>
              <strong>Status:</strong> {application.status}
            </p>

            <p>
              <strong>Cover Letter:</strong> {application.coverLetter}
            </p>
          </div>
        ))}
    </div>
  );
}

export default CandidateDashboard;

