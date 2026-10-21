import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, type SupportRequest } from "../lib/api";

function MyRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { api<{ requests: SupportRequest[] }>("/support-requests?limit=100").then((data) => setRequests(data.requests)).catch((err: Error) => setError(err.message)); }, []);
  return <div className="dashboard-page"><header className="dashboard-header"><div><h1>HelpLink</h1><p>My Support Requests</p></div><button className="secondary-button" onClick={() => navigate("/student-dashboard")}>Back to Dashboard</button></header>
    <main className="dashboard-content"><section className="welcome-section"><h2>My requests</h2><p>Track progress and read responses from your support team.</p></section>{error && <p className="error-message">{error}</p>}
      {requests.length === 0 && !error ? <div className="dashboard-card"><h3>No requests yet</h3><p>When you submit a request, you can follow its progress here.</p></div> : <section className="dashboard-cards">{requests.map((request) => <article className="dashboard-card" key={request.id}><div className="request-heading"><h3>{request.title}</h3><span className={`status status-${request.status.toLowerCase().replaceAll(" ", "-")}`}>{request.status}</span></div><p>{request.description}</p><div className="request-meta"><span>{request.category}</span><span>{request.priority} priority</span><span>{new Date(request.created_at).toLocaleDateString()}</span></div>{request.admin_response && <div className="admin-response"><strong>Support team response</strong><p>{request.admin_response}</p></div>}</article>)}</section>}
      <button className="dashboard-button" onClick={() => navigate("/submit-request")}>Submit a request</button></main></div>;
}
export default MyRequests;
