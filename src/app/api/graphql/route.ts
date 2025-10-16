// app/api/graphql/route.ts   ← or src/app/api/graphql/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const upstream = process.env.WP_GRAPHQL_URL ?? 'https://cms.robwolfenden.com/graphql';
  const body = await req.text();
  const r = await fetch(upstream, { method: 'POST', headers: { 'content-type': 'application/json' }, body });
  return new Response(await r.text(), { status: r.status, headers: { 'content-type': 'application/json' } });
}

// helpful for quick browser tests
export async function GET(req: Request) {
  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
}