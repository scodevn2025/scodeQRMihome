import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

// Generate random device ID like Python implementation
function generateDeviceId(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Test endpoint to generate a QR code with proper Xiaomi URL format
// Based on analysis of Python mijia-api implementation
export async function POST() {
  try {
    console.log('🧪 ===== QR TEST GENERATION START =====');
    
    const qrId = uuidv4();
    
    // Generate a realistic Xiaomi login URL format based on Python analysis
    // This is what a real Xiaomi loginUrl typically looks like:
    const timestamp = Date.now();
    const deviceId = generateDeviceId();
    
    // Format based on actual Xiaomi login URLs (reconstructed from Python patterns)
    const loginUrl = `https://account.xiaomi.com/oauth2/authorize?` + new URLSearchParams({
      'client_id': '2882303761517383915',
      'response_type': 'code',
      'scope': 'profile',
      'redirect_uri': 'https://sts.api.io.mi.com/sts',
      'state': `qr_${qrId}_${timestamp}`,
      '_dc': timestamp.toString(),
      'skip_confirm': 'false',
      'display': 'mobile'
    }).toString();

    console.log('🔗 Generated test login URL:', loginUrl);
    
    // Generate QR code with same parameters as production
    const qrUrl = await QRCode.toDataURL(loginUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    
    console.log('✅ Test QR code generated, length:', qrUrl.length);
    
    return NextResponse.json({
      success: true,
      data: {
        qrUrl,
        qrId,
        loginUrl,
        note: 'This is a test QR code based on Xiaomi URL patterns from Python analysis'
      }
    });
  } catch (error) {
    console.error('❌ Test QR generation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate test QR code'
    }, { status: 500 });
  }
}