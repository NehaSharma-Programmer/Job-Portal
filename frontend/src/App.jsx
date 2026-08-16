
import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RecruiterApplicants from "./pages/RecruiterApplicants";
import CreateJob from "./pages/CreateJob";
function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  // Fetch AI recommended jobs
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/jobs/ai-recommended",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error("AI Recommendation Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to fetch AI recommendations"
      );
    } finally {
      setLoading(false);
    }
  };
   const fetchMyApplications = async () => {
  try {
    setApplicationsLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first");
      return;
    }

    const response = await axios.get(
      "http://localhost:5000/api/applications/my",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setApplications(response.data.applications);
  } catch (error) {
    console.error("My Applications Error:", error);

    setMessage(
      error.response?.data?.message ||
        "Unable to fetch applications"
    );
  } finally {
    setApplicationsLoading(false);
  }
};



  // Apply for selected job
  const applyForJob = async () => {
    try {
      if (!selectedJob) {
        return;
      }

      if (!coverLetter.trim()) {
        setMessage("Please enter a cover letter");
        return;
      }

      setApplying(true);
      setMessage("");

      const token = localStorage.getItem("token");
      console.log("Selected Job:", selectedJob);
console.log("Token:", token);


      await axios.post(
        "http://localhost:5000/api/applications",
        {
           jobId: selectedJob._id,
    coverLetter: coverLetter,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("Application submitted successfully!");

      setSelectedJob(null);
      setCoverLetter("");
    } catch (error) {
      console.error("Apply Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to submit application"
      );
    } finally {
      setApplying(false);
    }
  };

  // Fetch recommendations when page loads
  useEffect(() => {
      const path = window.location.pathname;

  if (path === "/") {

    fetchRecommendations();
    fetchMyApplications();
  }
  }, []);

  return (
         <BrowserRouter>
    <Routes>

      <Route
        path="/recruiter"
        element={<RecruiterApplicants />}
      />
      <Route
  path="/recruiter/create-job"
  element={<CreateJob />}
/>


      <Route
        path="/"
        element={



    <div style={{ padding: "40px" }}>
      <h1>🤖 AI Recommended Jobs</h1>

      {/* Loading */}
      {loading && <p>Loading recommendations...</p>}

      {/* Success / Error message */}
      {message && <p>{message}</p>}

      {/* AI Recommended Jobs */}
      {!loading &&
        recommendations.map((item) => (
          <div
            key={item.job._id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              margin: "20px 0",
              borderRadius: "10px",
            }}
          >
            <h2>{item.job.title}</h2>

            <p>
              <strong>Company:</strong>{" "}
              {item.job.company}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {item.job.location}
            </p>

            <p>
              <strong>Salary:</strong>{" "}
              ₹{item.job.salary}
            </p>

            <p>
              <strong>Match:</strong>{" "}
              {item.matchPercentage}%
            </p>

            <p>
              <strong>AI Reason:</strong>{" "}
              {item.reason}
            </p>

            <p>
              <strong>Skills:</strong>{" "}
              {item.job.skills.join(", ")}
            </p>

            {/* Apply Button */}
            <button
              onClick={() => setSelectedJob(item.job)}
            >
              Apply Now
            </button>
          </div>
        ))}

      {/* Apply Form */}
      {selectedJob && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h2>Apply for {selectedJob.title}</h2>

          <textarea
            rows="6"
            placeholder="Write your cover letter..."
            value={coverLetter}
            onChange={(e) =>
              setCoverLetter(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <br />

          <button
            onClick={applyForJob}
            disabled={applying}
          >
            {applying
              ? "Submitting..."
              : "Submit Application"}
          </button>

          <button
            onClick={() => {
              setSelectedJob(null);
              setCoverLetter("");
              setMessage("");
            }}
            style={{
              marginLeft: "10px",
            }}
          >
            Cancel
          </button>
        </div>
      )}
       <hr style={{ margin: "40px 0" }} />

<h1>📋 My Applications</h1>

{applicationsLoading && (
  <p>Loading applications...</p>
)}

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
      }}
    >
      <h2>
        {application.job?.title}
      </h2>

      <p>
        <strong>Company:</strong>{" "}
        {application.job?.company}
      </p>

      <p>
        <strong>Location:</strong>{" "}
        {application.job?.location}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {application.status}
      </p>

      <p>
        <strong>Cover Letter:</strong>{" "}
        {application.coverLetter}
      </p>
    </div>
  ))}



    </div>
            }
      />

    </Routes>
  </BrowserRouter>



  );
}

export default App;

