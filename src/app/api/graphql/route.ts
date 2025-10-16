// app/api/graphql/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UPSTREAM = process.env.WP_GRAPHQL_URL!;

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function POST(req: Request) {
  const body = await req.text();
  const r = await fetch(UPSTREAM, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });
  return new Response(await r.text(), {
    status: r.status,
    headers: { 'content-type': 'application/json' },
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const body = JSON.stringify({
    query: url.searchParams.get('query'),
    variables: url.searchParams.get('variables'),
  });
  const r = await fetch(UPSTREAM, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });
  return new Response(await r.text(), {
    status: r.status,
    headers: { 'content-type': 'application/json' },
  });
}