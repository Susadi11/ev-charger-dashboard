// Reservation Service with Mock Data for Frontend Demo
export interface Reservation {
  id: string;
  stationId: string;
  stationName: string;
  startTime: string;
  endTime: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  userId: string;
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
}

class ReservationService {
  private reservations: Reservation[] = [
    {
      id: '1',
      stationId: 'station-1',
      stationName: 'Downtown Charging Hub',
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
      status: 'Confirmed',
      userId: 'user-1',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      stationId: 'station-2',
      stationName: 'Mall Plaza Station',
      startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
      status: 'Pending',
      userId: 'user-1',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      stationId: 'station-3',
      stationName: 'Airport Terminal A',
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
      status: 'Confirmed',
      userId: 'user-1',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      stationId: 'station-4',
      stationName: 'University Campus',
      startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString(), // 1 hour later
      status: 'Cancelled',
      userId: 'user-1',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      stationId: 'station-5',
      stationName: 'Shopping Center West',
      startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
      endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
      status: 'Pending',
      userId: 'user-1',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ];

  private stations: Station[] = [
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

  // Simulate API delay
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Create a new reservation
  async createReservation(data: CreateReservationRequest): Promise<Reservation> {
    await this.delay(800);
    
    const station = this.stations.find(s => s.id === data.stationId);
    if (!station) {
      throw new Error('Station not found');
    }

    const newReservation: Reservation = {
      id: Date.now().toString(),
      stationId: data.stationId,
      stationName: station.name,
      startTime: data.startTime,
      endTime: data.endTime,
      status: 'Pending',
      userId: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.reservations.unshift(newReservation);
    return newReservation;
  }

  // Update an existing reservation
  async updateReservation(id: string, data: UpdateReservationRequest): Promise<Reservation> {
    await this.delay(600);
    
    const index = this.reservations.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Reservation not found');
    }

    const reservation = this.reservations[index];
    const updatedReservation: Reservation = {
      ...reservation,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.reservations[index] = updatedReservation;
    return updatedReservation;
  }

  // Cancel a reservation
  async cancelReservation(id: string): Promise<Reservation> {
    await this.delay(400);
    
    const index = this.reservations.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Reservation not found');
    }

    const reservation = this.reservations[index];
    const cancelledReservation: Reservation = {
      ...reservation,
      status: 'Cancelled',
      updatedAt: new Date().toISOString(),
    };

    this.reservations[index] = cancelledReservation;
    return cancelledReservation;
  }

  // Get all reservations for the current user
  async getReservations(): Promise<Reservation[]> {
    await this.delay(300);
    return [...this.reservations];
  }

  // Get available stations
  async getAvailableStations(): Promise<Station[]> {
    await this.delay(200);
    return [...this.stations];
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
