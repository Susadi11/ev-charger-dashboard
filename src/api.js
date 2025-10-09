const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function loginApi({ email, password }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  // Handle HTTP errors cleanly
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Login failed (${res.status})`);
  }
  return res.json(); // expected: { message, user, token }
}