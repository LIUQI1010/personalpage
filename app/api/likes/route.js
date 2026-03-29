import { createClient } from 'redis';
import { NextResponse } from 'next/server';

async function getClient() {
  if (!process.env.kv_REDIS_URL) return null;
  const client = createClient({ url: process.env.kv_REDIS_URL });
  await client.connect();
  return client;
}

export async function GET() {
  let client;
  try {
    client = await getClient();
    if (!client) {
      return NextResponse.json({ success: true, likes: 0 });
    }
    const likeCount = (await client.get('site:likes')) || 0;
    return NextResponse.json({
      success: true,
      likes: parseInt(likeCount),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Redis error:', error);
    return NextResponse.json(
      { success: false, message: 'Database error', error: error.message },
      { status: 500 },
    );
  } finally {
    if (client?.isOpen) await client.disconnect();
  }
}

export async function POST(request) {
  let client;
  try {
    client = await getClient();
    if (!client) {
      return NextResponse.json({ success: true, likes: 0 });
    }
    const userIP =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const cooldownKey = `cooldown:${userIP}`;
    const lastClick = await client.get(cooldownKey);

    if (lastClick) {
      const timeDiff = Date.now() - parseInt(lastClick);
      if (timeDiff < 60000) {
        return NextResponse.json(
          {
            success: false,
            message: 'Rate limited',
            remainingTime: Math.ceil((60000 - timeDiff) / 1000),
            timestamp: new Date().toISOString(),
          },
          { status: 429 },
        );
      }
    }

    const newLikeCount = await client.incr('site:likes');
    await client.setEx(cooldownKey, 60, Date.now().toString());

    const logKey = `like_log:${Date.now()}`;
    await client.setEx(
      logKey,
      86400,
      JSON.stringify({
        ip: userIP,
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get('user-agent') || 'unknown',
      }),
    );

    return NextResponse.json({
      success: true,
      likes: newLikeCount,
      message: 'Like recorded',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Redis error:', error);
    return NextResponse.json(
      { success: false, message: 'Database error', error: error.message },
      { status: 500 },
    );
  } finally {
    if (client?.isOpen) await client.disconnect();
  }
}
