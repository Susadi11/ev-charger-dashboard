const BASE_URL = "https://ev-charging-backend-it22055026.azurewebsites.net/api";

// Helper function to get authorization headers
function authHeaders() {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Helper function to handle API responses
async function handleApiResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || `Request failed (${response.status})`);
  }
  return response.json();
}

/**
 * Reservation API Service
 * Connects to the backend reservation endpoints
 */

// GET /api/reservation - Get all reservations (Admin only)
export async function getAllReservations() {
  const response = await fetch(`${BASE_URL}/reservation`, {
    method: "GET",
    headers: authHeaders(),
  });
  return handleApiResponse(response);
}

// GET /api/reservation/{id} - Get reservation by ID (Owner/Admin)
export async function getReservationById(id) {
  const response = await fetch(`${BASE_URL}/reservation/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });
  return handleApiResponse(response);
}

// POST /api/reservation - Create new reservation (Authenticated)
export async function createReservation(reservationData) {
  const response = await fetch(`${BASE_URL}/reservation`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(reservationData),
  });
  return handleApiResponse(response);
}

// PUT /api/reservation/{id} - Update reservation (Owner/Admin)
export async function updateReservation(id, updateData) {
  const response = await fetch(`${BASE_URL}/reservation/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(updateData),
  });
  return handleApiResponse(response);
}

// PATCH /api/reservation/{id}/cancel - Cancel reservation (Owner/Admin)
export async function cancelReservation(id) {
  const response = await fetch(`${BASE_URL}/reservation/${id}/cancel`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  return handleApiResponse(response);
}

// DELETE /api/reservation/{id} - Delete reservation (Owner/Admin)
export async function deleteReservation(id) {
  const response = await fetch(`${BASE_URL}/reservation/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleApiResponse(response);
}

// GET /api/reservation/history/{nic} - Get reservation history (Owner/Admin)
export async function getReservationHistory(nic) {
  const response = await fetch(`${BASE_URL}/reservation/history/${nic}`, {
    method: "GET",
    headers: authHeaders(),
  });
  return handleApiResponse(response);
}

// PATCH /api/reservation/{id}/admin-cancel - Admin cancel reservation (Admin only)
export async function adminCancelReservation(id) {
  const response = await fetch(`${BASE_URL}/reservation/${id}/admin-cancel`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  return handleApiResponse(response);
}

// Additional helper functions for common operations

/**
 * Get user's reservations (using NIC from localStorage or user data)
 */
export async function getUserReservations(userNic) {
  if (!userNic) {
    throw new Error("User NIC is required to fetch reservations");
  }
  return getReservationHistory(userNic);
}

/**
 * Create reservation with validation
 */
export async function createReservationWithValidation(reservationData) {
  // Basic validation
  if (!reservationData.stationId) {
    throw new Error("Station ID is required");
  }
  if (!reservationData.startTime) {
    throw new Error("Start time is required");
  }
  if (!reservationData.endTime) {
    throw new Error("End time is required");
  }

  // Validate time constraints
  const startTime = new Date(reservationData.startTime);
  const endTime = new Date(reservationData.endTime);
  const now = new Date();
  const twelveHoursFromNow = new Date(now.getTime() + 12 * 60 * 60 * 1000);

  if (startTime < twelveHoursFromNow) {
    throw new Error("Reservation must be at least 12 hours in advance");
  }

  if (endTime <= startTime) {
    throw new Error("End time must be after start time");
  }

  const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  if (durationHours > 8) {
    throw new Error("Reservation duration cannot exceed 8 hours");
  }

  return createReservation(reservationData);
}

/**
 * Update reservation with validation
 */
export async function updateReservationWithValidation(id, updateData) {
  // If updating times, validate them
  if (updateData.startTime || updateData.endTime) {
    const startTime = new Date(updateData.startTime);
    const endTime = new Date(updateData.endTime);
    
    if (endTime <= startTime) {
      throw new Error("End time must be after start time");
    }

    const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    if (durationHours > 8) {
      throw new Error("Reservation duration cannot exceed 8 hours");
    }
  }

  return updateReservation(id, updateData);
}

export default {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  cancelReservation,
  deleteReservation,
  getReservationHistory,
  adminCancelReservation,
  getUserReservations,
  createReservationWithValidation,
  updateReservationWithValidation,
};
