import { useEffect, useState } from "react";
import API, { getFileUrl } from "../api";
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
      skills: Array.isArray(job.skills) ? job.skills.join(", ") : job.skills || "",
      experience: job.experience || "",
      salary: job.salary || "",
      jobType: job.jobType || "Full-time",
    });
  };

  const updateJob = async (e) => {
    e.preventDefault();
    if (!editingJob) return;

    try {
      await API.put(`/api/jobs/${editingJob._id}`, {
        title: editForm.title,
        company: editForm.company,
        description: editForm.description,
        location: editForm.location,
        skills: editForm.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        experience: editForm.experience,
        salary: Number(editForm.salary),
        jobType: editForm.jobType,
      });

      setMessage("Job updated successfully!");
      setEditingJob(null);
      fetchMyJobs();
    } catch (error) {
      console.error("Update Job Error:", error);
      setMessage(error.response?.data?.message || "Unable to update job");
    }
  };

  const fetchApplicants = async (jobId) => {
    try {
      setApplicantsLoading(true);
      const res = await API.get(`/api/applications/job/${jobId}`);
      setApplicants(res.data.applications || []);
    } catch (error) {
      console.error("Fetch Applicants Error:", error);
      setMessage(error.response?.data?.message || "Unable to fetch applicants");
    } finally {
      setApplicantsLoading(false);
    }
  };

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setMessage("");

      let recruiterJobs = [];
      try {
        const res = await API.get("/api/jobs/my");
        recruiterJobs = res.data.jobs || [];
      } catch (err) {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const recruiterId = user?.id || user?._id;
        const res = await API.get("/api/jobs");
        recruiterJobs = (res.data.jobs || []).filter(
          (job) => (job.postedBy?._id || job.postedBy)?.toString() === recruiterId?.toString()
        );
      }

      setJobs(recruiterJobs);
      setTotalJobs(recruiterJobs.length);

      if (recruiterJobs.length > 0) {
        const appsPromises = recruiterJobs.map((job) =>
          API.get(`/api/applications/job/${job._id}`)
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
      setMessage(error.response?.data?.message || "Unable to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await API.put(`/api/applications/${applicationId}/status`, { status });
      setMessage(`Application ${status.toLowerCase()} successfully`);

      setApplicants((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status } : app))
      );
      setAllApplicants((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status } : app))
      );

      if (selectedJob) {
        fetchApplicants(selectedJob._id);
      }
    } catch (error) {
      console.error("Update Application Status Error:", error);
      setMessage(error.response?.data?.message || "Unable to update status");
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;

    try {
      await API.delete(`/api/jobs/${jobId}`);
      setMessage("Job deleted successfully!");
      setSelectedJob(null);
      fetchMyJobs();
    } catch (error) {
      console.error("Delete Job Error:", error);
      setMessage(error.response?.data?.message || "Unable to delete job");
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    fetchApplicants(job._id);
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  return (
    <div className="recruiter-page">
      <main className="recruiter-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">RECRUITER DASHBOARD</p>
            <h1>Manage Postings & Applicants 👋</h1>
          </div>
          <button className="post-job-btn" onClick={() => navigate("/recruiter/create-job")}>
            + Post New Job
          </button>
        </header>

        {message && <div className="message-box">{message}</div>}

        {/* Statistics Bar */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">💼</div>
            <div>
              <span>Total Jobs</span>
              <strong>{totalJobs}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">👥</div>
            <div>
              <span>Total Applicants</span>
              <strong>{allApplicants.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <div>
              <span>Selected</span>
              <strong>{allApplicants.filter((a) => a.status === "Selected").length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">⭐</div>
            <div>
              <span>Shortlisted</span>
              <strong>{allApplicants.filter((a) => a.status === "Shortlisted").length}</strong>
            </div>
          </div>
        </section>

        {/* Content Layout */}
        <section className="dashboard-content">
          {/* Jobs Sidebar */}
          <div className="jobs-section">
            <div className="section-heading">
              <div>
                <h2>My Job Postings</h2>
                <p>Click a job to view candidate applicants</p>
              </div>
              <span className="job-count">{jobs.length} Jobs</span>
            </div>

            {loading && (
              <div className="loading-state">
                <div className="loader"></div>
                <p>Loading jobs...</p>
              </div>
            )}

            {!loading && jobs.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">💼</div>
                <h3>No jobs posted yet</h3>
                <p>Post a new job opening to start receiving candidates!</p>
              </div>
            )}

            <div className="job-list">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className={`job-card ${selectedJob?._id === job._id ? "selected" : ""}`}
                  onClick={() => handleJobClick(job)}
                >
                  <div className="job-card-top">
                    <div className="company-logo">
                      {job.company?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="job-info">
                      <h3>{job.title}</h3>
                      <p>{job.company}</p>
                    </div>

                    <div className="job-card-actions">
                      <button
                        className="edit-job-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditJob(job);
                        }}
                        title="Edit Job"
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-job-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteJob(job._id);
                        }}
                        title="Delete Job"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="job-meta">
                    <span>📍 {job.location}</span>
                    <span>💼 {job.jobType}</span>
                    <span>₹{job.salary?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Job Form */}
          {editingJob && (
            <div className="edit-job-modal">
              <div className="edit-form-card">
                <h2>✏️ Edit Job Posting</h2>
                <form onSubmit={updateJob}>
                  <div className="edit-grid">
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={editForm.company}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      required
                    />
                    <select
                      value={editForm.jobType}
                      onChange={(e) => setEditForm({ ...editForm, jobType: e.target.value })}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Experience"
                      value={editForm.experience}
                      onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Salary"
                      value={editForm.salary}
                      onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Skills (comma-separated)"
                    value={editForm.skills}
                    onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  />

                  <textarea
                    placeholder="Job Description"
                    rows="4"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />

                  <div className="form-buttons">
                    <button type="submit" className="save-btn">
                      💾 Save Changes
                    </button>
                    <button type="button" onClick={() => setEditingJob(null)} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Applicants Panel */}
          <div className="applicants-section">
            {!selectedJob ? (
              <div className="select-job-state">
                <div className="select-icon">👥</div>
                <h2>Select a job posting</h2>
                <p>Choose one of your job postings on the left to see candidate applicants.</p>
              </div>
            ) : (
              <>
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">APPLICANTS FOR</p>
                    <h2>{selectedJob.title}</h2>
                  </div>
                  <span className="applicant-count">{applicants.length} Applicants</span>
                </div>

                {applicantsLoading && (
                  <div className="loading-state">
                    <div className="loader"></div>
                    <p>Loading applicants...</p>
                  </div>
                )}

                {!applicantsLoading && applicants.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">👤</div>
                    <h3>No applicants yet</h3>
                    <p>Applications for this job position will appear here.</p>
                  </div>
                )}

                <div className="applicant-list">
                  {!applicantsLoading &&
                    applicants.map((application) => {
                      const candidate = application.candidate;
                      const avatarSrc = candidate?.profilePhoto
                        ? getFileUrl(candidate.profilePhoto)
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            candidate?.name || "Applicant"
                          )}&background=6366f1&color=fff`;

                      return (
                        <div className="applicant-card" key={application._id}>
                          <div className="applicant-header">
                            <img src={avatarSrc} alt={candidate?.name} className="applicant-avatar-img" />
                            <div className="applicant-meta">
                              <h3>{candidate?.name || "Candidate"}</h3>
                              <p>✉️ {candidate?.email}</p>
                              {candidate?.phone && <p>📞 {candidate.phone}</p>}
                            </div>
                            <span className={`status-pill ${application.status?.toLowerCase()}`}>
                              {application.status}
                            </span>
                          </div>

                          <div className="candidate-details-grid">
                            <div>
                              <strong>🎓 Education:</strong> {candidate?.education || "Not specified"}
                            </div>
                            <div>
                              <strong>💼 Experience:</strong> {candidate?.experience || "Not specified"}
                            </div>
                          </div>

                          {candidate?.skills && candidate.skills.length > 0 && (
                            <div className="candidate-skills-wrap">
                              {candidate.skills.map((skill, idx) => (
                                <span key={idx} className="skill-pill">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          {application.coverLetter && (
                            <div className="cover-letter-box">
                              <strong>Cover Letter:</strong>
                              <p>{application.coverLetter}</p>
                            </div>
                          )}

                          {candidate?.resume && (
                            <div className="resume-link-row">
                              <span>📄 Candidate Resume Attached</span>
                              <a
                                href={getFileUrl(candidate.resume)}
                                target="_blank"
                                rel="noreferrer"
                                className="view-resume-btn"
                              >
                                👁️ View Resume
                              </a>
                            </div>
                          )}

                          <div className="application-actions">
                            <button
                              className="shortlist-btn"
                              onClick={() => updateApplicationStatus(application._id, "Shortlisted")}
                            >
                              ⭐ Shortlist
                            </button>
                            <button
                              className="select-btn"
                              onClick={() => updateApplicationStatus(application._id, "Selected")}
                            >
                              ✓ Select
                            </button>
                            <button
                              className="reject-btn"
                              onClick={() => updateApplicationStatus(application._id, "Rejected")}
                            >
                              ✕ Reject
                            </button>
                          </div>
                        </div>
                      );
                    })}
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
