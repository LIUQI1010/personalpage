export default async function handler(request, response) {
  // 检查环境变量是否存在
  const envVars = {
    KV_REST_API_URL: process.env.KV_REST_API_URL ? 'SET' : 'MISSING',
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? 'SET' : 'MISSING',
    KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN ? 'SET' : 'MISSING',
    KV_URL: process.env.KV_URL ? 'SET' : 'MISSING',
    REDIS_URL: process.env.REDIS_URL ? 'SET' : 'MISSING',
  };

  // 显示 URL 的前几个字符用于验证
  const urlPreview = process.env.KV_REST_API_URL
    ? process.env.KV_REST_API_URL.substring(0, 30) + '...'
    : 'MISSING';

  const tokenPreview = process.env.KV_REST_API_TOKEN
    ? process.env.KV_REST_API_TOKEN.substring(0, 10) + '...'
    : 'MISSING';

  return response.status(200).json({
    message: 'Environment Variables Check',
    environment: process.env.VERCEL_ENV || 'local',
    variables: envVars,
    preview: {
      KV_REST_API_URL: urlPreview,
      KV_REST_API_TOKEN: tokenPreview,
    },
    timestamp: new Date().toISOString(),
  });
}
