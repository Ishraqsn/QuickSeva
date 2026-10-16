const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const TOKEN_KEY = "quickseva.demo.token";

export function saveDemoToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getDemoToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  if (options.body) headers.set("Content-Type", "application/json");
  const token = getDemoToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    throw new Error("QuickSeva API is unavailable. Start the backend and try again.");
  }
  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const fieldErrors = body?.fieldErrors ? ` ${Object.entries(body.fieldErrors).map(([field, message]) => `${field}: ${message}`).join("; ")}` : "";
    const message = `${body?.detail || body?.message || `Request failed (${response.status}).`}${fieldErrors}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return body;
}

export const api = {
  services: () => request("/services"),
  demoLogin: (phone, code, role = "USER") => request("/auth/demo-login", {
    method: "POST", body: JSON.stringify({ phone, code, role }),
  }),
  me: () => request("/auth/me"),
  applications: () => request("/applications"),
  application: (id) => request(`/applications/${encodeURIComponent(id)}`),
  createApplication: (application) => request("/applications", {
    method: "POST", body: JSON.stringify(application),
  }),
  submitDraft: (id) => request(`/applications/${encodeURIComponent(id)}/submit`, { method: "POST" }),
  workerQueue: () => request("/worker/applications"),
  updateApplicationStatus: (id, status, description) => request(`/worker/applications/${encodeURIComponent(id)}/status`, {
    method: "PATCH", body: JSON.stringify({ status, description }),
  }),
};
