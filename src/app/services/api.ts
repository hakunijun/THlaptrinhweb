const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
}

export interface Appointment {
  id: number;
  userId: number;
  patientName: string;
  phone: string;
  email?: string;
  specialty: string;
  doctor?: string;
  date: string;
  time: string;
  symptoms?: string;
  status: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
}

export interface RegisterResponse {
  success: boolean;
  user: User;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  register: async (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ): Promise<RegisterResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, fullName, phone }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  },
};

// Appointments API
export const appointmentsAPI = {
  getAppointments: async (userId: string): Promise<Appointment[]> => {
    const response = await fetch(`${API_BASE_URL}/appointments/${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }

    return response.json();
  },

  createAppointment: async (appointment: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointment),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create appointment');
    }

    return response.json();
  },

  deleteAppointment: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete appointment');
    }
  },

  updateAppointment: async (id: number, status: string): Promise<Appointment> => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update appointment');
    }

    return response.json();
  },
};

