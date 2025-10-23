// src/app/api/graphql/route.ts
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

export const runtime = 'nodejs'; // ensure Node runtime, not edge

const UPSTREAM = process.env.WP_GRAPHQL_URL ?? 'https://cms.robwolfenden.com/graphql';
const HEADERS = { 'content-type': 'application/json' as const };

export async function POST(req: Request) {
  const body = await req.text();

  try {
    const r = await fetch(UPSTREAM, {
      method: 'POST',
      headers: HEADERS,
      body,
      // 10s safety timeout so dev doesn’t hang forever
      signal: AbortSignal.timeout(10_000),
      cache: 'no-store',
    });

    const text = await r.text();
    return new Response(text, {
      status: r.status,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err: any) {
    const detail = err?.cause?.code || err?.code || err?.message || 'unknown';
    console.error('GraphQL proxy error:', detail);
    return new Response(
      JSON.stringify({ error: 'Upstream fetch failed', detail }),
      { status: 502, headers: { 'content-type': 'application/json' } }
    );
  }
}

export async function GET() {
  return new Response(JSON.stringify({ ok: true, upstream: UPSTREAM }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}