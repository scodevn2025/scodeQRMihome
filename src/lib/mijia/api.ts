// Mijia API - Chuyển đổi từ Python mijiaAPI

import { MijiaSession, MijiaDevice, MijiaHome, MijiaScene, MijiaDeviceUpdate, MijiaDeviceAction, MijiaAPIResponse } from './types';

export class MijiaAPI {
  private session: MijiaSession | null = null;
  private baseUrl = 'https://api.io.mi.com/app';

  constructor(session?: MijiaSession) {
    if (session) {
      this.session = session;
    }
  }

  setSession(session: MijiaSession): void {
    this.session = session;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<MijiaAPIResponse<T>> {
    if (!this.session?.service_token) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      // Generate nonce and signature like Python API
      const nonce = this.generateNonce();
      const signedNonce = this.generateSignedNonce(this.session.ssecurity || '', nonce);
      const data = this.formatData(typeof options.body === 'string' ? options.body : '{}');
      const signature = this.generateSignature(endpoint, signedNonce, nonce, data);

      const formData = new URLSearchParams();
      formData.append('_nonce', nonce);
      formData.append('data', data);
      formData.append('signature', signature);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36 Edg/126.0.0.0',
          'x-xiaomi-protocal-flag-cli': 'PROTOCAL-HTTP2',
          'Cookie': `PassportDeviceId=${this.session.passport_device_id};userId=${this.session.user_id};serviceToken=${this.session.service_token};`,
          'Content-Type': 'application/x-www-form-urlencoded',
          ...options.headers,
        },
        body: formData,
      });

      const responseData = await response.json();
      
      if (responseData.code === 0) {
        // Python API trả về trực tiếp data, không có result wrapper
        return { success: true, data: responseData.result || responseData };
      } else {
        return { success: false, error: `获取数据失败, ${responseData.message}` };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  }

  private generateNonce(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateSignedNonce(ssecurity: string, nonce: string): string {
    // Simple hash implementation for browser compatibility
    const str = ssecurity + nonce;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return btoa(hash.toString());
  }

  private generateSignature(uri: string, signedNonce: string, nonce: string, data: string): string {
    // Simple signature implementation for browser compatibility
    const sign = `${uri}&${signedNonce}&${nonce}&data=${data}`;
    let hash = 0;
    for (let i = 0; i < sign.length; i++) {
      const char = sign.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return btoa(hash.toString());
  }

  private formatData(data: string): string {
    return data
      .replace(/'/g, '"')
      .replace(/True/g, 'true')
      .replace(/False/g, 'false');
  }

  /**
   * Lấy danh sách thiết bị
   */
  async get_devices_list(): Promise<MijiaAPIResponse<MijiaDevice[]>> {
    // First get homes list
    const homesResponse = await this.get_homes_list();
    if (!homesResponse.success || !homesResponse.data) {
      return { success: false, error: 'Failed to get homes list' };
    }

    const devices: MijiaDevice[] = [];
    const deviceIds = new Set<string>(); // Để tránh trùng lặp thiết bị

    for (const home of homesResponse.data) {
      let start_did = '';
      let has_more = true;
      
      while (has_more) {
        const response = await this.request<{ device_info: unknown[]; has_more: boolean; next_did: string }>('/home/home_device_list', {
          method: 'POST',
          body: JSON.stringify({
            home_owner: home.id,
            home_id: parseInt(home.id),
            limit: 200,
            start_did: start_did,
            get_split_device: true,        // Lấy thiết bị được chia sẻ
            support_smart_home: true,      // Hỗ trợ smart home
            get_cariot_device: true,       // Lấy thiết bị Cariot
            get_third_device: true,        // Lấy thiết bị bên thứ 3
            get_share_device: true,        // Lấy thiết bị được chia sẻ
            get_room_device: true,         // Lấy thiết bị trong phòng
            get_all_device: true           // Lấy tất cả thiết bị
          })
        });

        if (response.success && response.data?.device_info) {
          // Lọc thiết bị trùng lặp và thêm vào danh sách
          for (const device of response.data.device_info) {
            const d = device as Record<string, unknown>;
            const deviceId = (d.did || d.id) as string;
            if (deviceId && !deviceIds.has(deviceId)) {
              deviceIds.add(deviceId);
              devices.push(device as MijiaDevice);
            }
          }
          
          start_did = (response.data.next_did as string) || '';
          has_more = response.data.has_more && start_did !== '';
        } else {
          has_more = false;
        }
      }
    }

    return { success: true, data: devices };
  }

  /**
   * Lấy thiết bị được chia sẻ
   */
  async get_shared_devices(): Promise<MijiaAPIResponse<MijiaDevice[]>> {
    const response = await this.request<{ device_info: unknown[] }>('/home/home_device_list', {
      method: 'POST',
      body: JSON.stringify({
        get_share_device: true,
        get_split_device: true,
        get_third_device: true,
        limit: 500
      })
    });

    if (response.success && response.data?.device_info) {
      return { success: true, data: response.data.device_info as MijiaDevice[] };
    }

    return { success: true, data: [] };
  }

  /**
   * Lấy tất cả thiết bị bao gồm thiết bị được chia sẻ
   */
  async get_all_devices(): Promise<MijiaAPIResponse<MijiaDevice[]>> {
    // Lấy thiết bị thông thường
    const devicesResponse = await this.get_devices_list();
    if (!devicesResponse.success) {
      return devicesResponse;
    }

    // Lấy thiết bị được chia sẻ
    const sharedResponse = await this.get_shared_devices();
    if (!sharedResponse.success) {
      return sharedResponse;
    }

    // Gộp và loại bỏ trùng lặp
    const allDevices = [...(devicesResponse.data || [])];
    const deviceIds = new Set(allDevices.map(d => d.id));

    for (const device of sharedResponse.data || []) {
      const deviceId = device.id;
      if (deviceId && !deviceIds.has(deviceId)) {
        deviceIds.add(deviceId);
        allDevices.push(device);
      }
    }

    return { success: true, data: allDevices };
  }

  /**
   * Lấy danh sách nhà/phòng
   */
  async get_homes_list(): Promise<MijiaAPIResponse<MijiaHome[]>> {
    const response = await this.request<{ home_list: unknown[] }>('/v2/homeroom/gethome_merged', {
      method: 'POST',
      body: JSON.stringify({
        fg: true,
        fetch_share: true,
        fetch_share_dev: true,
        limit: 300,
        app_ver: 7
      })
    });

    if (response.success && response.data?.home_list) {
      return { success: true, data: response.data.home_list as MijiaHome[] };
    }

    return { success: false, error: 'Failed to get homes list' };
  }

  /**
   * Lấy danh sách kịch bản
   */
  async get_scenes_list(home_id: string): Promise<MijiaAPIResponse<MijiaScene[]>> {
    const response = await this.request<{ scene_info_list: unknown[] }>('/appgateway/miot/appsceneservice/AppSceneService/GetSceneList', {
      method: 'POST',
      body: JSON.stringify({ home_id })
    });

    if (response.success && response.data?.scene_info_list) {
      return { success: true, data: response.data.scene_info_list as MijiaScene[] };
    }

    return { success: true, data: [] };
  }

  /**
   * Thực thi kịch bản
   */
  async run_scene(scene_id: string): Promise<MijiaAPIResponse> {
    const response = await this.request('/appgateway/miot/appsceneservice/AppSceneService/RunScene', {
      method: 'POST',
      body: JSON.stringify({ 
        scene_id, 
        trigger_key: "user.click" 
      })
    });

    // Python API trả về boolean, không phải object
    return { success: response.success, data: response.success };
  }

  /**
   * Lấy thuộc tính thiết bị
   */
  async get_devices_prop(device: MijiaDevice): Promise<MijiaAPIResponse<unknown>> {
    const response = await this.request('/miotspec/prop/get', {
      method: 'POST',
      body: JSON.stringify({ 
        params: [{
          did: device.id,
          siid: 2,
          piid: 1
        }]
      })
    });

    // Python API trả về trực tiếp array, không phải object
    return { success: response.success, data: response.data || [] };
  }

  /**
   * Đặt thuộc tính thiết bị
   */
  async set_devices_prop(device: MijiaDevice): Promise<MijiaAPIResponse> {
    const properties = Object.entries(device.properties).map(([, value]) => ({
      did: device.id,
      siid: 2,
      piid: 1,
      value: value
    }));

    const response = await this.request('/miotspec/prop/set', {
      method: 'POST',
      body: JSON.stringify({
        params: properties
      })
    });

    // Python API trả về trực tiếp array, không phải object
    return { success: response.success, data: response.data || [] };
  }

  /**
   * Thực thi hành động trên thiết bị
   */
  async run_action(actionData: MijiaDeviceAction): Promise<MijiaAPIResponse> {
    const response = await this.request('/miotspec/action', {
      method: 'POST',
      body: JSON.stringify({
        params: {
          did: actionData.device_id,
          siid: 2,
          aiid: 1,
          value: actionData.params
        }
      })
    });

    // Python API trả về trực tiếp object, không phải wrapper
    return { success: response.success, data: response.data || {} };
  }

  /**
   * Lấy thông tin thiết bị theo tên
   */
  async get_device_by_name(dev_name: string): Promise<MijiaAPIResponse<MijiaDevice | null>> {
    const devicesResponse = await this.get_devices_list();
    if (!devicesResponse.success || !devicesResponse.data) {
      return { success: false, error: 'Failed to get devices' };
    }

    const device = devicesResponse.data.find(d => d.name === dev_name);
    return { success: true, data: device || null };
  }

  async get_device_by_id(device_id: string): Promise<MijiaAPIResponse<MijiaDevice | null>> {
    const devicesResponse = await this.get_devices_list();
    if (!devicesResponse.success || !devicesResponse.data) {
      return { success: false, error: 'Failed to get devices' };
    }

    const device = devicesResponse.data.find(d => d.id === device_id);
    return { success: true, data: device || null };
  }

  /**
   * Cập nhật thiết bị
   */
  async update_device(deviceUpdate: MijiaDeviceUpdate): Promise<MijiaAPIResponse> {
    const deviceResponse = await this.get_device_by_id(deviceUpdate.device_id);
    if (!deviceResponse.success || !deviceResponse.data) {
      return { success: false, error: 'Device not found' };
    }

    const device = deviceResponse.data;
    device.properties = { ...device.properties, ...deviceUpdate.properties };

    const response = await this.set_devices_prop(device);
    return response;
  }
}

export const mijiaAPI = new MijiaAPI();
