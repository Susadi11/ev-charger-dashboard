const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function authHeaders() {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Login an EV Owner (Mobile app login)
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - { success, message, evOwner, token }
 */
export async function loginEVOwner({ email, password }) {
  const res = await fetch(`${BASE_URL}/EVOwners/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  
  // Check if response has content before parsing JSON
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Login failed with status ${res.status}`);
  }
  return data;
}

/**
 * Register a new EV Owner account
 * @param {Object} ownerData - { name, email, nic, password, phone, vehicleType }
 * @returns {Promise<Object>} - { success, message, evOwner, token }
 */
export async function registerEVOwner({ name, email, nic, password, phone, vehicleType }) {
  const res = await fetch(`${BASE_URL}/EVOwners/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, nic, password, phone, vehicleType }),
  });
  
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Registration failed with status ${res.status}`);
  }
  return data;
}

/**
 * Get all EV Owners (Admin only)
 * @returns {Promise<Array>} - Array of EVOwner objects
 */
export async function getAllEVOwners() {
  const res = await fetch(`${BASE_URL}/EVOwners`, {
    headers: authHeaders(),
  });
  
  // Get response text first to handle empty responses
  const text = await res.text();
  
  if (!res.ok) {
    const errorData = text ? JSON.parse(text) : {};
    throw new Error(
      errorData?.message || 
      `Failed to load EV owners. Status: ${res.status} ${res.statusText}`
    );
  }
  
  // Parse JSON only if there's content
  const data = text ? JSON.parse(text) : [];
  return data;
}

/**
 * Get a specific EV Owner by NIC
 * @param {string} nic - National Identity Card number
 * @returns {Promise<Object>} - EVOwner object
 */
export async function getEVOwnerByNIC(nic) {
  const res = await fetch(`${BASE_URL}/EVOwners/${nic}`, {
    headers: authHeaders(),
  });
  
  const text = await res.text();
  
  if (!res.ok) {
    const errorData = text ? JSON.parse(text) : {};
    throw new Error(errorData?.message || `Failed to load EV owner. Status: ${res.status}`);
  }
  
  const data = text ? JSON.parse(text) : null;
  return data;
}

/**
 * Update EV Owner profile and vehicle information
 * @param {string} nic - National Identity Card number
 * @param {Object} updateData - { name, email, phone, vehicleType }
 * @returns {Promise<Object>} - { success, message, evOwner }
 */
export async function updateEVOwner(nic, { name, email, phone, vehicleType }) {
  const res = await fetch(`${BASE_URL}/EVOwners/${nic}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ name, email, phone, vehicleType }),
  });
  
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Update failed with status ${res.status}`);
  }
  return data;
}

/**
 * Deactivate an EV Owner account
 * @param {string} nic - National Identity Card number
 * @returns {Promise<boolean>}
 */
export async function deactivateEVOwner(nic) {
  const res = await fetch(`${BASE_URL}/EVOwners/${nic}/deactivate`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Deactivation failed with status ${res.status}`);
  }
  return true;
}

/**
 * Reactivate an EV Owner account (Admin only)
 * @param {string} nic - National Identity Card number
 * @returns {Promise<boolean>}
 */
export async function activateEVOwner(nic) {
  const res = await fetch(`${BASE_URL}/EVOwners/${nic}/activate`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Activation failed with status ${res.status}`);
  }
  return true;
}

/**
 * Permanently delete an EV Owner
 * @param {string} nic - National Identity Card number
 * @returns {Promise<boolean>}
 */
export async function deleteEVOwner(nic) {
  const res = await fetch(`${BASE_URL}/EVOwners/${nic}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Delete failed with status ${res.status}`);
  }
  return true;
}