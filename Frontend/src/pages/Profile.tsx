import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, type UserProfile } from "../lib/api";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); const [error, setError] = useState("");
  useEffect(() => { api<{ user: UserProfile }>("/users/profile").then(({ user: profile }) => { setUser(profile); setName(profile.name); setEmail(profile.email); }).catch((e: Error) => setError(e.message)); }, []);
  async function save(event: FormEvent) { event.preventDefault(); setError(""); setMessage(""); try { const result = await api<{ user: UserProfile; message: string }>("/users/profile", { method: "PUT", body: JSON.stringify({ name: name.trim(), email: email.trim() }) }); setUser(result.user); setMessage(result.message); localStorage.setItem("userEmail", result.user.email); } catch (e) { setError(e instanceof Error ? e.message : "Could not update your profile."); } }
  return <div className="dashboard-page"><header className="dashboard-header"><div><h1>HelpLink</h1><p>Your profile</p></div><button className="secondary-button" onClick={() => navigate(-1)}>Back</button></header><main className="dashboard-content"><section className="request-form-section"><h2>Account details</h2>{user && <p>Member since {new Date(user.created_at).toLocaleDateString()}</p>}<form className="request-form" onSubmit={save}><div className="form-group"><label htmlFor="profile-name">Full name</label><input id="profile-name" value={name} onChange={e => setName(e.target.value)} required /></div><div className="form-group"><label htmlFor="profile-email">Email address</label><input id="profile-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>{error && <p className="error-message">{error}</p>}{message && <p className="success-message">{message}</p>}<button className="dashboard-button" type="submit">Save changes</button></form></section></main></div>;
}
