// src/app/api/graphql/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const { isEnabled } = await draftMode();

  // No async headers() here—use the request headers directly
  const shouldIncludeDrafts =
    isEnabled || process.env.SHOW_DRAFTS_LOCAL === 'true';

  const headersOut: Record<string, string> = { 'Content-Type': 'application/json' };
  if (shouldIncludeDrafts && process.env.WP_USER && process.env.WP_APP_PW) {
    const token = Buffer.from(
      `${process.env.WP_USER}:${process.env.WP_APP_PW}`
    ).toString('base64');
    headersOut.Authorization = `Basic ${token}`;
  }

  const upstream = await fetch(process.env.WP_GRAPHQL_URL!, {
    method: 'POST',
    headers: headersOut,
    body,
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: { 'content-type': 'application/json' },
  });
}