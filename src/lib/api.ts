import { ApiResponse, QRLoginResponse, QRStatusResponse, Device, DeviceAction } from '@/types';
import { mijiaAPI, mijiaAuth } from '@/lib/mijia';

const API_BASE = process.env.NODE_ENV === 'production' ? '' : '';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      console.log('🌐 API Client: Making request to:', `${API_BASE}/api${endpoint}`);
      console.log('📤 API Client: Request options:', {
        method: options.method || 'GET',
        headers: options.headers
      });
      
      const response = await fetch(`${API_BASE}/api${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log('📥 API Client: Response received:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      const data = await response.json();
      console.log('📊 API Client: Response data:', {
        success: data.success,
        hasData: !!data.data,
        error: data.error
      });
      
      return data;
    } catch (error) {
      console.error('❌ API Client: Request error:', error);
      console.error('🔍 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return {
        success: false,
        error: 'Network error occurred'
      };
    }
  }


  // Auth methods
  async generateQR(): Promise<ApiResponse<QRLoginResponse>> {
    console.log('🌐 API Client: Generating QR code...');
    try {
      const result = await this.request<QRLoginResponse>('/auth/qr', {
      method: 'POST',
    });
      console.log('✅ API Client: QR generation result:', {
        success: result.success,
        hasData: !!result.data,
        error: result.error
      });
      return result;
    } catch (error) {
      console.error('❌ API Client: QR generation error:', error);
      return {
        success: false,
        error: 'Failed to generate QR code'
      };
    }
  }

  async checkQRStatus(qrId: string): Promise<ApiResponse<QRStatusResponse>> {
    console.log('🔍 API Client: Checking QR status for ID:', qrId);
    try {
      const result = await this.request<QRStatusResponse>(`/auth/qr?qr_id=${qrId}`);
      console.log('📥 API Client: QR status result:', {
        success: result.success,
        status: result.data?.status,
        hasToken: !!result.data?.token,
        hasUser: !!result.data?.user,
        error: result.error
      });
      return result;
    } catch (error) {
      console.error('❌ API Client: QR status check error:', error);
      return {
        success: false,
        error: 'Failed to check QR status'
      };
    }
  }

  // Device methods - sử dụng Mijia TypeScript API
  async getDevices(): Promise<ApiResponse<Device[]>> {
    try {
      // Gọi Mijia API để lấy tất cả thiết bị bao gồm thiết bị được chia sẻ
      const response = await mijiaAPI.get_all_devices();
      
      if (response.success && response.data) {
        // Chuyển đổi dữ liệu từ Mijia API sang format của ứng dụng
        const devices: Device[] = response.data.map((device: any) => ({
          id: device.did || device.id,
          name: device.name || 'Unknown Device',
          type: this.mapDeviceType(device.model),
          model: device.model || 'unknown',
          online: device.is_online || false,
          properties: device.properties || {},
          room: device.room_name || 'Unknown Room'
        }));
        
        return {
          success: true,
          data: devices
        };
      } else {
        // Fallback to mock data if Mijia API fails
        const mockDevices: Device[] = [
          {
            id: 'mock-device-1',
            name: 'Mock Light',
            type: 'light',
            model: 'yeelink.light.lamp4',
            online: true,
            properties: {
              on: true,
              brightness: 80,
              colorTemperature: 4000
            },
            room: 'Living Room'
          },
          {
            id: 'mock-device-2', 
            name: 'Mock Sensor',
            type: 'sensor',
            model: 'miaomiaoce.sensor_ht.t1',
            online: true,
            properties: {
              temperature: 25.5,
              humidity: 60
            },
            room: 'Bedroom'
          }
        ];
        
        return {
          success: true,
          data: mockDevices
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get devices'
      };
    }
  }

  private mapDeviceType(model: string): string {
    if (!model) return 'unknown';
    
    const modelLower = model.toLowerCase();
    if (modelLower.includes('light') || modelLower.includes('lamp')) return 'light';
    if (modelLower.includes('sensor') || modelLower.includes('ht')) return 'sensor';
    if (modelLower.includes('camera')) return 'camera';
    if (modelLower.includes('speaker')) return 'speaker';
    if (modelLower.includes('switch')) return 'switch';
    if (modelLower.includes('plug')) return 'plug';
    
    return 'unknown';
  }

  async getHomes(): Promise<ApiResponse<any[]>> {
    console.log('🔍 API Client: Getting homes from Mijia API...');
    try {
      const response = await mijiaAPI.get_homes_list();
      console.log('📥 Mijia API homes response:', response);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      } else {
        console.log('⚠️ Mijia API failed, using mock data');
        const mockHomes = [
          {
            id: 'mock-home-1',
            name: 'My Home',
            address: '123 Main St',
            roomlist: [
              { id: 'room-1', name: 'Living Room', dids: ['mock-device-1'] },
              { id: 'room-2', name: 'Bedroom', dids: ['mock-device-2'] }
            ]
          }
        ];
        
        return {
          success: true,
          data: mockHomes
        };
      }
    } catch (error) {
      console.error('❌ API Client: Get homes error:', error);
      return {
        success: false,
        error: 'Failed to get homes'
      };
    }
  }

  async getScenes(homeId: string): Promise<ApiResponse<any[]>> {
    console.log('🔍 API Client: Getting scenes for home:', homeId);
    try {
      const response = await mijiaAPI.get_scenes_list(homeId);
      console.log('📥 Mijia API scenes response:', response);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      } else {
        console.log('⚠️ Mijia API failed, using mock data');
        const mockScenes = [
          {
            id: 'scene-1',
            name: 'Good Morning',
            description: 'Turn on lights and open curtains',
            enabled: true,
            homeId: homeId
          },
          {
            id: 'scene-2', 
            name: 'Good Night',
            description: 'Turn off all lights',
            enabled: true,
            homeId: homeId
          }
        ];
        
        return {
          success: true,
          data: mockScenes
        };
      }
    } catch (error) {
      console.error('❌ API Client: Get scenes error:', error);
      return {
        success: false,
        error: 'Failed to get scenes'
      };
    }
  }

  async runScene(sceneId: string): Promise<ApiResponse> {
    console.log('🔍 API Client: Running scene:', sceneId);
    try {
      const response = await mijiaAPI.run_scene(sceneId);
      console.log('📥 Mijia API run scene response:', response);
      
      if (response.success) {
        return {
          success: true,
          data: { message: `Scene ${sceneId} executed successfully` }
        };
      } else {
        return {
          success: false,
          error: response.error || 'Failed to run scene'
        };
      }
    } catch (error) {
      console.error('❌ API Client: Run scene error:', error);
      return {
        success: false,
        error: 'Failed to run scene'
      };
    }
  }

  async getDeviceProperties(deviceId: string): Promise<ApiResponse<any>> {
    console.log('🔍 API Client: Getting device properties for:', deviceId);
    try {
      const response = await mijiaAPI.get_devices_prop({ did: deviceId });
      console.log('📥 Mijia API device properties response:', response);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      } else {
        console.log('⚠️ Mijia API failed, using mock data');
        const mockProperties = {
          on: true,
          brightness: 80,
          colorTemperature: 4000,
          temperature: 25.5,
          humidity: 60
        };
        
        return {
          success: true,
          data: mockProperties
        };
      }
    } catch (error) {
      console.error('❌ API Client: Get device properties error:', error);
      return {
        success: false,
        error: 'Failed to get device properties'
      };
    }
  }

  async updateDevice(deviceId: string, properties: Record<string, any>): Promise<ApiResponse> {
    console.log('🔍 API Client: Updating device:', deviceId, properties);
    try {
      const response = await mijiaAPI.update_device({
        device_id: deviceId,
        properties: properties
      });
      console.log('📥 Mijia API update device response:', response);
      
      if (response.success) {
        return {
          success: true,
          data: { message: `Device ${deviceId} updated successfully` }
        };
      } else {
        return {
          success: false,
          error: response.error || 'Failed to update device'
        };
      }
    } catch (error) {
      console.error('❌ API Client: Update device error:', error);
      return {
        success: false,
        error: 'Failed to update device'
      };
    }
  }

  async executeDeviceAction(deviceId: string, action: DeviceAction): Promise<ApiResponse> {
    console.log('🔍 API Client: Executing device action:', deviceId, action);
    try {
      const response = await mijiaAPI.run_action({
        device_id: deviceId,
        action: action.action || 'set_property',
        params: action.params || []
      });
      console.log('📥 Mijia API execute action response:', response);
      
      if (response.success) {
        return {
          success: true,
          data: { message: `Action ${action.action} executed successfully on device ${deviceId}` }
        };
      } else {
        return {
          success: false,
          error: response.error || 'Failed to execute device action'
        };
      }
    } catch (error) {
      console.error('❌ API Client: Execute device action error:', error);
      return {
        success: false,
        error: 'Failed to execute device action'
      };
    }
  }

  // Mijia login methods
  async loginWithCredentials(username: string, password: string): Promise<ApiResponse> {
    console.log('🔍 API Client: Login with credentials:', username);
    try {
      const response = await mijiaAuth.login(username, password);
      console.log('📥 Mijia Auth login response:', response);
      
      if (response.success) {
        // Set session for mijiaAPI
        mijiaAPI.setSession(response.data);
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          error: response.error || 'Login failed'
        };
      }
    } catch (error) {
      console.error('❌ API Client: Login with credentials error:', error);
      return {
        success: false,
        error: 'Login failed'
      };
    }
  }

  async loginWithQR(): Promise<ApiResponse> {
    console.log('🔍 API Client: Login with QR');
    try {
      const response = await mijiaAuth.QRlogin();
      console.log('📥 Mijia Auth QR login response:', response);
      
      if (response.success) {
        // Set session for mijiaAPI
        mijiaAPI.setSession(response.data);
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          error: response.error || 'QR Login failed'
        };
      }
    } catch (error) {
      console.error('❌ API Client: Login with QR error:', error);
      return {
        success: false,
        error: 'QR Login failed'
      };
    }
  }
}

export const apiClient = new ApiClient();

