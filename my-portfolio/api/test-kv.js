import { Redis } from '@upstash/redis';

// Initialize Redis with explicit environment variables
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(request, response) {
  try {
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
    console.error('KV connection error:', error);

    return response.status(500).json({
      success: false,
      message: 'Redis connection failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
