import { useEffect, useState } from "react";
import API, { getFileUrl } from "../api";
import "./CandidateDashBoard.css";

function CandidateDashboard() {
  const [jobs, setJobs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);

  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingApps, setLoadingApps] = useState(false);
  const [aiError, setAiError] = useState("");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");

  // Modals & Application
  const [viewingJob, setViewingJob] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [submittingApp, setSubmittingApp] = useState(false);
  const [notification, setNotification] = useState({ type: "", text: "" });

  const fetchProfile = async () => {
    try {
      const res = await API.get("/api/profile");
      setProfile(res.data.user);
    } catch (err) {
      console.error("Fetch Profile Error:", err);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const res = await API.get("/api/jobs");
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error("Fetch Jobs Error:", err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchAIRecommendations = async () => {
    try {
      setLoadingAi(true);
      setAiError("");
      const res = await API.get("/api/jobs/ai-recommended");
      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      console.error("AI Recommendation Error:", err);
      setAiError(
        err.response?.data?.message || "AI recommendation service is currently offline"
      );
    } finally {
      setLoadingAi(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      setLoadingApps(true);
      const res = await API.get("/api/applications/my");
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error("Fetch Applications Error:", err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchJobs();
    fetchAIRecommendations();
    fetchMyApplications();
  }, []);

  const isApplied = (jobId) => {
    return applications.some(
      (app) => (app.job?._id || app.job) === jobId
    );
  };

  const handleApplyClick = (job) => {
    setViewingJob(null);
    setApplyingJob(job);
    setCoverLetter(
      profile?.bio ? `I am deeply interested in the ${job.title} position. ${profile.bio}` : ""
    );
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!applyingJob) return;

    try {
      setSubmittingApp(true);
      setNotification({ type: "", text: "" });

      const res = await API.post("/api/applications", {
        jobId: applyingJob._id,
        coverLetter: coverLetter,
      });

      setNotification({
        type: "success",
        text: res.data.message || "Application submitted successfully!",
      });

      setApplyingJob(null);
      setCoverLetter("");
      fetchMyApplications();
    } catch (err) {
      console.error("Apply Error:", err);
      setNotification({
        type: "error",
        text: err.response?.data?.message || "Unable to submit application",
      });
    } finally {
      setSubmittingApp(false);
    }
  };

  // Search & Filter Logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchQuery ||
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLocation =
      !locationFilter ||
      job.location?.toLowerCase().includes(locationFilter.toLowerCase());

    const matchesJobType = !jobTypeFilter || job.jobType === jobTypeFilter;

    const matchesExp =
      !experienceFilter ||
      job.experience?.toLowerCase().includes(experienceFilter.toLowerCase());

    return matchesSearch && matchesLocation && matchesJobType && matchesExp;
  });

  return (
    <div className="candidate-page">
      <div className="candidate-container">
        {notification.text && (
          <div className={`notification-toast ${notification.type}`}>
            {notification.type === "success" ? "✓ " : "⚠️ "}
            {notification.text}
          </div>
        )}

        {/* Hero Banner */}
        <section className="dashboard-hero">
          <div className="hero-content">
            <h1>Find Your Dream Career 🚀</h1>
            <p>Explore AI recommendations and top opportunities matching your skillset.</p>
          </div>
        </section>

        {/* AI Recommendations Section */}
        <section className="dashboard-section" id="ai">
          <div className="section-title-wrap">
            <h2>🤖 AI Recommended Jobs</h2>
            <span className="badge-ai">Smart Match</span>
          </div>

          {loadingAi && <p className="loading-state">Generating AI recommendations...</p>}

          {!loadingAi && aiError && (
            <div className="ai-fallback-box">
              <p>💡 {aiError}. Explore standard job listings below!</p>
            </div>
          )}

          {!loadingAi && !aiError && recommendations.length === 0 && (
            <p className="empty-state-text">No high match recommendations found right now.</p>
          )}

          <div className="jobs-grid">
            {!loadingAi &&
              recommendations.map((item) => (
                <div key={item.job._id} className="job-card ai-card">
                  <div className="card-top">
                    <div>
                      <h3>{item.job.title}</h3>
                      <p className="company-name">{item.job.company}</p>
                    </div>
                    <span className="match-badge">⚡ {item.matchPercentage}% Match</span>
                  </div>

                  <p className="ai-reason">💡 {item.reason}</p>

                  <div className="meta-pills">
                    <span>📍 {item.job.location}</span>
                    <span>💼 {item.job.jobType}</span>
                    <span>₹{item.job.salary?.toLocaleString()}</span>
                  </div>

                  <div className="skills-wrap">
                    {item.job.skills?.slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="skill-chip">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn-outline"
                      onClick={() => setViewingJob(item.job)}
                    >
                      View Details
                    </button>

                    {isApplied(item.job._id) ? (
                      <span className="badge-applied">✓ Already Applied</span>
                    ) : (
                      <button
                        className="btn-primary"
                        onClick={() => handleApplyClick(item.job)}
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* All Jobs Search & List */}
        <section className="dashboard-section">
          <h2>💼 Explore All Openings</h2>

          {/* Search & Filters Controls */}
          <div className="filter-bar">
            <div className="search-input-wrap">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search title, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <input
              type="text"
              placeholder="Location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="filter-input"
            />

            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>

            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Experience</option>
              <option value="Fresher">Fresher</option>
              <option value="1">1+ Years</option>
              <option value="2">2+ Years</option>
              <option value="5">5+ Years</option>
            </select>
          </div>

          {loadingJobs && <p className="loading-state">Loading job openings...</p>}

          {!loadingJobs && filteredJobs.length === 0 && (
            <div className="empty-box">
              <p>No jobs found matching your criteria.</p>
            </div>
          )}

          <div className="jobs-grid">
            {!loadingJobs &&
              filteredJobs.map((job) => (
                <div key={job._id} className="job-card">
                  <div className="card-top">
                    <div>
                      <h3>{job.title}</h3>
                      <p className="company-name">{job.company}</p>
                    </div>
                    <span className="job-type-pill">{job.jobType}</span>
                  </div>

                  <p className="job-snippet">{job.description?.slice(0, 120)}...</p>

                  <div className="meta-pills">
                    <span>📍 {job.location}</span>
                    <span>🎓 {job.experience}</span>
                    <span>₹{job.salary?.toLocaleString()}</span>
                  </div>

                  <div className="skills-wrap">
                    {job.skills?.slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="skill-chip">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn-outline"
                      onClick={() => setViewingJob(job)}
                    >
                      View Details
                    </button>

                    {isApplied(job._id) ? (
                      <span className="badge-applied">✓ Already Applied</span>
                    ) : (
                      <button
                        className="btn-primary"
                        onClick={() => handleApplyClick(job)}
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* My Applications Section */}
        <section className="dashboard-section" id="applications">
          <h2>📋 My Applications</h2>

          {loadingApps && <p className="loading-state">Loading your applications...</p>}

          {!loadingApps && applications.length === 0 && (
            <div className="empty-box">
              <p>You have not submitted any job applications yet.</p>
            </div>
          )}

          <div className="applications-list">
            {!loadingApps &&
              applications.map((app) => (
                <div key={app._id} className="application-card">
                  <div className="app-main-info">
                    <h3>{app.job?.title || "Position Unavailable"}</h3>
                    <p className="app-company">{app.job?.company}</p>
                    <p className="app-location">📍 {app.job?.location}</p>
                  </div>

                  <div className="app-cover-letter">
                    <strong>Cover Letter:</strong>
                    <p>{app.coverLetter || "No cover letter provided."}</p>
                  </div>

                  <div className="app-status-column">
                    <span className={`status-badge ${app.status?.toLowerCase()}`}>
                      {app.status}
                    </span>
                    <span className="app-date">
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString()
                        : "Applied recently"}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>

      {/* Job Details Modal */}
      {viewingJob && (
        <div className="modal-overlay" onClick={() => setViewingJob(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setViewingJob(null)}>
              ✕
            </button>

            <h2>{viewingJob.title}</h2>
            <p className="company-subtitle">{viewingJob.company}</p>

            <div className="modal-meta-grid">
              <div>
                <strong>Location:</strong> {viewingJob.location}
              </div>
              <div>
                <strong>Job Type:</strong> {viewingJob.jobType}
              </div>
              <div>
                <strong>Experience:</strong> {viewingJob.experience}
              </div>
              <div>
                <strong>Salary:</strong> ₹{viewingJob.salary?.toLocaleString()}
              </div>
            </div>

            <div className="modal-section">
              <h4>Job Description</h4>
              <p>{viewingJob.description}</p>
            </div>

            <div className="modal-section">
              <h4>Required Skills</h4>
              <div className="skills-wrap">
                {viewingJob.skills?.map((skill, idx) => (
                  <span key={idx} className="skill-chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              {isApplied(viewingJob._id) ? (
                <span className="badge-applied">✓ Already Applied</span>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => handleApplyClick(viewingJob)}
                >
                  Apply for this position
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {applyingJob && (
        <div className="modal-overlay" onClick={() => setApplyingJob(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setApplyingJob(null)}>
              ✕
            </button>

            <h2>Apply for {applyingJob.title}</h2>
            <p className="company-subtitle">{applyingJob.company}</p>

            <form onSubmit={handleSubmitApplication}>
              <div className="modal-section">
                <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
                  Cover Letter *
                </label>
                <textarea
                  rows="6"
                  placeholder="Explain why you are a great fit for this position..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                  className="modal-textarea"
                />
              </div>

              <div className="modal-section">
                <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
                  Attached Resume
                </label>
                {profile?.resume ? (
                  <div className="resume-attached-box">
                    <span>📄 Using profile resume: {profile.resume.split("/").pop()}</span>
                    <a
                      href={getFileUrl(profile.resume)}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: 13, textDecoration: "underline" }}
                    >
                      View
                    </a>
                  </div>
                ) : (
                  <p className="warning-text">
                    ⚠️ No resume found in profile. You can upload one in your Profile tab!
                  </p>
                )}
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn-primary" disabled={submittingApp}>
                  {submittingApp ? "Submitting..." : "Submit Application"}
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setApplyingJob(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CandidateDashboard;
