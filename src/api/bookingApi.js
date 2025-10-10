const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Helper function to get authorization headers
 * Falls back to no auth if token doesn't exist (for public endpoints)
 */
function authHeaders() {
  const token = localStorage.getItem("auth_token");
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Helper function to handle API responses
 * Ensures consistent error handling
 */
async function handleApiResponse(response) {
  const contentType = response.headers.get("content-type");
  
  // Parse response based on content type
  let data = {};
  if (contentType?.includes("application/json")) {
    data = await response.json().catch(() => ({}));
  }

  if (!response.ok) {
    const errorMessage = data?.message || data?.error || `Request failed (${response.status})`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * RESERVATIONS/BOOKINGS API SERVICE
 * Handles all operations for EV charging station reservations
 * IT22180384 - Sandanima S.H.S.
 */

/**
 * GET all reservations (Admin only)
 * Endpoint: GET /api/Reservation
 * Returns: Array of ReservationResponseDto
 */
export async function getAllReservations() {
  try {
    const response = await fetch(`${BASE_URL}/Reservation`, {
      method: "GET",
      headers: authHeaders(),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching all reservations:", error);
    throw error;
  }
}

/**
 * GET reservation by ID
 * Endpoint: GET /api/Reservation/{id}
 * Params: id - Reservation MongoDB ID or BookingId
 * Returns: ReservationResponseDto
 */
export async function getReservationById(id) {
  if (!id) {
    throw new Error("Reservation ID is required");
  }

  try {
    const response = await fetch(`${BASE_URL}/Reservation/${id}`, {
      method: "GET",
      headers: authHeaders(),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error fetching reservation ${id}:`, error);
    throw error;
  }
}

/**
 * CREATE new reservation
 * Endpoint: POST /api/Reservation
 * 
 * Expected reservationData structure:
 * {
 *   userId?: string (optional, auto-set for non-admin users),
 *   ownerNic?: string (required for admin when userId not provided),
 *   chargingStationId: string (required),
 *   startTime: DateTime (required, ISO 8601 format),
 *   endTime: DateTime (required, ISO 8601 format),
 *   notes?: string (optional)
 * }
 * 
 * Business Rules:
 * - Must be within 7 days from now
 * - No time conflicts allowed
 * - Operator must be available for the time slot
 * - EV owner must be active
 */
export async function createReservation(reservationData) {
  if (!reservationData.chargingStationId || !reservationData.startTime || !reservationData.endTime) {
    throw new Error("Charging station ID, start time, and end time are required");
  }

  try {
    const payload = {
      chargingStationId: reservationData.chargingStationId,
      startTime: reservationData.startTime,
      endTime: reservationData.endTime,
      ...(reservationData.userId && { userId: reservationData.userId }),
      ...(reservationData.ownerNic && { ownerNic: reservationData.ownerNic }),
      ...(reservationData.notes && { notes: reservationData.notes }),
    };

    const response = await fetch(`${BASE_URL}/Reservation`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
}

/**
 * UPDATE reservation
 * Endpoint: PUT /api/Reservation/{id}
 * 
 * Params: id - Reservation MongoDB ID
 *         updateData - Object with fields to update
 * 
 * Business Rules:
 * - Can only update at least 12 hours before start time (admin can override)
 * - No time conflicts allowed
 * 
 * UpdateData structure:
 * {
 *   startTime?: DateTime,
 *   endTime?: DateTime,
 *   status?: "Pending" | "Confirmed" | "Active" | "Completed" | "Cancelled",
 *   notes?: string
 * }
 */
export async function updateReservation(id, updateData) {
  if (!id) {
    throw new Error("Reservation ID is required");
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    throw new Error("Update data is required");
  }

  try {
    const payload = {
      ...(updateData.startTime && { startTime: updateData.startTime }),
      ...(updateData.endTime && { endTime: updateData.endTime }),
      ...(updateData.status && { status: updateData.status }),
      ...(updateData.notes !== undefined && { notes: updateData.notes }),
    };

    const response = await fetch(`${BASE_URL}/Reservation/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error updating reservation ${id}:`, error);
    throw error;
  }
}

/**
 * CANCEL reservation (user)
 * Endpoint: PATCH /api/Reservation/{id}/cancel
 * 
 * Params: id - Reservation MongoDB ID
 * 
 * Business Rules:
 * - Can only cancel at least 12 hours before start time (admin can override)
 */
export async function cancelReservation(id) {
  if (!id) {
    throw new Error("Reservation ID is required");
  }

  try {
    const response = await fetch(`${BASE_URL}/Reservation/${id}/cancel`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error cancelling reservation ${id}:`, error);
    throw error;
  }
}

/**
 * ADMIN CANCEL reservation
 * Endpoint: PATCH /api/Reservation/{id}/admin-cancel
 * Admin only - can cancel any reservation regardless of time constraints
 * 
 * Params: id - Reservation MongoDB ID
 */
export async function adminCancelReservation(id) {
  if (!id) {
    throw new Error("Reservation ID is required");
  }

  try {
    const response = await fetch(`${BASE_URL}/Reservation/${id}/admin-cancel`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error admin cancelling reservation ${id}:`, error);
    throw error;
  }
}

/**
 * DELETE reservation
 * Endpoint: DELETE /api/Reservation/{id}
 * Permanently deletes a reservation from the database
 * 
 * Params: id - Reservation MongoDB ID
 */
export async function deleteReservation(id) {
  if (!id) {
    throw new Error("Reservation ID is required");
  }

  try {
    const response = await fetch(`${BASE_URL}/Reservation/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error deleting reservation ${id}:`, error);
    throw error;
  }
}

/**
 * GET reservation history by NIC
 * Endpoint: GET /api/Reservation/history/{nic}
 * Returns all reservations for a specific EV owner by NIC
 * 
 * Params: nic - EV Owner's National Identity Card number
 * Returns: Array of ReservationResponseDto (ordered by creation date, newest first)
 */
export async function getReservationHistoryByNic(nic) {
  if (!nic) {
    throw new Error("NIC is required");
  }

  try {
    const response = await fetch(`${BASE_URL}/Reservation/history/${nic}`, {
      method: "GET",
      headers: authHeaders(),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error fetching reservation history for NIC ${nic}:`, error);
    throw error;
  }
}

/**
 * GET user completed bookings
 * Endpoint: GET /api/Reservation/user/{userId}/bookings/completed
 * Returns completed charging sessions for a user
 * 
 * Params: userId - User MongoDB ID
 * Returns: Array of BookingSessionDto
 */
export async function getUserCompletedBookings(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const response = await fetch(`${BASE_URL}/Reservation/user/${userId}/bookings/completed`, {
      method: "GET",
      headers: authHeaders(),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error fetching completed bookings for user ${userId}:`, error);
    throw error;
  }
}

/**
 * GET user pending bookings
 * Endpoint: GET /api/Reservation/user/{userId}/bookings/pending
 * Returns pending/approved reservations for a user
 * 
 * Params: userId - User MongoDB ID
 * Returns: Array of BookingSessionDto
 */
export async function getUserPendingBookings(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const response = await fetch(`${BASE_URL}/Reservation/user/${userId}/bookings/pending`, {
      method: "GET",
      headers: authHeaders(),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error fetching pending bookings for user ${userId}:`, error);
    throw error;
  }
}

/**
 * DEBUG: Check operator availability
 * Endpoint: GET /api/Reservation/debug/operator-availability
 * Debug endpoint to check operator availability for a station at a specific time
 * 
 * Params: 
 *   - stationId: Charging station ID
 *   - reservationTime: DateTime (ISO 8601 format)
 */
export async function checkOperatorAvailability(stationId, reservationTime) {
  if (!stationId || !reservationTime) {
    throw new Error("Station ID and reservation time are required");
  }

  try {
    const params = new URLSearchParams({
      stationId,
      reservationTime: reservationTime,
    });

    const response = await fetch(`${BASE_URL}/Reservation/debug/operator-availability?${params}`, {
      method: "GET",
      headers: authHeaders(),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Error checking operator availability:", error);
    throw error;
  }
}

/**
 * UTILITY FUNCTIONS
 */

/**
 * Utility function to format reservation data for display
 * Transforms API response to user-friendly format
 */
export function formatReservationForDisplay(reservation) {
  return {
    id: reservation.id,
    bookingId: reservation.bookingId,
    userId: reservation.userId,
    stationId: reservation.chargingStationId,
    startTime: new Date(reservation.startTime).toLocaleString(),
    endTime: new Date(reservation.endTime).toLocaleString(),
    status: reservation.status,
    statusLabel: getStatusLabel(reservation.status),
    operatorId: reservation.operatorId,
    operatorProfileId: reservation.operatorProfileId,
    qrCode: reservation.qrCode,
    notes: reservation.notes || '',
    createdAt: new Date(reservation.createdAt).toLocaleString(),
    updatedAt: reservation.updatedAt ? new Date(reservation.updatedAt).toLocaleString() : null,
  };
}

/**
 * Helper function to get user-friendly status labels
 */
export function getStatusLabel(status) {
  const statusLabels = {
    Pending: 'Pending',
    Confirmed: 'Confirmed',
    Active: 'In Progress',
    Completed: 'Completed',
    Cancelled: 'Cancelled',
  };
  return statusLabels[status] || status;
}

/**
 * Helper function to get status badge color class
 */
export function getStatusBadgeClass(status) {
  const statusClasses = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Confirmed: 'bg-blue-100 text-blue-800',
    Active: 'bg-green-100 text-green-800',
    Completed: 'bg-gray-100 text-gray-800',
    Cancelled: 'bg-red-100 text-red-800',
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Validate if reservation can be created within 7 days
 */
export function isWithinSevenDays(startTime) {
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const reservationDate = new Date(startTime);
  
  return reservationDate >= now && reservationDate <= sevenDaysFromNow;
}

/**
 * Validate if reservation can be cancelled (12 hours before start time)
 */
export function canBeCancelled(startTime) {
  const now = new Date();
  const reservationDate = new Date(startTime);
  const twelveHoursFromNow = new Date(now.getTime() + 12 * 60 * 60 * 1000);
  
  return reservationDate >= twelveHoursFromNow;
}

/**
 * Format booking session data for display
 */
export function formatBookingSessionForDisplay(booking) {
  return {
    bookingId: booking.bookingId,
    stationId: booking.stationId,
    userId: booking.userId,
    status: booking.status,
    reservationDateTime: new Date(booking.reservationDateTime).toLocaleString(),
    startTime: new Date(booking.startTime).toLocaleString(),
    endTime: new Date(booking.endTime).toLocaleString(),
    checkInTime: booking.checkInTime ? new Date(booking.checkInTime).toLocaleString() : null,
    checkOutTime: booking.checkOutTime ? new Date(booking.checkOutTime).toLocaleString() : null,
    energyConsumedKWh: booking.energyConsumedKWh?.toFixed(2) || '0.00',
    sessionDurationMinutes: booking.sessionDurationMinutes || 0,
    sessionNotes: booking.sessionNotes || '',
  };
}

export default {
  // Core CRUD operations
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  cancelReservation,
  adminCancelReservation,
  deleteReservation,
  
  // History and user bookings
  getReservationHistoryByNic,
  getUserCompletedBookings,
  getUserPendingBookings,
  
  // Debug utilities
  checkOperatorAvailability,
  
  // Formatting utilities
  formatReservationForDisplay,
  formatBookingSessionForDisplay,
  getStatusLabel,
  getStatusBadgeClass,
  
  // Validation utilities
  isWithinSevenDays,
  canBeCancelled,
};