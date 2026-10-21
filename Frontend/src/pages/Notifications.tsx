import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
interface Notification { id: number; message: string; is_read: boolean; created_at: string; request_title?: string }
export default function Notifications() {
  const navigate = useNavigate(); const [items, setItems] = useState<Notification[]>([]); const [error, setError] = useState("");
  const refresh = () => api<{ notifications: Notification[] }>("/notifications?limit=100").then(data => setItems(data.notifications)).catch((e: Error) => setError(e.message));
  useEffect(() => { void refresh(); }, []);
  async function markRead(id: number) { try { await api(`/notifications/${id}/read`, { method: "PUT" }); await refresh(); } catch (e) { setError(e instanceof Error ? e.message : "Could not update notification."); } }
  async function markAllRead() { try { await api("/notifications/read-all", { method: "PUT" }); await refresh(); } catch (e) { setError(e instanceof Error ? e.message : "Could not update notifications."); } }
  return <div className="dashboard-page"><header className="dashboard-header"><div><h1>HelpLink</h1><p>Notifications</p></div><button className="secondary-button" onClick={() => navigate(-1)}>Back</button></header><main className="dashboard-content"><section className="welcome-section request-heading"><div><h2>Updates</h2><p>Messages about your support requests.</p></div>{items.some(item => !item.is_read) && <button className="secondary-button" onClick={markAllRead}>Mark all as read</button>}</section>{error && <p className="error-message">{error}</p>}{items.length === 0 && !error ? <div className="dashboard-card"><h3>You're all caught up</h3><p>New updates will appear here.</p></div> : <section className="notification-list">{items.map(item => <article className={`dashboard-card notification-card ${item.is_read ? "is-read" : ""}`} key={item.id}><div><p>{item.message}</p>{item.request_title && <small>Request: {item.request_title}</small>}<small>{new Date(item.created_at).toLocaleString()}</small></div>{!item.is_read && <button className="secondary-button" onClick={() => markRead(item.id)}>Mark read</button>}</article>)}</section>}</main></div>;
}
