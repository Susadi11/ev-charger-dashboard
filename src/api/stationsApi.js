const BASE_URL = "https://ev-charging-backend-it22055026.azurewebsites.net/api";

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
 * STATIONS API SERVICE
 * Handles all CRUD operations for EV charging stations
 */

/**
 * GET all stations
 * Endpoint: GET /api/Stations
 * Returns: { success, data: [], message, errors }
 */
export async function getAllStations() {
  try {
    const response = await fetch(`${BASE_URL}/Stations`, {
      method: "GET",
      headers: authHeaders(),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching all stations:", error);
    throw error;
  }
}

/**
 * GET station by ID
 * Endpoint: GET /api/Stations/{id}
 * Params: id - Station MongoDB ID (e.g., "68e611f6852285e8f6d48a76")
 */
export async function getStationById(id) {
  if (!id) {
    throw new Error("Station ID is required");
  }

  try {
    const response = await fetch(`${BASE_URL}/Stations/${id}`, {
      method: "GET",
      headers: authHeaders(),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error fetching station ${id}:`, error);
    throw error;
  }
}

/**
 * GET available stations
 * Filters stations that are active and have available slots
 * Note: If backend doesn't have a dedicated endpoint, 
 * we filter client-side from getAllStations()
 */
export async function getAvailableStations() {
  try {
    const result = await getAllStations();
    
    if (result.success && result.data && Array.isArray(result.data)) {
      const availableStations = result.data.filter(station => 
        station.isActive && station.availableSlots > 0
      );
      return {
        ...result,
        data: availableStations,
        message: `Retrieved ${availableStations.length} available stations`
      };
    }
    
    return result;
  } catch (error) {
    console.error("Error fetching available stations:", error);
    throw error;
  }
}

/**
 * CREATE new station
 * Endpoint: POST /api/Stations
 * Admin only
 * 
 * Expected stationData structure:
 * {
 *   name: string (required),
 *   address: string (required),
 *   latitude: number,
 *   longitude: number,
 *   type: "AC" | "DC" | "Both" (required),
 *   totalSlots: number (required),
 *   location: string (from form, may not be in backend),
 *   status: "operational" | "maintenance" | "offline",
 *   operatingHours: { open, close },
 *   schedule: { mon-sun: boolean }
 * }
 */
export async function createStation(stationData) {
  if (!stationData.name || !stationData.address || !stationData.type || !stationData.slots) {
    throw new Error("Station name, address, type, and slots are required");
  }

  try {
    // Map form data to backend schema
    const payload = {
      name: stationData.name,
      address: stationData.address,
      latitude: stationData.latitude ? parseFloat(stationData.latitude) : null,
      longitude: stationData.longitude ? parseFloat(stationData.longitude) : null,
      type: stationData.type,
      totalSlots: parseInt(stationData.slots, 10),
      isActive: stationData.status === 'operational',
      // Optional: Include additional fields if backend supports them
      ...(stationData.operatingHours && { operatingHours: stationData.operatingHours }),
      ...(stationData.schedule && { schedule: stationData.schedule }),
    };

    const response = await fetch(`${BASE_URL}/Stations`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error("Error creating station:", error);
    throw error;
  }
}

/**
 * UPDATE station
 * Endpoint: PUT /api/Stations/{id}
 * Admin only
 * 
 * Params: id - Station MongoDB ID
 *         updateData - Object with fields to update
 */
export async function updateStation(id, updateData) {
  if (!id) {
    throw new Error("Station ID is required");
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    throw new Error("Update data is required");
  }

  try {
    // Map form data to backend schema
    const payload = {
      ...(updateData.name && { name: updateData.name }),
      ...(updateData.address && { address: updateData.address }),
      ...(updateData.latitude && { latitude: parseFloat(updateData.latitude) }),
      ...(updateData.longitude && { longitude: parseFloat(updateData.longitude) }),
      ...(updateData.type && { type: updateData.type }),
      ...(updateData.slots && { totalSlots: parseInt(updateData.slots, 10) }),
      ...(updateData.status && { isActive: updateData.status === 'operational' }),
      ...(updateData.operatingHours && { operatingHours: updateData.operatingHours }),
      ...(updateData.schedule && { schedule: updateData.schedule }),
    };

    const response = await fetch(`${BASE_URL}/Stations/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error updating station ${id}:`, error);
    throw error;
  }
}

/**
 * DELETE station
 * Endpoint: DELETE /api/Stations/{id}
 * Admin only
 * 
 * Params: id - Station MongoDB ID
 */
export async function deleteStation(id) {
  if (!id) {
    throw new Error("Station ID is required");
  }

  try {
    const response = await fetch(`${BASE_URL}/Stations/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error deleting station ${id}:`, error);
    throw error;
  }
}

/**
 * Utility function to transform form data to backend schema
 * Maps frontend form structure to backend nested Location object
 */
export function transformFormDataToApi(formData) {
  return {
    name: formData.name,
    location: {
      address: formData.address,
      latitude: formData.latitude ? parseFloat(formData.latitude) : 0,
      longitude: formData.longitude ? parseFloat(formData.longitude) : 0
    },
    type: formData.type,
    totalSlots: parseInt(formData.slots, 10),
    isActive: formData.status === 'operational',
    // Note: Backend may not support operatingHours and schedule yet
    // These can be added when backend DTOs are updated
  };
}

/**
 * Utility function to transform API response to form data
 * Use this when loading station data into StationModal
 */
export function transformApiToFormData(station) {
  return {
    name: station.name || '',
    location: '', // Backend doesn't provide this, may need to extract from address
    address: station.address || '',
    type: station.type || 'AC',
    slots: station.totalSlots || '',
    latitude: station.latitude || '',
    longitude: station.longitude || '',
    operatingHours: station.operatingHours || { open: '00:00', close: '23:59' },
    schedule: station.schedule || {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
    status: station.isActive ? 'operational' : 'offline',
  };
}

export default {
  getAllStations,
  getStationById,
  getAvailableStations,
  createStation,
  updateStation,
  deleteStation,
  transformFormDataToApi,
  transformApiToFormData,
};