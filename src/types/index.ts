// Device types
export interface Device {
  id: string;
  name: string;
  type: 'light' | 'sensor' | 'camera' | 'speaker' | 'switch' | 'other';
  model: string;
  online: boolean;
  properties: Record<string, unknown>;
  homeId: string;
}

// User types
export interface User {
  id: string;
  username: string;
  avatar?: string;
  mijiaSession?: Record<string, unknown>;
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// QR Login types
export interface QRLoginResponse {
  qrUrl: string;
  qrId: string;
  expiresAt: number;
  loginUrl: string;
  isDemo?: boolean;
}

export interface QRStatusResponse {
  status: 'pending' | 'scanned' | 'confirmed' | 'expired';
  token?: string;
  user?: User;
}

// Device Control types
export interface DeviceAction {
  type: 'set_property' | 'set_properties' | 'call_action';
  properties?: Record<string, unknown>;
  action?: string;
  params?: unknown[];
}

// Home types
export interface Home {
  id: string;
  name: string;
  devices: Device[];
}

// Scene types
export interface Scene {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  homeId: string;
}

