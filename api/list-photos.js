// /api/list-photos.js
// Returns all uploaded gallery photos (with captions), newest first.

import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { blobs } = await list({ prefix: 'gallery-meta/' });

    const photos = await Promise.all(
      blobs.map(async (b) => {
        try {
          const resp = await fetch(b.url);
          const data = await resp.json();
          return { ...data, uploadedAtMs: new Date(data.uploadedAt).getTime() };
        } catch {
          return null;
        }
      })
    );

    const valid = photos.filter(Boolean).sort((a, b) => b.uploadedAtMs - a.uploadedAtMs);

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    return res.status(200).json({ photos: valid });
  } catch (err) {
    console.error('List photos error:', err);
    return res.status(500).json({ error: 'Failed to list photos', photos: [] });
  }
}
