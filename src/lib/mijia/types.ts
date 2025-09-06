// Mijia API Types - Chuyển đổi từ Python

export interface MijiaSession {
  success: boolean;
  token?: string;
  user_id?: string;
  service_token?: string;
  security_token?: string;
  ssecurity?: string;
  passport_device_id?: string;
  user_name?: string;
  user_avatar?: string;
  error?: string;
}

export interface MijiaDevice {
  id: string;
  name: string;
  type: string;
  model: string;
  online: boolean;
  properties: Record<string, unknown>;
  home_id: string;
  room_id?: string;
  capabilities?: string[];
}

export interface MijiaHome {
  id: string;
  name: string;
  devices: MijiaDevice[];
}

export interface MijiaScene {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  home_id: string;
  actions?: MijiaSceneAction[];
}

export interface MijiaSceneAction {
  device_id: string;
  action: string;
  params: unknown[];
}

export interface MijiaLoginOptions {
  username?: string;
  password?: string;
  use_qr?: boolean;
}

export interface MijiaDeviceUpdate {
  device_id: string;
  properties: Record<string, unknown>;
}

export interface MijiaDeviceAction {
  device_id: string;
  action: string;
  params: unknown[];
}

export interface MijiaAPIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
