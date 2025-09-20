import { Redis } from '@upstash/redis';

export default async function handler(request, response) {
  try {
    // Initialize Redis inside the handler to ensure fresh env vars
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });

    // 添加调试信息
    console.log('Environment check:', {
      url: process.env.KV_REST_API_URL ? 'SET' : 'MISSING',
      token: process.env.KV_REST_API_TOKEN ? 'SET' : 'MISSING',
      urlPreview: process.env.KV_REST_API_URL?.substring(0, 30) + '...',
      tokenPreview: process.env.KV_REST_API_TOKEN?.substring(0, 10) + '...',
    });

    // 测试写入一个简单的键值对
    const testKey = 'test:connection';
    const testValue = {
      message: 'Redis connection successful!',
      timestamp: new Date().toISOString(),
      userAgent: request.headers['user-agent'] || 'unknown',
    };

    // 写入数据到 Redis
    await redis.set(testKey, JSON.stringify(testValue));

    // 读取数据验证
    const retrievedValue = await redis.get(testKey);

    // 获取一些基本的 Redis 信息
    const keys = await redis.keys('test:*');

    return response.status(200).json({
      success: true,
      message: 'Redis connection test successful',
      data: {
        written: testValue,
        retrieved: retrievedValue,
        testKeys: keys,
        connectionTime: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Redis connection error:', error);

    return response.status(500).json({
      success: false,
      message: 'Redis connection failed',
      error: error.message,
      errorDetails: {
        name: error.name,
        stack: error.stack?.substring(0, 500),
      },
      timestamp: new Date().toISOString(),
    });
  }
}
