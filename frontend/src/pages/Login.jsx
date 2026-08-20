import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await API.post("/api/auth/login", {
        email,
        password,
      });

      // Save JWT token & user info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setMessage("Login successful!");

      // Redirect according to role
      if (response.data.user.role === "recruiter") {
        navigate("/recruiter");
      } else {
        navigate("/candidate/dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setMessage(
        error.response?.data?.message || "Invalid email or password"
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
          maxWidth: "420px",
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
          Welcome Back 👋
        </h1>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "14px",
            marginBottom: "24px",
          }}
        >
          Login to your JobLane account
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

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "18px" }}>
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
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Logging in..." : "Login"}
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
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ color: "var(--primary)", fontWeight: "600" }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
