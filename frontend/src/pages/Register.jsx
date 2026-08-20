import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      await API.post("/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      setMessage("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Register Error:", error);
      setMessage(
        error.response?.data?.message || "Unable to register account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "40px",
          background: "var(--bg-card)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "var(--text-main)",
            marginBottom: "8px",
          }}
        >
          Join JobLane 🚀
        </h1>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "14px",
            marginBottom: "24px",
          }}
        >
          Create your JobLane account
        </p>

        {message && (
          <div
            style={{
              padding: "12px",
              marginBottom: "20px",
              background: message.includes("successful")
                ? "var(--success-light)"
                : "var(--danger-light)",
              color: message.includes("successful")
                ? "var(--success)"
                : "var(--danger)",
              borderRadius: "var(--radius-md)",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--text-muted)",
                marginBottom: "6px",
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--text-muted)",
                marginBottom: "6px",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--text-muted)",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
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

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--text-muted)",
                marginBottom: "6px",
              }}
            >
              I am a...
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
              <option value="candidate">Job Candidate</option>
              <option value="recruiter">Recruiter / Employer</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "var(--radius-md)",
              background: "var(--primary)",
              color: "white",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "14px",
            color: "var(--text-muted)",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "var(--primary)", fontWeight: "600" }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
