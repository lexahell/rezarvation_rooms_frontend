export interface MeetingRoom {
  id: number;
  name: string;
  description: string | null;
}

export interface Reservation {
  id: number;
  from_reserve: string; // формат ISO
  to_reserve: string;
  meetingroom_id: number;
  user_id: number;
}

export interface User {
  id: number;
  email: string;
  first_name: string | null;
}