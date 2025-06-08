import axios from 'axios';
import { MeetingRoom, Reservation } from '../types';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерсептор для добавления токена к каждому запросу
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Rooms
export const getMeetingRooms = async (): Promise<MeetingRoom[]> => {
  const response = await apiClient.get('/meeting_rooms');
  return response.data;
};

export const createMeetingRoom = async (data: {
  name: string;
  description?: string;
}): Promise<MeetingRoom> => {
  const response = await apiClient.post('/meeting_rooms', data);
  return response.data;
};

// Reservations
export const getReservationsByRoomId = async (
  id: number
): Promise<Reservation[]> => {
  const response = await apiClient.get(`/meeting_rooms/${id}/reservations`);
  return response.data;
};

export const createReservation = async (data: {
  meetingroom_id: number;
  from_reserve: string;
  to_reserve: string;
}): Promise<Reservation> => {
  const response = await apiClient.post('/reservations', data);
  return response.data;
};

export const getMyReservations = async (): Promise<Reservation[]> => {
  const response = await apiClient.get('/reservations/my_reservations');
  return response.data;
};