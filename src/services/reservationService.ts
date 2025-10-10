// Reservation Service - Now connects to real backend API
import reservationApi from '../api/reservationApi';

export interface Reservation {
  id: string;
  stationId: string;
  stationName?: string;
  startTime: string;
  endTime: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  userId?: string;
  nic?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationRequest {
  stationId: string;
  startTime: string;
  endTime: string;
}

export interface UpdateReservationRequest {
  startTime?: string;
  endTime?: string;
  status?: 'Pending' | 'Confirmed' | 'Cancelled';
}

export interface Station {
  id: string;
  name: string;
  location: string;
  available: boolean;
  chargingSpeed: string;
  connectorType: string;
  totalSlots?: number;
  availableSlots?: number;
  latitude?: number;
  longitude?: number;
}

class ReservationService {
  // Create a new reservation
  async createReservation(data: CreateReservationRequest): Promise<Reservation> {
    try {
      const response = await reservationApi.createReservationWithValidation(data);
      return response.data || response;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  // Update an existing reservation
  async updateReservation(id: string, data: UpdateReservationRequest): Promise<Reservation> {
    try {
      const response = await reservationApi.updateReservationWithValidation(id, data);
      return response.data || response;
    } catch (error) {
      console.error('Error updating reservation:', error);
      throw error;
    }
  }

  // Cancel a reservation
  async cancelReservation(id: string): Promise<Reservation> {
    try {
      const response = await reservationApi.cancelReservation(id);
      return response.data || response;
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      throw error;
    }
  }

  // Get all reservations for the current user (using NIC from localStorage)
  async getReservations(): Promise<Reservation[]> {
    try {
      // Get user NIC from localStorage or user context
      const userNic = localStorage.getItem('user_nic') || localStorage.getItem('userNic');
      if (!userNic) {
        throw new Error('User NIC not found. Please login again.');
      }
      
      const response = await reservationApi.getUserReservations(userNic);
      return Array.isArray(response) ? response : (response.data || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  }

  // Get all reservations (Admin only)
  async getAllReservations(): Promise<Reservation[]> {
    try {
      const response = await reservationApi.getAllReservations();
      return Array.isArray(response) ? response : (response.data || []);
    } catch (error) {
      console.error('Error fetching all reservations:', error);
      throw error;
    }
  }

  // Get reservation by ID
  async getReservationById(id: string): Promise<Reservation> {
    try {
      const response = await reservationApi.getReservationById(id);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching reservation:', error);
      throw error;
    }
  }

  // Delete a reservation
  async deleteReservation(id: string): Promise<boolean> {
    try {
      await reservationApi.deleteReservation(id);
      return true;
    } catch (error) {
      console.error('Error deleting reservation:', error);
      throw error;
    }
  }

  // Admin cancel reservation
  async adminCancelReservation(id: string): Promise<Reservation> {
    try {
      const response = await reservationApi.adminCancelReservation(id);
      return response.data || response;
    } catch (error) {
      console.error('Error admin cancelling reservation:', error);
      throw error;
    }
  }

  // Get available stations - Try to use API first, fall back to mock data
  async getAvailableStations(): Promise<Station[]> {
    try {
      // Try to import and use the stations API
      const stationsApi = await import('../api/stationsApi');
      const response = await stationsApi.default.getAvailableStations();
      
      if (response.success && response.data) {
        // Map backend station format to frontend format
        return response.data.map((backendStation: any) => ({
          id: backendStation.id,
          name: backendStation.name,
          location: backendStation.address,
          available: backendStation.isActive && backendStation.availableSlots > 0,
          chargingSpeed: backendStation.type === 'DC' ? '150kW' : '50kW', // Map type to speed
          connectorType: backendStation.type === 'DC' ? 'CCS/CHAdeMO' : 'Type 2',
          totalSlots: backendStation.totalSlots,
          availableSlots: backendStation.availableSlots,
          latitude: backendStation.latitude,
          longitude: backendStation.longitude,
        }));
      }
      
      return [];
    } catch (error) {
      console.warn('Stations API not available, using mock data:', error);
      // Fall back to mock data if stations API is not available
      return [
        {
          id: 'station-1',
          name: 'Downtown Charging Hub',
          location: '123 Main Street, Downtown',
          available: true,
          chargingSpeed: '150kW',
          connectorType: 'CCS/CHAdeMO',
        },
        {
          id: 'station-2',
          name: 'Mall Plaza Station',
          location: '456 Shopping Ave, Mall District',
          available: true,
          chargingSpeed: '120kW',
          connectorType: 'CCS',
        },
        {
          id: 'station-3',
          name: 'Airport Terminal A',
          location: '789 Airport Blvd, Terminal A',
          available: true,
          chargingSpeed: '200kW',
          connectorType: 'CCS/CHAdeMO',
        },
        {
          id: 'station-4',
          name: 'University Campus',
          location: '321 Campus Drive, University',
          available: true,
          chargingSpeed: '100kW',
          connectorType: 'CCS',
        },
        {
          id: 'station-5',
          name: 'Shopping Center West',
          location: '654 Retail Road, West Side',
          available: true,
          chargingSpeed: '180kW',
          connectorType: 'CCS/CHAdeMO',
        },
        {
          id: 'station-6',
          name: 'Highway Rest Stop',
          location: 'Highway 101, Mile 45',
          available: true,
          chargingSpeed: '250kW',
          connectorType: 'CCS/CHAdeMO',
        },
        {
          id: 'station-7',
          name: 'City Park Station',
          location: '987 Park Avenue, Central Park',
          available: true,
          chargingSpeed: '110kW',
          connectorType: 'CCS',
        },
        {
          id: 'station-8',
          name: 'Business District Hub',
          location: '147 Corporate Blvd, Business District',
          available: true,
          chargingSpeed: '160kW',
          connectorType: 'CCS/CHAdeMO',
        },
      ];
    }
  }

  // Validate reservation time constraints
  validateReservationTime(startTime: string, endTime: string): { isValid: boolean; error?: string } {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const twelveHoursFromNow = new Date(now.getTime() + 12 * 60 * 60 * 1000);

    // Check if start time is at least 12 hours ahead
    if (start < twelveHoursFromNow) {
      return {
        isValid: false,
        error: 'Reservation must be at least 12 hours in advance'
      };
    }

    // Check if start time is within 7 days
    if (start > sevenDaysFromNow) {
      return {
        isValid: false,
        error: 'Reservation cannot be more than 7 days in advance'
      };
    }

    // Check if end time is after start time
    if (end <= start) {
      return {
        isValid: false,
        error: 'End time must be after start time'
      };
    }

    // Check if duration is reasonable (e.g., not more than 8 hours)
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (durationHours > 8) {
      return {
        isValid: false,
        error: 'Reservation duration cannot exceed 8 hours'
      };
    }

    return { isValid: true };
  }
}

export default new ReservationService();
