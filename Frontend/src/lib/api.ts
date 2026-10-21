const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "The request could not be completed.");
  return data as T;
}

export interface SupportRequest {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  admin_response?: string | null;
  created_at: string;
  student_name?: string;
  student_email?: string;
}

export interface UserProfile { id: number; name: string; email: string; role: string; created_at: string }
