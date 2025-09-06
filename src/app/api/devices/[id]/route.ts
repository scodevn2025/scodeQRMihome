import { NextRequest, NextResponse } from 'next/server';
import { mijiaAPI } from '@/lib/mijia';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: deviceId } = await params;
    const body = await request.json();
    
    // Cập nhật thiết bị thông qua Mijia API
    const response = await mijiaAPI.update_device({
      device_id: deviceId,
      properties: body
    });
    
    if (response.success) {
      return NextResponse.json({
        success: true,
        data: {
          deviceId,
          updatedProperties: body,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: response.error || 'Failed to update device'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Device update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update device'
    }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: deviceId } = await params;
    const body = await request.json();
    
    // Thực thi hành động trên thiết bị thông qua Mijia API
    const response = await mijiaAPI.run_action({
      device_id: deviceId,
      action: body.action || 'set_property',
      params: body.params || []
    });
    
    if (response.success) {
      return NextResponse.json({
        success: true,
        data: {
          deviceId,
          action: body,
          result: 'Action executed successfully',
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: response.error || 'Failed to execute device action'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Device action error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to execute device action'
    }, { status: 500 });
  }
}

