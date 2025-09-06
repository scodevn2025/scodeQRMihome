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

// Get index data from Xiaomi - matches Python _get_index method
async function getIndexData(deviceId: string): Promise<{
  deviceId: string;
  qs: string;
  _sign: string;
  callback: string;
  location: string;
}> {
  console.log('🔍 Getting index data from Xiaomi API...');
  console.log('🔧 Device ID:', deviceId);
  console.log('🌐 Request URL:', MSG_URL);
  
  const response = await fetch(MSG_URL, {
    headers: {
      'User-Agent': DEFAULT_UA,
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Cookie': `deviceId=${deviceId}; sdkVersion=3.4.1`
    }
  });

  console.log('📥 Response status:', response.status, response.statusText);
  console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    throw new Error(`Failed to get index data: ${response.status} - ${response.statusText}`);
  }

  const text = await response.text();
  console.log('📄 Index response length:', text.length);
  console.log('📄 Index response preview:', text.substring(0, 200) + '...');
  
  // Parse JSON exactly like Python - ret.text[11:]
  let retData;
  try {
    if (text.startsWith('&&&START&&&')) {
      retData = JSON.parse(text.substring(11));
      console.log('✅ Parsed response with &&&START&&& prefix');
    } else {
      retData = JSON.parse(text);
      console.log('✅ Parsed response without prefix');
    }
  } catch (parseError) {
    console.error('❌ Failed to parse JSON response');
    console.log('📄 Full response:', text);
    throw new Error('Failed to parse index response');
  }

  console.log('📊 Index response data:', {
    code: retData.code,
    hasQs: !!retData.qs,
    hasSign: !!retData._sign,
    hasCallback: !!retData.callback,
    hasLocation: !!retData.location,
    description: retData.description || retData.desc
  });

  // Check if the API returned an error - exactly like Python
  if (retData.code !== 0) {
    const errorMsg = retData.description || retData.desc || 'Unknown error';
    console.error('❌ Xiaomi API returned error:', {
      code: retData.code,
      description: errorMsg,
      result: retData.result
    });
    throw new Error(`Xiaomi API error: ${errorMsg} (code: ${retData.code})`);
  }
  
  // Extract required fields - exactly like Python's data.update()
  const requiredFields = ['qs', '_sign', 'callback', 'location'];
  const result = { deviceId };
  
  for (const field of requiredFields) {
    if (!(field in retData)) {
      throw new Error(`Missing required field in response: ${field}`);
    }
    (result as any)[field] = retData[field];
  }
  
  console.log('✅ Index data extracted successfully:', {
    deviceId,
    qsLength: result.qs?.length,
    signLength: result._sign?.length,
    callback: result.callback,
    locationLength: result.location?.length
  });
  
  return result as {
    deviceId: string;
    qs: string;
    _sign: string;
    callback: string;
    location: string;
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
  // Parse serviceParam from location URL - exactly like Python
  let serviceParam = '';
  try {
    const url = new URL(data.location);
    serviceParam = url.searchParams.get('serviceParam') || '';
    console.log('✅ Extracted serviceParam:', serviceParam?.substring(0, 50) + '...');
  } catch (error) {
    console.warn('❌ Failed to parse location URL for serviceParam:', error);
    serviceParam = '';
  }

  // Use exact parameters from Python mijia-api
  const params = new URLSearchParams({
    '_qrsize': '240',
    'qs': data.qs,
    'bizDeviceType': '',
    'callback': data.callback,
    '_json': 'true',
    'theme': '',
    'sid': 'xiaomiio',
    'needTheme': 'false',
    'showActiveX': 'false',
    'serviceParam': serviceParam,
    '_local': 'zh_CN',
    '_sign': data._sign,
    '_dc': Date.now().toString(),  // Python uses int(time.time() * 1000) which gives milliseconds
  });

  console.log('🔗 QR URL params:', Object.fromEntries(params));
  console.log('🌐 Making QR request to:', `${QR_URL}?${params}`);

  const response = await fetch(`${QR_URL}?${params}`, {
    headers: {
      'User-Agent': DEFAULT_UA,
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Cookie': `deviceId=${data.deviceId}; sdkVersion=3.4.1`
    }
  });

  console.log('📥 QR Response status:', response.status, response.statusText);
  console.log('📋 QR Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    throw new Error(`Failed to get QR URL: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  console.log('📥 QR URL response length:', text.length);
  console.log('📥 QR URL response preview:', text.substring(0, 200) + '...');
  
  let retData;
  try {
    // Python uses ret.text[11:] consistently
    if (text.startsWith('&&&START&&&')) {
      retData = JSON.parse(text.substring(11));
    } else {
      retData = JSON.parse(text);
    }
    console.log('✅ Parsed QR response successfully');
  } catch (error) {
    console.error('❌ Failed to parse QR response:', error);
    console.log('📄 Raw response:', text);
    throw new Error('Invalid response format from QR API');
  }
  
  if (retData.code !== 0) {
    console.error('❌ QR API error:', retData);
    throw new Error(`QR URL error: ${retData.desc || retData.description || 'Unknown error'} (code: ${retData.code})`);
  }

  console.log('✅ QR URLs generated:', {
    hasLoginUrl: !!retData.loginUrl,
    hasLpUrl: !!retData.lp,
    loginUrlLength: retData.loginUrl?.length,
    lpUrlLength: retData.lp?.length,
    loginUrlPreview: retData.loginUrl?.substring(0, 100) + '...',
    lpUrlPreview: retData.lp?.substring(0, 100) + '...'
  });

  return {
    loginUrl: retData.loginUrl,
    lpUrl: retData.lp
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
      console.error('🔍 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        isNetworkError: error instanceof Error && error.message.includes('fetch failed'),
        isDNSError: error instanceof Error && error.message.includes('ENOTFOUND')
      });
      
      // Check if this is a network/DNS issue (common in development environments)
      if (error instanceof Error && (error.message.includes('ENOTFOUND') || error.message.includes('fetch failed'))) {
        return NextResponse.json({
          success: false,
          error: 'Unable to connect to Xiaomi servers. This is likely due to network restrictions or DNS blocking in this environment. For real QR code generation, ensure the server can access account.xiaomi.com',
          details: {
            issue: 'Network connectivity to account.xiaomi.com is blocked',
            solution: 'Configure network/firewall to allow access to Xiaomi domains',
            note: 'QR codes generated without real Xiaomi API access will not work with MiHome app'
          }
        }, { status: 503 });
      }
      
      // Return error for other types of API failures
      return NextResponse.json({
        success: false,
        error: `Unable to generate authentic QR code: ${error instanceof Error ? error.message : 'Xiaomi API unavailable'}`
      }, { status: 503 });
    }
    
    // Generate QR code image - match Python QRCode settings exactly
    console.log('🎨 Generating QR code image...');
    const qrUrl = await QRCode.toDataURL(qrData.loginUrl, {
      width: 240,
      margin: 1,  // Python uses border=1
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M',  // Python QRCode default
      type: 'image/png',
      quality: 0.92,
      rendererOpts: {
        quality: 0.92
      }
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
    
    console.log('✅ QR code image generated (real API), length:', qrUrl.length);
    console.log('💾 QR session stored (real API)');
    
    const response = {
      success: true,
      data: {
        qrUrl,
        qrId,
        expiresAt,
        loginUrl: qrData.loginUrl,
        isDemo: false  // Always real API now
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

// Check QR login status by polling the long polling URL - matches Python implementation
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
    
    // Simple GET request with timeout - exactly like Python
    const response = await fetch(session.lpUrl, {
      method: 'GET',
      headers: {
        'User-Agent': DEFAULT_UA,
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Cookie': `deviceId=${session.deviceId}; sdkVersion=3.4.1`,
        'Connection': 'keep-alive'  // Match Python headers
      },
      signal: AbortSignal.timeout(60000) // 60 second timeout like Python
    });

    console.log('📥 LP Response status:', response.status);

    if (!response.ok) {
      console.error('❌ QR status check failed:', response.status);
      return { status: 'pending' };
    }

    const text = await response.text();
    console.log('📄 LP Response text length:', text.length);
    console.log('📄 LP Response preview:', text.substring(0, 200) + '...');
    
    // Parse response - exactly like Python (ret.text[11:])
    let retData;
    try {
      if (text.startsWith('&&&START&&&')) {
        retData = JSON.parse(text.substring(11));
      } else {
        retData = JSON.parse(text);
      }
      console.log('✅ Parsed LP response:', {
        code: retData.code,
        hasUserId: !!retData.userId,
        hasSsecurity: !!retData.ssecurity,
        hasLocation: !!retData.location
      });
    } catch (err) {
      console.error('❌ Failed to parse LP response:', err);
      console.log('📄 Raw response:', text);
      return { status: 'pending' };
    }
    
    if (retData.code !== 0) {
      console.error('❌ QR login failed:', retData.desc || retData.description || retData.message);
      return { status: 'expired' };
    }

    // Check if login is confirmed - exactly like Python
    if (retData.userId && retData.ssecurity && retData.location) {
      console.log('✅ QR login confirmed, getting final auth data...');
      console.log('📊 Auth data:', {
        userId: retData.userId,
        hasSsecurity: !!retData.ssecurity,
        locationPreview: retData.location?.substring(0, 50) + '...'
      });
      
      // Get final auth data by following the location redirect - exactly like Python
      const locationResponse = await fetch(retData.location, {
        headers: {
          'User-Agent': DEFAULT_UA,
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'zh-CN,zh;q=0.9',
          'Cookie': `deviceId=${session.deviceId}; sdkVersion=3.4.1`
        }
      });

      console.log('📥 Location response status:', locationResponse.status);
      
      if (!locationResponse.ok) {
        console.error('❌ Final auth request failed:', locationResponse.status);
        return { status: 'pending' };
      }

      // Extract cookies from the response - like Python's session.cookies.get_dict()
      const setCookieHeaders = locationResponse.headers.get('set-cookie');
      console.log('🍪 Set-Cookie headers:', setCookieHeaders);
      
      const cookieMap: { [key: string]: string } = {};
      
      if (setCookieHeaders) {
        // Parse multiple Set-Cookie headers
        setCookieHeaders.split(',').forEach(cookieString => {
          const cookies = cookieString.split(';');
          cookies.forEach(cookie => {
            const [key, value] = cookie.trim().split('=');
            if (key && value) {
              cookieMap[key] = value;
            }
          });
        });
      }
      
      console.log('🔑 Extracted cookies:', Object.keys(cookieMap));

      // Get account info - like Python
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
          console.log('📊 Account response length:', accountText.length);
          // Python uses ret.text[11:] for account info too
          if (accountText.startsWith('&&&START&&&')) {
            const accountData = JSON.parse(accountText.substring(11));
            accountInfo = accountData.data || {};
          } else {
            const accountData = JSON.parse(accountText);
            accountInfo = accountData.data || {};
          }
          console.log('✅ Account info retrieved:', {
            hasNickname: !!(accountInfo.nickname),
            hasAvatar: !!(accountInfo.avatar)
          });
        }
      } catch (error) {
        console.warn('⚠️  Failed to get account info:', error);
      }

      // Build auth data exactly like Python
      const authData = {
        userId: retData.userId,
        ssecurity: retData.ssecurity,
        deviceId: session.deviceId,
        serviceToken: cookieMap.serviceToken,
        cUserId: cookieMap.cUserId,
        expireTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      };

      console.log('🔑 Final auth data built:', {
        hasUserId: !!authData.userId,
        hasSsecurity: !!authData.ssecurity,
        hasServiceToken: !!authData.serviceToken,
        hasCUserId: !!authData.cUserId
      });

      return {
        status: 'confirmed',
        token: retData.ssecurity, // Use ssecurity as token - exactly like Python
        user: {
          id: retData.userId,
          username: (accountInfo.nickname as string) || `User_${retData.userId}`,
          avatar: (accountInfo.avatar as string) || null,
          accountInfo
        },
        authData
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

