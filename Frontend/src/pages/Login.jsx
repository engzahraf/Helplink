import { useState } from "react";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    alert("Login button clicked!");
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="logo">
          HelpLink
        </div>

        <h2>Student Support Management System</h2>

        <p className="welcome-text">
          Welcome back! Please login to continue.
        </p>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <div className="password-container">
              <input
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

          <button type="submit" className="login-button">
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