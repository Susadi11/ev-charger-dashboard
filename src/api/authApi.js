const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function authHeaders() {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - { message, user, token }
 */
export async function loginApi({ email, password }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Login failed (${res.status})`);
  }
  return res.json();
}

/**
 * Register a new user
 * @param {Object} userData - { name, email, password, nic, phone, role }
 * @returns {Promise<Object>} - { success, message, user, token }
 */
export async function registerUser({ name, email, password, nic, phone, role }) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, nic, phone, role }),
  });
  
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Register failed");
  }
  return data;
}

/**
 * Get all users (Admin only)
 * @returns {Promise<Array>} - Array of User objects
 */
export async function getAllUsers() {
  const res = await fetch(`${BASE_URL}/auth/users`, {
    headers: authHeaders(),
  });
  
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to load users");
  }
  return data;
}

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object>} - User object
 */
export async function getUserById(id) {
  const res = await fetch(`${BASE_URL}/auth/users/${id}`, {
    headers: authHeaders(),
  });
  
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to load user");
  }
  return data;
}

/**
 * Update user profile
 * @param {Object} params - { id, name, email, phone }
 * @returns {Promise<Object>} - Updated user object
 */
export async function updateUser({ id, name, email, phone }) {
  const res = await fetch(`${BASE_URL}/auth/users/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ name, email, phone }),
  });
  
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Update failed");
  }
  return data.user;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {Promise<boolean>}
 */
export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/auth/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Delete failed");
  }
  return true;
}

/**
 * Change user role (Admin only)
 * @param {string} id - User ID
 * @param {string} newRole - "Admin" or "StationOperator"
 * @returns {Promise<boolean>}
 */
export async function changeUserRole(id, newRole) {
  const res = await fetch(`${BASE_URL}/auth/users/${id}/role`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ newRole }),
  });
  
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Role change failed");
  }
  return true;
}