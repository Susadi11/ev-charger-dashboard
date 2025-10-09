const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function authHeaders() {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function registerUser({ name, email, password, nic, phone, role }) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ name, email, password, nic, phone, role }),
  });
  const data = await res.json();
  if (!res.ok || data.success === false) throw new Error(data.message || "Register failed");
  return data.user; // backend returns {success,message,user,token}
}

export async function getAllUsers() {
  const res = await fetch(`${BASE_URL}/auth/users`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to load users");
  return data; // array<User>
}

export async function getUserById(id) {
  const res = await fetch(`${BASE_URL}/auth/users/${id}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to load user");
  return data; // User
}

// AuthController.UpdateUser only accepts name,email,phone via UpdateUserRequest
export async function updateUser({ id, name, email, phone }) {
  const res = await fetch(`${BASE_URL}/auth/users/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ name, email, phone }),
  });
  const data = await res.json();
  if (!res.ok || data.success === false) throw new Error(data.message || "Update failed");
  return data.user;
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/auth/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok || data.success === false) throw new Error(data.message || "Delete failed");
  return true;
}

// Role must be "Admin" or "StationOperator" per controller
export async function changeUserRole(id, newRole) {
  const res = await fetch(`${BASE_URL}/auth/users/${id}/role`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ newRole }),
  });
  const data = await res.json();
  if (!res.ok || data.success === false) throw new Error(data.message || "Role change failed");
  return true;
}
