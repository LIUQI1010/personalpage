import { kv } from '@vercel/kv';

export default async function handler(request, response) {
  try {
    // 测试写入一个简单的键值对
    const testKey = 'test:connection';
    const testValue = {
      message: 'KV connection successful!',
      timestamp: new Date().toISOString(),
      userAgent: request.headers['user-agent'] || 'unknown',
    };

    // 写入数据到 KV
    await kv.set(testKey, testValue);

    // 读取数据验证
    const retrievedValue = await kv.get(testKey);

    // 获取一些基本的 KV 信息
    const keys = await kv.keys('test:*');

    return response.status(200).json({
      success: true,
      message: 'KV Redis connection test successful',
      data: {
        written: testValue,
        retrieved: retrievedValue,
        testKeys: keys,
        connectionTime: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('KV connection error:', error);

    return response.status(500).json({
      success: false,
      message: 'KV Redis connection failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
