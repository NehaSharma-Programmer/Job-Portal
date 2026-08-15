
import { useEffect, useState } from "react";
import axios from "axios";
import "./RecruiterApplicants.css";

function RecruiterApplicants() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [message, setMessage] = useState("");

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

      const response = await axios.get(
        "http://localhost:5000/api/jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show only jobs posted by logged-in recruiter
     setJobs(response.data.jobs);
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

  // Fetch applicants for selected job
  const fetchApplicants = async (jobId) => {
    try {
      setApplicantsLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5000/api/applications/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplicants(response.data.applications);
    } catch (error) {
      console.error("Fetch Applicants Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to fetch applicants"
      );
    } finally {
      setApplicantsLoading(false);
    }
  };

    const updateApplicationStatus = async (
  applicationId,
  status
) => {
  try {
    const token = localStorage.getItem("token");

    await axios.patch(
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
          <button className="logout-btn">
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
                {applicants.length}
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
                  applicants.filter(
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
                  applicants.filter(
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