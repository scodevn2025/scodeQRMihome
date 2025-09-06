import { NextRequest, NextResponse } from 'next/server';
import { mijiaAPI } from '@/lib/mijia';

export async function POST(request: NextRequest) {
  try {
    const { sceneId } = await request.json();
    
    if (!sceneId) {
      return NextResponse.json({
        success: false,
        error: 'Scene ID is required'
      }, { status: 400 });
    }
    
    // Thực thi kịch bản thông qua Mijia API
    const response = await mijiaAPI.run_scene(sceneId);
    
    if (response.success) {
      return NextResponse.json({
        success: true,
        data: {
          sceneId,
          result: 'Scene executed successfully',
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: response.error || 'Failed to run scene'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Run scene error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to run scene'
    }, { status: 500 });
  }
}
