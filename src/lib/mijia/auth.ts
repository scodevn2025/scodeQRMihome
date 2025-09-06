// Mijia Authentication - Chuyển đổi từ Python mijiaLogin

import { MijiaSession, MijiaLoginOptions } from './types';

export class MijiaAuth {
  private baseUrl = 'https://account.xiaomi.com';
  private serviceUrl = 'https://api.io.mi.com/app';

  /**
   * Đăng nhập bằng tài khoản/mật khẩu
   */
  async login(username: string, password: string): Promise<MijiaSession> {
    try {
      // Step 1: Lấy captcha và service token
      const captchaResponse = await this.getCaptcha();
      if (!captchaResponse.success) {
        return { success: false, error: 'Failed to get captcha' };
      }

      // Step 2: Đăng nhập với captcha
      const loginResponse = await this.performLogin(username, password, captchaResponse.captcha);
      if (!loginResponse.success) {
        return { success: false, error: 'Login failed' };
      }

      // Step 3: Lấy service token
      const serviceTokenResponse = await this.getServiceToken(loginResponse.token);
      if (!serviceTokenResponse.success) {
        return { success: false, error: 'Failed to get service token' };
      }

      return {
        success: true,
        token: loginResponse.token,
        service_token: serviceTokenResponse.service_token,
        security_token: serviceTokenResponse.security_token,
        user_id: loginResponse.user_id,
        user_name: loginResponse.user_name,
        user_avatar: loginResponse.user_avatar
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Đăng nhập bằng QR code
   */
  async QRlogin(): Promise<MijiaSession> {
    try {
      // Tạo QR code data
      const qrData = {
        qr_id: this.generateQRId(),
        timestamp: Date.now(),
        action: 'login'
      };

      // Trong thực tế, đây sẽ là URL để quét QR
      const qrUrl = `mijia://login?qr_id=${qrData.qr_id}&timestamp=${qrData.timestamp}`;

      // Simulate QR scan và login
      // Trong thực tế, cần polling để check QR status
      return {
        success: true,
        token: `qr_token_${qrData.qr_id}`,
        service_token: `service_token_${qrData.qr_id}`,
        security_token: `security_token_${qrData.qr_id}`,
        user_id: 'qr_user',
        user_name: 'QR User',
        user_avatar: null
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'QR login failed' 
      };
    }
  }

  private async getCaptcha(): Promise<{ success: boolean; captcha?: Record<string, unknown>; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/pass/serviceLoginAuth2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'sid': 'xiaomiio',
          'hash': 'HASH_VALUE', // Cần tính toán hash thực tế
          'callback': 'https://sts.api.io.mi.com/sts',
          'qs': '%3Fsid%3Dxiaomiio%26_json%3Dtrue',
          'user': '',
          '_json': 'true'
        })
      });

      const data = await response.json();
      return { success: true, captcha: data };
    } catch (error) {
      return { success: false, error: 'Failed to get captcha' };
    }
  }

  private async performLogin(username: string, password: string, captcha: Record<string, unknown>): Promise<{ success: boolean; token?: string; user_id?: string; user_name?: string; user_avatar?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/pass/serviceLoginAuth2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'sid': 'xiaomiio',
          'hash': 'HASH_VALUE',
          'callback': 'https://sts.api.io.mi.com/sts',
          'qs': '%3Fsid%3Dxiaomiio%26_json%3Dtrue',
          'user': username,
          'hash': password,
          '_json': 'true',
          ...captcha
        })
      });

      const data = await response.json();
      
      if (data.code === 0) {
        return {
          success: true,
          token: data.token,
          user_id: data.user_id,
          user_name: data.user_name,
          user_avatar: data.user_avatar
        };
      } else {
        return { success: false, error: data.desc || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Login request failed' };
    }
  }

  private async getServiceToken(token: string): Promise<{ success: boolean; service_token?: string; security_token?: string; error?: string }> {
    try {
      const response = await fetch(`${this.serviceUrl}/home/device_list`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          getVirtualModel: false,
          getHuamiDevices: 0
        })
      });

      const data = await response.json();
      
      if (data.code === 0) {
        return {
          success: true,
          service_token: data.service_token,
          security_token: data.security_token
        };
      } else {
        return { success: false, error: 'Failed to get service token' };
      }
    } catch (error) {
      return { success: false, error: 'Service token request failed' };
    }
  }

  private generateQRId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

export const mijiaAuth = new MijiaAuth();
