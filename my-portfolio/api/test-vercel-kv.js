import { kv } from '@vercel/kv';

export default async function handler(request, response) {
  try {
    // 测试写入一个简单的键值对
    const testKey = 'test:vercel-kv-connection';
    const testValue = {
      message: 'Vercel KV connection successful!',
      timestamp: new Date().toISOString(),
      userAgent: request.headers['user-agent'] || 'unknown',
    };

    // 写入数据到 Vercel KV
    await kv.set(testKey, testValue);

    // 读取数据验证
    const retrievedValue = await kv.get(testKey);

    // 获取一些基本的 KV 信息
    const keys = await kv.keys('test:*');

    return response.status(200).json({
      success: true,
      message: 'Vercel KV connection test successful',
      data: {
        written: testValue,
        retrieved: retrievedValue,
        testKeys: keys,
        connectionTime: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Vercel KV connection error:', error);

    return response.status(500).json({
      success: false,
      message: 'Vercel KV connection failed',
      error: error.message,
      errorDetails: {
        name: error.name,
        stack: error.stack?.substring(0, 500),
      },
      timestamp: new Date().toISOString(),
    });
  }
}
