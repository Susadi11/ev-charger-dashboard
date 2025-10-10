// API Integration Test Utility
// This file helps test the API integration

import reservationApi from '../api/reservationApi';
import stationsApi from '../api/stationsApi';

export const testApiConnection = async () => {
  console.log('Testing API connection...');
  
  try {
    // Test if we can make a basic request
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.warn('No auth token found. Please login first.');
      return { success: false, message: 'No auth token found' };
    }

    // Test getting all reservations (this will work for admin users)
    console.log('Testing reservation API...');
    const response = await reservationApi.getAllReservations();
    console.log('✅ API connection successful!', response);
    return { success: true, data: response };
    
  } catch (error) {
    console.error('❌ API connection failed:', error);
    return { success: false, error: error.message };
  }
};

export const testUserReservations = async () => {
  console.log('Testing user reservations...');
  
  try {
    const userNic = localStorage.getItem('user_nic');
    if (!userNic) {
      console.warn('No user NIC found. Please login first.');
      return { success: false, message: 'No user NIC found' };
    }

    const response = await reservationApi.getUserReservations(userNic);
    console.log('✅ User reservations loaded!', response);
    return { success: true, data: response };
    
  } catch (error) {
    console.error('❌ Failed to load user reservations:', error);
    return { success: false, error: error.message };
  }
};

export const testStationsApi = async () => {
  console.log('Testing stations API...');
  
  try {
    const response = await stationsApi.getAllStations();
    console.log('✅ Stations API loaded!', response);
    return { success: true, data: response };
    
  } catch (error) {
    console.error('❌ Failed to load stations:', error);
    return { success: false, error: error.message };
  }
};

// Make test functions available globally for console testing
if (typeof window !== 'undefined') {
  window.testApiConnection = testApiConnection;
  window.testUserReservations = testUserReservations;
  window.testStationsApi = testStationsApi;
}
