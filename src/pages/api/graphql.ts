// src/pages/api/graphql.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST' && req.method !== 'GET') return res.status(405).end();

  const upstream = process.env.WP_GRAPHQL_URL!;
  const body =
    req.method === 'GET'
      ? JSON.stringify({ query: req.query.query, variables: req.query.variables })
      : JSON.stringify(req.body);

  const r = await fetch(upstream, { method: 'POST', headers: { 'content-type': 'application/json' }, body });
  const text = await r.text();

  res.setHeader('content-type', 'application/json');
  res.status(r.status).send(text);
}