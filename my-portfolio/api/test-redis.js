import { createClient } from 'redis';

export default async function handler(request, response) {
  let client;
  
  try {
    // 创建 Redis 客户端
    client = createClient({
      url: process.env.REDIS_URL
    });

    // 连接到 Redis
    await client.connect();

    // 测试写入一个简单的键值对
    const testKey = 'test:redis-connection';
    const testValue = {
      message: 'Redis connection successful!',
      timestamp: new Date().toISOString(),
      userAgent: request.headers['user-agent'] || 'unknown',
    };

    // 写入数据到 Redis
    await client.set(testKey, JSON.stringify(testValue));

    // 读取数据验证
    const retrievedValue = await client.get(testKey);

    // 获取一些基本的 Redis 信息
    const keys = await client.keys('test:*');

    return response.status(200).json({
      success: true,
      message: 'Redis connection test successful',
      data: {
        written: testValue,
        retrieved: retrievedValue ? JSON.parse(retrievedValue) : null,
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
  } finally {
    // 确保关闭连接
    if (client && client.isOpen) {
      await client.disconnect();
    }
  }
}
