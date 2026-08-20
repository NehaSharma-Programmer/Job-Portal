
import { useEffect, useState } from "react";
import axios from "axios";
import "./RecruiterApplicants.css";
import { useNavigate } from "react-router-dom";

function RecruiterApplicants() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [allApplicants, setAllApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [totalJobs, setTotalJobs] = useState(0);
const [totalApplicants, setTotalApplicants] = useState(0);
const [selectedCount, setSelectedCount] = useState(0);
const [shortlistedCount, setShortlistedCount] = useState(0);
const [editingJob, setEditingJob] = useState(null);
const [editForm, setEditForm] = useState({
  title: "",
  company: "",
  description: "",
  location: "",
  skills: "",
  experience: "",
  salary: "",
  jobType: "Full-time",
});
const handleEditJob = (job) => {
  setEditingJob(job);

  setEditForm({
    title: job.title || "",
    company: job.company || "",
    description: job.description || "",
    location: job.location || "",
    skills: job.skills?.join(", ") || "",
    experience: job.experience || "",
    salary: job.salary || "",
    jobType: job.jobType || "Full-time",
  });
};
const updateJob = async (e) => {
  e.preventDefault();

  if (!editingJob) return;

  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `http://localhost:5000/api/jobs/${editingJob._id}`,
      {
        title: editForm.title,
        company: editForm.company,
        description: editForm.description,
        location: editForm.location,
        skills: editForm.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        experience: editForm.experience,
        salary: Number(editForm.salary),
        jobType: editForm.jobType,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMessage("Job updated successfully!");

    setEditingJob(null);

    fetchMyJobs();

  } catch (error) {
    console.error("Update Job Error:", error);

    setMessage(
      error.response?.data?.message ||
        "Unable to update job"
    );
  }
};


  // Fetch applicants for selected job
  const fetchApplicants = async (jobId) => {
    try {
      setApplicantsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await axios.get(
        `http://localhost:5000/api/applications/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplicants(response.data.applications || []);
    } catch (error) {
      console.error("Fetch Applicants Error:", error);
      setMessage(
        error.response?.data?.message || "Unable to fetch applicants"
      );
    } finally {
      setApplicantsLoading(false);
    }
  };

  // Fetch recruiter's jobs
  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      const recruiterId = user?.id || user?._id;

      let recruiterJobs = [];
      try {
        const response = await axios.get(
          "http://localhost:5000/api/jobs/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        recruiterJobs = response.data.jobs || [];
      } catch (err) {
        const response = await axios.get(
          "http://localhost:5000/api/jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        recruiterJobs = (response.data.jobs || []).filter(
          (job) =>
            (job.postedBy?._id || job.postedBy)?.toString() ===
            recruiterId?.toString()
        );
      }

      setJobs(recruiterJobs);
      setTotalJobs(recruiterJobs.length);

      if (recruiterJobs.length > 0) {
        const appsPromises = recruiterJobs.map((job) =>
          axios
            .get(
              `http://localhost:5000/api/applications/job/${job._id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            .then((res) => res.data.applications || [])
            .catch(() => [])
        );
        const appsResults = await Promise.all(appsPromises);
        setAllApplicants(appsResults.flat());
      } else {
        setAllApplicants([]);
      }
    } catch (error) {
      console.error("Fetch Jobs Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to fetch jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (
    applicationId,
    status
  ) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        `Application ${status.toLowerCase()} successfully`
      );

      setApplicants((prevApplicants) =>
        prevApplicants.map((application) =>
          application._id === applicationId
            ? { ...application, status }
            : application
        )
      );

      setAllApplicants((prevAll) =>
        prevAll.map((application) =>
          application._id === applicationId
            ? { ...application, status }
            : application
        )
      );

      if (selectedJob) {
        fetchApplicants(selectedJob._id);
      }
    } catch (error) {
      console.error(
        "Update Application Status Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to update application status"
      );
    }
  };




// Delete job
const deleteJob = async (jobId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this job?"
  );

  if (!confirmed) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/api/jobs/${jobId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMessage("Job deleted successfully!");
    setSelectedJob(null);

    fetchMyJobs();
  } catch (error) {
    console.error("Delete Job Error:", error);

    setMessage(
      error.response?.data?.message ||
        "Unable to delete job"
    );
  }
};



  // Select job
  const handleJobClick = (job) => {
    setSelectedJob(job);
    fetchApplicants(job._id);
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  return (
    <div className="recruiter-page">

      {/* Sidebar */}
      <aside className="recruiter-sidebar">

        <div className="brand">
          <div className="brand-icon">J</div>

          <div>
            <h2>JobLane</h2>
            <span>Recruiter Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            <span>📊</span>
            Dashboard
          </button>

          <button className="nav-item">
            <span>💼</span>
            My Jobs
          </button>

          <button className="nav-item">
            <span>👥</span>
            Applicants
          </button>

          <button className="nav-item">
            <span>⚙️</span>
            Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
         <button
  className="logout-btn"
  onClick={() => {
    localStorage.removeItem("token");
      localStorage.removeItem("user");
    window.location.href = "/login";
  }}
>
  🚪 Logout
</button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="recruiter-main">

        {/* Header */}
        <header className="dashboard-header">

          <div>
            <p className="eyebrow">
              RECRUITER DASHBOARD
            </p>

            <h1>
              Welcome back 👋
            </h1>

            <p className="header-subtitle">
              Manage your job postings and discover
              talented candidates.
            </p>
          </div>
          <button
  className="post-job-btn"
  onClick={() => navigate("/recruiter/create-job")}
>
  + Post New Job
</button>

          <div className="profile-circle">
            R
          </div>

        </header>

        {/* Message */}
        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

        {/* Statistics */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon purple">
              💼
            </div>

            <div>
              <span>Total Jobs</span>
              <strong>{jobs.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              👥
            </div>

            <div>
              <span>Applicants</span>
              <strong>
                {allApplicants.length}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              ✓
            </div>

            <div>
              <span>Selected</span>
              <strong>
                {
                  allApplicants.filter(
                    (app) =>
                      app.status === "Selected"
                  ).length
                }
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              ⭐
            </div>

            <div>
              <span>Shortlisted</span>
              <strong>
                {
                  allApplicants.filter(
                    (app) =>
                      app.status === "Shortlisted"
                  ).length
                }
              </strong>
            </div>
          </div>

        </section>

        {/* Jobs + Applicants */}
        <section className="dashboard-content">

          {/* Jobs */}
          <div className="jobs-section">

            <div className="section-heading">
              <div>
                <h2>My Job Postings</h2>
                <p>
                  Select a job to view applicants
                </p>
              </div>

              <span className="job-count">
                {jobs.length} Jobs
              </span>
            </div>

            {loading && (
              <div className="loading-state">
                <div className="loader"></div>
                <p>Loading jobs...</p>
              </div>
            )}

            {!loading && jobs.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">
                  💼
                </div>

                <h3>No jobs found</h3>

                <p>
                  You haven't posted any jobs yet.
                </p>
              </div>
            )}

            <div className="job-list">

              {jobs.map((job) => (
                <button
                  className={`job-card ${
                    selectedJob?._id === job._id
                      ? "selected"
                      : ""
                  }`}
                  key={job._id}
                  onClick={() =>
                    handleJobClick(job)
                  }
                >

                  <div className="job-card-top">

                    <div className="company-logo">
                      {job.company
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div className="job-info">
                      <h3>{job.title}</h3>

                      <p>
                        {job.company}
                      </p>
                    </div>

                    <span className="arrow">
                      →
                    </span>
                  <span
  className="edit-job-btn"
  onClick={(e) => {
    e.stopPropagation();
    handleEditJob(job);
  }}
>
  ✏️ Edit
</span>  
                    <span
  className="delete-job-btn"
  onClick={(e) => {
    e.stopPropagation();
    deleteJob(job._id);
  }}
>
  🗑️ Delete
</span>

                  </div>

                  <div className="job-meta">

                    <span>
                      📍 {job.location}
                    </span>

                    <span>
                      💼 {job.jobType}
                    </span>

                  </div>

                  <div className="skills">

                    {job.skills
                      ?.slice(0, 4)
                      .map((skill) => (
                        <span
                          key={skill}
                        >
                          {skill}
                        </span>
                      ))}

                  </div>

                </button>
              ))}

            </div>

          </div>
{editingJob && (
  <div className="edit-job-form">

    <h2>✏️ Edit Job</h2>

    <form onSubmit={updateJob}>

      <input
        type="text"
        placeholder="Job Title"
        value={editForm.title}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            title: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Company"
        value={editForm.company}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            company: e.target.value,
          })
        }
      />

      <textarea
        placeholder="Job Description"
        value={editForm.description}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            description: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Location"
        value={editForm.location}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            location: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Skills: React, JavaScript, Node.js"
        value={editForm.skills}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            skills: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Experience"
        value={editForm.experience}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            experience: e.target.value,
          })
        }
      />

      <input
        type="number"
        placeholder="Salary"
        value={editForm.salary}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            salary: e.target.value,
          })
        }
      />

      <select
        value={editForm.jobType}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            jobType: e.target.value,
          })
        }
      >
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Internship">Internship</option>
        <option value="Remote">Remote</option>
      </select>

      <button type="submit">
        💾 Save Changes
      </button>

      <button
        type="button"
        onClick={() => setEditingJob(null)}
      >
        Cancel
      </button>

    </form>
  </div>
)}

{/* Applicants */}
          <div className="applicants-section">

            {!selectedJob ? (
              <div className="select-job-state">

                <div className="select-icon">
                  👥
                </div>

                <h2>
                  Select a job
                </h2>

                <p>
                  Choose one of your job postings
                  to see the applicants.
                </p>

              </div>
            ) : (
              <>
                <div className="section-heading">

                  <div>
                    <p className="eyebrow">
                      APPLICANTS
                    </p>

                    <h2>
                      {selectedJob.title}
                    </h2>

                    <p>
                      {selectedJob.company}
                    </p>
                  </div>

                  <span className="applicant-count">
                    {applicants.length}
                  </span>

                </div>

                {applicantsLoading && (
                  <div className="loading-state">
                    <div className="loader"></div>
                    <p>
                      Loading applicants...
                    </p>
                  </div>
                )}

                {!applicantsLoading &&
                  
                  applicants.length === 0 && (
                    <div className="empty-state">
                      <div className="empty-icon">
                        👤
                      </div>

                      <h3>
                        No applicants yet
                      </h3>

                      <p>
                        Applications for this
                        position will appear here.
                      </p>
                    </div>
                  )}

                <div className="applicant-list">

                  {!applicantsLoading &&
                    applicants.map(
                      (application) => (
                        <div
                          className="applicant-card"
                          key={application._id}
                        >

                          <div className="applicant-header">

                            <div className="avatar">
                              {application.candidate?.name
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </div>

                            <div>
                              <h3>
                                {
                                  application
                                    .candidate
                                    ?.name
                                }
                              </h3>

                              <p>
                                {
                                  application
                                    .candidate
                                    ?.email
                                }
                              </p>
                            </div>

                          </div>

                          <div className="candidate-details">

                            <span>
                              📞{" "}
                              {
                                application
                                  .candidate
                                  ?.phone
                              }
                            </span>

                            <span>
                              🎓{" "}
                              {
                                application
                                  .candidate
                                  ?.education
                              }
                            </span>

                          </div>

                          <div className="candidate-skills">

                            {application.candidate?.skills?.map(
                              (skill) => (
                                <span
                                  key={skill}
                                >
                                  {skill}
                                </span>
                              )
                            )}

                          </div>

                      {application.coverLetter && (
  <div className="cover-letter-box">
    <div className="cover-letter-title">
      Cover Letter
    </div>

    <p>{application.coverLetter}</p>
  </div>
)}





                     <div className="application-footer">

  <span
    className={`status ${application.status
      ?.toLowerCase()
      .replace(" ", "-")}`}
  >
    {application.status}
  </span>

  <span className="applied-date">
    Applied recently
  </span>

</div>

<div className="application-actions">

  <button
    className="shortlist-btn"
    onClick={() =>
      updateApplicationStatus(
        application._id,
        "Shortlisted"
      )
    }
  >
    Shortlist
  </button>

  <button
    className="select-btn"
    onClick={() =>
      updateApplicationStatus(
        application._id,
        "Selected"
      )
    }
  >
    Select
  </button>

  <button
    className="reject-btn"
    onClick={() =>
      updateApplicationStatus(
        application._id,
        "Rejected"
      )
    }
  >
    Reject
  </button>

</div>
                          

                        </div>
                      )
                    )}

                </div>
              </>
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default RecruiterApplicants;