import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

// Mijia API constants
const SID = 'xiaomiio';
const MSG_URL = `https://account.xiaomi.com/pass/serviceLogin?sid=${SID}&_json=true`;
const QR_URL = 'https://account.xiaomi.com/longPolling/loginUrl';
const ACCOUNT_URL = 'https://account.xiaomi.com/pass2/profile/home?bizFlag=&userId=';
const DEFAULT_UA = 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36 Edg/126.0.0.0';

// In-memory storage for QR sessions (in production, use Redis or database)
interface QRSession {
  id: string;
  status: 'pending' | 'scanned' | 'confirmed' | 'expired';
  createdAt: number;
  expiresAt: number;
  token?: string;
  user?: {
    id: string;
    username: string;
    avatar?: string | null;
    accountInfo?: Record<string, unknown>;
  };
  deviceId?: string;
  session?: Record<string, unknown>;
  loginUrl?: string;
  lpUrl?: string;
}

const qrSessions = new Map<string, QRSession>();

// Clean up expired sessions
setInterval(() => {
  const now = Date.now();
  for (const [key, session] of qrSessions.entries()) {
    if (session.expiresAt < now) {
      qrSessions.delete(key);
    }
  }
}, 60000); // Clean up every minute

// Generate random device ID
function generateDeviceId(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Get index data from Xiaomi
async function getIndexData(deviceId: string): Promise<{
  deviceId: string;
  qs: string;
  _sign: string;
  callback: string;
  location: string;
}> {
  const response = await fetch(MSG_URL, {
    headers: {
      'User-Agent': DEFAULT_UA,
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Cookie': `deviceId=${deviceId}; sdkVersion=3.4.1`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get index data: ${response.status}`);
  }

  const text = await response.text();
  console.log('🔍 Attempting to get real Xiaomi QR URL...');
  console.log('📄 Index response length:', text.length);
  console.log('🔍 Raw response preview:', text.substring(0, 200));
  
  // Parse JSON with proper error handling
  let retData;
  try {
    // Handle different response formats
    if (text.startsWith('&&&START&&&')) {
      console.log('🔍 JSON match result: Found &&&START&&&');
      retData = JSON.parse(text.substring(11));
    } else {
      console.log('🔍 JSON match result: Not found');
      retData = JSON.parse(text);
    }
  } catch (parseError) {
    console.log('❌ Failed to parse JSON response, full response:', text);
    throw new Error('Failed to parse index response');
  }

  // Check if the API returned an error
  if (retData.code !== 0) {
    console.log('❌ Xiaomi API returned error:', {
      code: retData.code,
      description: retData.description || retData.desc,
      result: retData.result
    });
    throw new Error(`Xiaomi API error: ${retData.description || retData.desc || 'Unknown error'} (code: ${retData.code})`);
  }
  
  return {
    deviceId,
    qs: retData.qs,
    _sign: retData._sign,
    callback: retData.callback,
    location: retData.location
  };
}

// Get QR login URL
async function getQRLoginUrl(data: {
  deviceId: string;
  qs: string;
  _sign: string;
  callback: string;
  location: string;
}): Promise<{
  loginUrl: string;
  lpUrl: string;
}> {
  // Parse serviceParam from location URL more carefully
  let serviceParam = '';
  try {
    const url = new URL(data.location);
    serviceParam = url.searchParams.get('serviceParam') || '';
  } catch (error) {
    console.warn('Failed to parse location URL, using empty serviceParam:', error);
  }

  const params = new URLSearchParams({
    '_qrsize': '240',
    'qs': data.qs,
    'bizDeviceType': '',
    'callback': data.callback,
    '_json': 'true',
    'theme': '',
    'sid': SID,
    'needTheme': 'false',
    'showActiveX': 'false',
    'serviceParam': serviceParam,
    '_local': 'zh_CN',
    '_sign': data._sign,
    '_dc': Date.now().toString()
  });

  console.log('QR URL params:', Object.fromEntries(params));

  const response = await fetch(`${QR_URL}?${params}`, {
    headers: {
      'User-Agent': DEFAULT_UA,
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Cookie': `deviceId=${data.deviceId}; sdkVersion=3.4.1`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get QR URL: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  console.log('QR URL response:', text.substring(0, 200) + '...');
  
  let retData;
  try {
    retData = JSON.parse(text.substring(11));
  } catch {
    console.error('Failed to parse QR response:', text);
    throw new Error('Invalid response format from QR API');
  }
  
  if (retData.code !== 0) {
    console.error('QR API error:', retData);
    throw new Error(`QR URL error: ${retData.desc || 'Unknown error'}`);
  }

  return {
    loginUrl: retData.loginUrl,
    lpUrl: (retData as { lp: string }).lp
  };
}

export async function POST() {
  try {
    console.log('🚀 ===== QR CODE GENERATION START =====');
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    const qrId = uuidv4();
    const deviceId = generateDeviceId();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    
    console.log('📱 Generated QR ID:', qrId);
    console.log('🔧 Generated Device ID:', deviceId);
    console.log('⏳ Expires at:', new Date(expiresAt).toISOString());
    
    let qrData;
    let isRealAPI = true;
    
    try {
      // Try to get real data from Xiaomi API
      const indexData = await getIndexData(deviceId);
      console.log('✅ Index data retrieved:', {
        qs: indexData.qs?.substring(0, 50) + '...',
        _sign: indexData._sign?.substring(0, 20) + '...',
        callback: indexData.callback,
        location: indexData.location?.substring(0, 50) + '...'
      });
      
      qrData = await getQRLoginUrl(indexData);
      console.log('✅ QR login URL generated successfully');
      console.log('🔗 Login URL length:', qrData.loginUrl?.length);
      console.log('🔗 LP URL length:', qrData.lpUrl?.length);
    } catch (error) {
      console.log('❌ Real Xiaomi API failed:', error);
      console.warn('⚠️  Falling back to demo mode...');
      isRealAPI = false;
      
      // Fallback to demo QR code
      const demoLoginUrl = `https://account.xiaomi.com/pass/serviceLogin?sid=xiaomiio&bizDeviceType=&_qrsize=240&theme=&serviceParam=&_sign=demo_${qrId}&callback=AM.json.cb1&_json=true&needTheme=false&showActiveX=false&_local=zh_CN&_dc=${Date.now()}`;
      qrData = {
        loginUrl: demoLoginUrl,
        lpUrl: null
      };
      console.log('🎭 Demo QR URL generated:', demoLoginUrl);
    }
    
    // Generate QR code image
    console.log('🎨 Generating QR code image...');
    const qrUrl = await QRCode.toDataURL(qrData.loginUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    console.log('✅ QR code image generated, length:', qrUrl.length);
    
    // Store session
    const sessionData: QRSession = {
      id: qrId,
      status: 'pending',
      createdAt: Date.now(),
      expiresAt,
      deviceId,
      loginUrl: qrData.loginUrl,
      lpUrl: qrData.lpUrl || undefined
    };
    
    qrSessions.set(qrId, sessionData);
    
    // If demo mode, auto-confirm after 10 seconds
    if (!isRealAPI) {
      console.log('✅ QR code image generated (demo mode), length:', qrUrl.length);
      console.log('💾 QR session stored (demo mode)');
      console.log('🎭 Setting up demo mode auto-confirm in 10 seconds...');
      setTimeout(() => {
        const session = qrSessions.get(qrId);
        if (session && session.status === 'pending') {
          console.log('🎭 Auto-confirming demo QR session:', qrId);
          session.status = 'confirmed';
          session.token = `demo_token_${qrId}`;
          session.user = {
            id: 'demo_user',
            username: 'ScodeVN Demo User',
            avatar: null
          };
          qrSessions.set(qrId, session);
          console.log('✅ Demo session confirmed successfully');
        }
      }, 10000);
    } else {
      console.log('✅ QR code image generated (real API), length:', qrUrl.length);
      console.log('💾 QR session stored (real API)');
    }
    
    const response = {
      success: true,
      data: {
        qrUrl,
        qrId,
        expiresAt,
        loginUrl: qrData.loginUrl,
        isDemo: !isRealAPI
      }
    };
    
    console.log('✅ QR generation completed successfully');
    console.log('📤 Response data:', {
      qrId: response.data.qrId,
      hasQrUrl: !!response.data.qrUrl,
      hasLoginUrl: !!response.data.loginUrl,
      isDemo: response.data.isDemo
    });
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ QR generation error:', error);
    console.error('🔍 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json({
      success: false,
      error: `Failed to generate QR code: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}

// Check QR login status by polling the long polling URL
async function checkQRLoginStatus(session: QRSession): Promise<{
  status: 'pending' | 'confirmed' | 'expired';
  token?: string;
  user?: {
    id: string;
    username: string;
    avatar?: string | null;
    accountInfo?: Record<string, unknown>;
  };
  authData?: Record<string, unknown>;
}> {
  if (!session.lpUrl) {
    console.log('🔍 No LP URL available for status check');
    return { status: 'pending' };
  }

  try {
    console.log('🔍 Checking QR login status via long polling...');
    console.log('🌐 LP URL:', session.lpUrl);
    
    const response = await fetch(session.lpUrl, {
      method: 'GET',
      headers: {
        'User-Agent': DEFAULT_UA,
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Cookie': `deviceId=${session.deviceId}; sdkVersion=3.4.1`,
        'Connection': 'keep-alive'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    console.log('📥 LP Response status:', response.status);
    console.log('📥 LP Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error('❌ QR status check failed:', response.status);
      return { status: 'pending' };
    }

    const text = await response.text();
    console.log('📄 LP Response text length:', text.length);
    console.log('📄 LP Response text preview:', text.substring(0, 200));
    
    // Parse response (remove callback wrapper if present) - same as Python
    let retData;
    try {
      // Python uses ret.text[11:] to remove callback wrapper
      if (text.startsWith('&&&START&&&')) {
        retData = JSON.parse(text.substring(11));
      } else {
        retData = JSON.parse(text);
      }
      console.log('✅ Parsed LP response:', retData);
    } catch (err) {
      console.error('❌ Failed to parse LP response:', err);
      console.log('📄 Raw response:', text);
      return { status: 'pending' };
    }
    
    if (retData.code !== 0) {
      console.error('❌ QR login failed:', retData.desc || retData.message);
      return { status: 'expired' };
    }

    // Check if login is confirmed - same logic as Python
    if (retData.userId && retData.ssecurity && retData.location) {
      console.log('✅ QR login confirmed, getting final auth data...');
      console.log('📊 Auth data:', {
        userId: retData.userId,
        hasSsecurity: !!retData.ssecurity,
        location: retData.location
      });
      
      // Get final auth data by following the location redirect - same as Python
      const locationResponse = await fetch(retData.location, {
        headers: {
          'User-Agent': DEFAULT_UA,
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'zh-CN,zh;q=0.9',
          'Cookie': `deviceId=${session.deviceId}; sdkVersion=3.4.1`
        }
      });

      console.log('📥 Final response status:', locationResponse.status);
      
      if (!locationResponse.ok) {
        console.error('❌ Final auth request failed:', locationResponse.status);
        return { status: 'pending' };
      }

      // Extract cookies from the response - same as Python
      const cookies = locationResponse.headers.get('set-cookie');
      console.log('🍪 Final auth cookies:', cookies);
      
      const cookieMap: { [key: string]: string } = {};
      
      if (cookies) {
        cookies.split(';').forEach(cookie => {
          const [key, value] = cookie.trim().split('=');
          if (key && value) {
            cookieMap[key] = value;
          }
        });
      }
      
      console.log('🔑 Extracted tokens:', cookieMap);

      // Get account info
      let accountInfo: Record<string, unknown> = {};
      try {
        const accountResponse = await fetch(`${ACCOUNT_URL}${retData.userId}`, {
          headers: {
            'User-Agent': DEFAULT_UA,
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Cookie': `deviceId=${session.deviceId}; sdkVersion=3.4.1`
          }
        });
        
        if (accountResponse.ok) {
          const accountText = await accountResponse.text();
          const accountData = JSON.parse(accountText.substring(11));
          accountInfo = accountData.data || {};
        }
      } catch (error) {
        console.warn('Failed to get account info:', error);
      }

      return {
        status: 'confirmed',
        token: retData.ssecurity, // Use ssecurity as token - same as Python
        user: {
          id: retData.userId,
          username: (accountInfo.nickname as string) || `User_${retData.userId}`,
          avatar: (accountInfo.avatar as string) || null,
          accountInfo
        },
        authData: {
          success: true,
          userId: retData.userId,
          ssecurity: retData.ssecurity,
          deviceId: session.deviceId,
          service_token: cookieMap.serviceToken,
          security_token: retData.ssecurity,
          user_id: retData.userId,
          device_id: session.deviceId,
          cUserId: cookieMap.cUserId,
          expireTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        }
      };
    }

    console.log('⏳ QR login still pending');
    return { status: 'pending' };
  } catch (error) {
    console.error('❌ QR login status check error:', error);
    console.error('🔍 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return { status: 'pending' };
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 ===== QR STATUS CHECK START =====');
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    const { searchParams } = new URL(request.url);
    const qrId = searchParams.get('qr_id');
    
    console.log('📱 Requested QR ID:', qrId);
    
    if (!qrId) {
      console.log('❌ No QR ID provided');
      return NextResponse.json({
        success: false,
        error: 'QR ID is required'
      }, { status: 400 });
    }
    
    const session = qrSessions.get(qrId);
    console.log('🔍 Session found:', !!session);
    
    if (!session) {
      console.log('❌ QR session not found');
      console.log('📊 Current sessions count:', qrSessions.size);
      return NextResponse.json({
        success: false,
        error: 'QR session not found'
      }, { status: 404 });
    }
    
    // Check if expired
    const now = Date.now();
    const isExpired = session.expiresAt < now;
    console.log('⏰ Session expiry check:', {
      now: new Date(now).toISOString(),
      expiresAt: new Date(session.expiresAt).toISOString(),
      isExpired
    });
    
    if (isExpired) {
      console.log('⏰ Session expired, updating status');
      session.status = 'expired';
      qrSessions.set(qrId, session);
      return NextResponse.json({
        success: true,
        data: {
          status: 'expired',
          token: null,
          user: null
        }
      });
    }

    // If still pending, check the actual login status
    if (session.status === 'pending') {
      console.log('🔍 Session is pending, checking login status...');
      try {
        const loginStatus = await checkQRLoginStatus(session);
        console.log('🔍 Login status result:', loginStatus);
        
        if (loginStatus.status === 'confirmed') {
          console.log('✅ Login confirmed, updating session');
          session.status = 'confirmed';
          session.token = loginStatus.token;
          session.user = loginStatus.user;
          qrSessions.set(qrId, session);
          console.log('🔑 Session updated with token and user data');
        }
      } catch (error) {
        console.error('❌ Error checking login status:', error);
      }
    } else {
      console.log('📊 Session status is not pending:', session.status);
    }
    
    const response = {
      success: true,
      data: {
        status: session.status,
        token: session.token,
        user: session.user
      }
    };
    
    console.log('✅ QR status check completed:', {
      qrId,
      status: response.data.status,
      hasToken: !!response.data.token,
      hasUser: !!response.data.user
    });
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ QR status check error:', error);
    console.error('🔍 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check QR status'
    }, { status: 500 });
  }
}

