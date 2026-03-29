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
      return NextResponse.json({ success: true, downloads: 0 });
    }
    const downloadCount = (await client.get('site:cv-downloads')) || 0;
    return NextResponse.json({
      success: true,
      downloads: parseInt(downloadCount),
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

export async function POST() {
  let client;
  try {
    client = await getClient();
    if (!client) {
      return NextResponse.json({ success: true, downloads: 0 });
    }
    const newCount = await client.incr('site:cv-downloads');
    return NextResponse.json({
      success: true,
      downloads: newCount,
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
