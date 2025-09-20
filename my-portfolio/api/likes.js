import { createClient } from 'redis';

export default async function handler(request, response) {
  const client = createClient({ url: process.env.REDIS_URL });
  
  try {
    await client.connect();
    
    const { method } = request;
    const userIP = request.headers['x-forwarded-for'] || request.connection.remoteAddress || 'unknown';
    
    if (method === 'GET') {
      // 获取当前点赞数
      const likeCount = await client.get('site:likes') || 0;
      
      return response.status(200).json({
        success: true,
        likes: parseInt(likeCount),
        timestamp: new Date().toISOString(),
      });
      
    } else if (method === 'POST') {
      // 检查IP是否在冷却期（1分钟限制）
      const cooldownKey = `cooldown:${userIP}`;
      const lastClick = await client.get(cooldownKey);
      
      if (lastClick) {
        const timeDiff = Date.now() - parseInt(lastClick);
        if (timeDiff < 60000) { // 60秒冷却期
          return response.status(429).json({
            success: false,
            message: 'Rate limited',
            remainingTime: Math.ceil((60000 - timeDiff) / 1000),
            timestamp: new Date().toISOString(),
          });
        }
      }
      
      // 增加点赞数
      const newLikeCount = await client.incr('site:likes');
      
      // 设置IP冷却期
      await client.setEx(cooldownKey, 60, Date.now().toString());
      
      // 记录点赞日志（可选，用于分析）
      const logKey = `like_log:${Date.now()}`;
      await client.setEx(logKey, 86400, JSON.stringify({ // 24小时过期
        ip: userIP,
        timestamp: new Date().toISOString(),
        userAgent: request.headers['user-agent'] || 'unknown',
      }));
      
      return response.status(200).json({
        success: true,
        likes: newLikeCount,
        message: 'Like recorded',
        timestamp: new Date().toISOString(),
      });
      
    } else {
      return response.status(405).json({
        success: false,
        message: 'Method not allowed',
      });
    }
    
  } catch (error) {
    console.error('Redis error:', error);
    
    return response.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  } finally {
    if (client && client.isOpen) {
      await client.disconnect();
    }
  }
}
