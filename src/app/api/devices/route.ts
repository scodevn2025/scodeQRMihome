import { NextResponse } from 'next/server';
import { Device } from '@/types';
import { mijiaAPI } from '@/lib/mijia';

export async function GET() {
  try {
    // Lấy danh sách thiết bị từ Mijia API
    const response = await mijiaAPI.get_devices_list();
    
    if (response.success && response.data) {
      // Chuyển đổi dữ liệu từ Mijia format sang format của app
      const devices: Device[] = response.data.map((device: Record<string, unknown>) => ({
        id: device.id,
        name: device.name,
        type: device.type || 'other',
        model: device.model || 'Unknown',
        online: device.online || false,
        properties: device.properties || {},
        homeId: device.home_id || 'default'
      }));

      return NextResponse.json({
        success: true,
        data: devices
      });
    } else {
      return NextResponse.json({
        success: false,
        error: response.error || 'Failed to fetch devices from Mijia API'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Get devices error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch devices'
    }, { status: 500 });
  }
}

