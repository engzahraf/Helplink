
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>HelpLink</h1>
          <p>Your student support space</p>
        </div>

        <button
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <section className="welcome-section">
          <h2>Welcome to HelpLink 👋</h2>
          <p>
            Manage your support requests and get help from the
            administration team.
          </p>
        </section>

        <nav className="quick-nav" aria-label="Student navigation"><Link to="/student-dashboard">Overview</Link><Link to="/my-requests">My requests</Link><Link to="/notifications">Notifications</Link><Link to="/profile">Profile</Link></nav>

        <section className="dashboard-cards">
          {/* Submit Support Request */}
          <div className="dashboard-card">
            <h3>Submit Support Request</h3>
            <p>
              Create a new support request and explain the issue
              you need help with.
            </p>

            <button
              className="dashboard-button"
              onClick={() => navigate("/submit-request")}
            >
              Submit Request
            </button>
          </div>

          {/* My Requests */}
          <div className="dashboard-card">
            <h3>My Requests</h3>
            <p>
              View and track the support requests you have
              already submitted.
            </p>

            <button
              className="dashboard-button"
              onClick={() => navigate("/my-requests")}
            >
              View Requests
            </button>
          </div>

          {/* Profile */}
          <div className="dashboard-card">
            <h3>Profile</h3>
            <p>
              View and update your personal information and
              account settings.
            </p>

            <button
              className="dashboard-button"
              onClick={() => navigate("/profile")}
            >
              View Profile
            </button>
          </div>

          {/* Notifications */}
          <div className="dashboard-card">
            <h3>Notifications</h3>
            <p>
              Check updates and responses related to your
              support requests.
            </p>

            <button
              className="dashboard-button"
              onClick={() => navigate("/notifications")}
            >
              View Notifications
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;
