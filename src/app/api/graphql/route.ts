// src/app/api/graphql/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  // not strictly needed (same-origin), but avoids noisy preflights
  return new Response(null, { status: 204 });
}

export async function POST(req: Request) {
  const upstream = process.env.WP_GRAPHQL_URL;
  if (!upstream) {
    return new Response('WP_GRAPHQL_URL is not set', { status: 500 });
  }

  // pass through JSON body and optional auth header
  const body = await req.text();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const auth = req.headers.get('authorization');
  if (auth) headers.Authorization = auth;

  const r = await fetch(upstream, { method: 'POST', headers, body });
  const text = await r.text();

  return new Response(text, {
    status: r.status,
    headers: { 'Content-Type': 'application/json' },
  });
}