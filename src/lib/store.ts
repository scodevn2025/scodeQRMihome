import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Device } from '@/types';
import { apiClient } from './api';
import { mijiaAPI } from './mijia';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  mijiaSession: any | null;
  login: (token: string, user: User, mijiaSession?: any) => void;
  logout: () => void;
}

interface DeviceState {
  devices: Device[];
  loading: boolean;
  error: string | null;
  fetchDevices: () => Promise<void>;
  updateDevice: (deviceId: string, properties: Record<string, any>) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      mijiaSession: null,
      login: (token: string, user: User, mijiaSession?: any) => {
        const userWithSession = { ...user, mijiaSession };
        set({ token, user: userWithSession, isAuthenticated: true, mijiaSession });
        // Set session for Mijia API
        if (mijiaSession) {
          mijiaAPI.setSession(mijiaSession);
        }
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false, mijiaSession: null });
        // Clear Mijia API session
        mijiaAPI.setSession(null);
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useDeviceStore = create<DeviceState>()((set, get) => ({
  devices: [],
  loading: false,
  error: null,
  
  fetchDevices: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.getDevices();
      if (response.success && response.data) {
        set({ devices: response.data, loading: false });
      } else {
        set({ error: response.error || 'Failed to fetch devices', loading: false });
      }
    } catch (error) {
      set({ error: 'Network error', loading: false });
    }
  },
  
  updateDevice: async (deviceId: string, properties: Record<string, any>) => {
    try {
      const response = await apiClient.updateDevice(deviceId, properties);
      if (response.success) {
        // Update local state
        const devices = get().devices.map(device => 
          device.id === deviceId 
            ? { ...device, properties: { ...device.properties, ...properties } }
            : device
        );
        set({ devices });
      } else {
        set({ error: response.error || 'Failed to update device' });
      }
    } catch (error) {
      set({ error: 'Network error' });
    }
  },
  
  setError: (error: string | null) => {
    set({ error });
  },
}));

