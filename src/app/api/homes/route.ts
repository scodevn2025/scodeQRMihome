import { NextRequest, NextResponse } from 'next/server';
import { mijiaAPI } from '@/lib/mijia';

export async function GET() {
  try {
    // Lấy danh sách nhà/phòng từ Mijia API
    const response = await mijiaAPI.get_homes_list();
    
    if (response.success && response.data) {
      return NextResponse.json({
        success: true,
        data: response.data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: response.error || 'Failed to fetch homes from Mijia API'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Get homes error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch homes'
    }, { status: 500 });
  }
}
