import { createClient } from 'redis';

export default async function handler(request, response) {
  const client = createClient({ url: process.env.kv_REDIS_URL });

  try {
    await client.connect();

    const { method } = request;

    if (method === 'GET') {
      const downloadCount = (await client.get('site:cv-downloads')) || 0;

      return response.status(200).json({
        success: true,
        downloads: parseInt(downloadCount),
        timestamp: new Date().toISOString(),
      });
    } else if (method === 'POST') {
      const newCount = await client.incr('site:cv-downloads');

      return response.status(200).json({
        success: true,
        downloads: newCount,
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
