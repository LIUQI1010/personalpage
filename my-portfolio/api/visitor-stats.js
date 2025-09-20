import { createClient } from 'redis';
import crypto from 'crypto';

export default async function handler(request, response) {
  const client = createClient({ url: process.env.REDIS_URL });
  
  try {
    await client.connect();
    
    const { method } = request;
    const userIP = request.headers['x-forwarded-for'] || request.connection.remoteAddress || 'unknown';
    
    if (method === 'GET') {
      // 获取总访问量
      const totalVisits = await client.get('site:total_visits') || 0;
      
      return response.status(200).json({
        success: true,
        totalVisits: parseInt(totalVisits),
        timestamp: new Date().toISOString(),
      });
      
    } else if (method === 'POST') {
      // 记录访问
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD格式
      const ipHash = crypto.createHash('md5').update(userIP + 'salt_key_2024').digest('hex');
      
      // 检查今日是否已记录此IP（防止同一用户刷访问量）
      const dailyUVKey = `daily:uv:${today}`;
      const isNewVisitor = await client.sAdd(dailyUVKey, ipHash);
      
      if (isNewVisitor) {
        // 新访客，增加总访问量
        const newTotal = await client.incr('site:total_visits');
        
        // 增加今日PV
        await client.incr(`daily:pv:${today}`);
        
        // 设置每日UV集合过期时间（保留30天）
        await client.expire(dailyUVKey, 30 * 24 * 60 * 60);
        
        // 设置每日PV过期时间（保留30天）
        await client.expire(`daily:pv:${today}`, 30 * 24 * 60 * 60);
        
        // 记录访问日志（可选，7天后删除）
        const logKey = `visit_log:${Date.now()}:${ipHash.substring(0, 8)}`;
        await client.setEx(logKey, 7 * 24 * 60 * 60, JSON.stringify({
          date: today,
          timestamp: new Date().toISOString(),
          userAgent: request.headers['user-agent']?.substring(0, 100) || 'unknown',
        }));
        
        return response.status(200).json({
          success: true,
          message: 'Visit recorded',
          totalVisits: newTotal,
          isNewVisitor: true,
          timestamp: new Date().toISOString(),
        });
      } else {
        // 今日已访问过，返回当前总数但不增加
        const currentTotal = await client.get('site:total_visits') || 0;
        
        return response.status(200).json({
          success: true,
          message: 'Already visited today',
          totalVisits: parseInt(currentTotal),
          isNewVisitor: false,
          timestamp: new Date().toISOString(),
        });
      }
      
    } else {
      return response.status(405).json({
        success: false,
        message: 'Method not allowed',
      });
    }
    
  } catch (error) {
    console.error('Visitor stats error:', error);
    
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
