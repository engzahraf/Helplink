import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

function SubmitRequest() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!title || !description || !category || !priority) {
      setError("Please fill in all fields.");
      return;
    }

    if (title.length < 5) {
      setError("Title must be at least 5 characters.");
      return;
    }

    if (description.length < 10) {
      setError("Description must be at least 10 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await api("/support-requests", { method: "POST", body: JSON.stringify({ title, description, category, priority }) });
      setSuccess("Your request was submitted successfully.");
      setTitle(""); setDescription(""); setCategory(""); setPriority("");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not submit your request."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>HelpLink</h1>
          <p>Submit Support Request</p>
        </div>

        <button
          onClick={() => navigate("/student-dashboard")}
          className="logout-button"
        >
          Back to Dashboard
        </button>
      </header>

      <main className="dashboard-content">
        <section className="request-form-section">
          <h2>Submit a Support Request</h2>

          <p>
            Please provide the details of the issue you need help with.
          </p>

          <form onSubmit={handleSubmit} className="request-form">
            <div className="form-group">
              <label htmlFor="title">Request Title</label>

              <input
                id="title"
                type="text"
                placeholder="Enter request title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>

              <textarea
                id="description"
                placeholder="Describe your issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>

              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                <option value="Academic">Academic</option>
                <option value="Technical">Technical</option>
                <option value="Administrative">Administrative</option>
                <option value="Financial">Financial</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>

              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {error && <p className="error-message">{error}</p>}

            {success && <p className="success-message">{success}</p>}

            <div className="request-form-buttons">
              <button type="submit" className="dashboard-button" disabled={isLoading}>
                {isLoading ? "Submitting…" : "Submit Request"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/student-dashboard")}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default SubmitRequest;
