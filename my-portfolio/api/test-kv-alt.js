import { Redis } from '@upstash/redis';

export default async function handler(request, response) {
  try {
    // 尝试使用 fromEnv() 方法（期望 UPSTASH_REDIS_REST_URL 和 UPSTASH_REDIS_REST_TOKEN）
    let redis;

    // 方法1：使用 fromEnv()
    try {
      redis = Redis.fromEnv();
      console.log('Using Redis.fromEnv() - success');
    } catch (envError) {
      console.log('Redis.fromEnv() failed:', envError.message);

      // 方法2：手动设置环境变量映射
      process.env.UPSTASH_REDIS_REST_URL = process.env.KV_REST_API_URL;
      process.env.UPSTASH_REDIS_REST_TOKEN = process.env.KV_REST_API_TOKEN;

      redis = Redis.fromEnv();
      console.log('Using mapped environment variables - success');
    }

    // 测试连接
    const testKey = 'test:alt-connection';
    const testValue = {
      message: 'Alternative Redis connection successful!',
      timestamp: new Date().toISOString(),
      method: 'fromEnv with mapping',
    };

    await redis.set(testKey, JSON.stringify(testValue));
    const retrievedValue = await redis.get(testKey);

    return response.status(200).json({
      success: true,
      message: 'Alternative Redis connection test successful',
      data: {
        written: testValue,
        retrieved: retrievedValue,
        connectionTime: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Alternative Redis connection error:', error);

    return response.status(500).json({
      success: false,
      message: 'Alternative Redis connection failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
