import { useState } from "react";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    // Check empty fields
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    // Check email format
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    // Check password length
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    // Temporary frontend test
    alert("Login successful! Backend connection will be added later.");
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo / System Name */}
        <div className="logo">
          HelpLink
        </div>

        <h2>Student Support Management System</h2>

        <p className="welcome-text">
          Welcome back! Please login to continue.
        </p>

        <form onSubmit={handleLogin}>

          {/* Email */}
          <div className="input-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="password">Password</label>

            <div className="password-container">

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {/* Login button */}
          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>

        <p className="login-footer">
          HelpLink — Supporting students, connecting solutions.
        </p>

      </div>
    </div>
  );
}

export default Login;