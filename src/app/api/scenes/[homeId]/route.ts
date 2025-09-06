import { NextRequest, NextResponse } from 'next/server';
import { mijiaAPI } from '@/lib/mijia';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ homeId: string }> }
) {
  try {
    const { homeId } = await params;
    
    // Lấy danh sách kịch bản từ Mijia API
    const response = await mijiaAPI.get_scenes_list(homeId);
    
    if (response.success && response.data) {
      return NextResponse.json({
        success: true,
        data: response.data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: response.error || 'Failed to fetch scenes from Mijia API'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Get scenes error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch scenes'
    }, { status: 500 });
  }
}
