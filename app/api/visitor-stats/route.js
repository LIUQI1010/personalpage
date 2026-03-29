import { createClient } from 'redis';
import crypto from 'crypto';
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
      return NextResponse.json({ success: true, totalVisits: 0 });
    }
    const totalVisits = (await client.get('site:total_visits')) || 0;
    return NextResponse.json({
      success: true,
      totalVisits: parseInt(totalVisits),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Visitor stats error:', error);
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
      return NextResponse.json({ success: true, totalVisits: 0, isNewVisitor: false });
    }
    const userIP =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const today = new Date().toISOString().split('T')[0];
    const ipHash = crypto.createHash('md5').update(userIP + 'salt_key_2024').digest('hex');

    const dailyUVKey = `daily:uv:${today}`;
    const isNewVisitor = await client.sAdd(dailyUVKey, ipHash);

    if (isNewVisitor) {
      const newTotal = await client.incr('site:total_visits');
      await client.incr(`daily:pv:${today}`);
      await client.expire(dailyUVKey, 30 * 24 * 60 * 60);
      await client.expire(`daily:pv:${today}`, 30 * 24 * 60 * 60);

      const logKey = `visit_log:${Date.now()}:${ipHash.substring(0, 8)}`;
      await client.setEx(
        logKey,
        7 * 24 * 60 * 60,
        JSON.stringify({
          date: today,
          timestamp: new Date().toISOString(),
          userAgent: request.headers.get('user-agent')?.substring(0, 100) || 'unknown',
        }),
      );

      return NextResponse.json({
        success: true,
        message: 'Visit recorded',
        totalVisits: newTotal,
        isNewVisitor: true,
        timestamp: new Date().toISOString(),
      });
    } else {
      const currentTotal = (await client.get('site:total_visits')) || 0;
      return NextResponse.json({
        success: true,
        message: 'Already visited today',
        totalVisits: parseInt(currentTotal),
        isNewVisitor: false,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Visitor stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Database error', error: error.message },
      { status: 500 },
    );
  } finally {
    if (client?.isOpen) await client.disconnect();
  }
}
