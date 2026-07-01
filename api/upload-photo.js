// /api/upload-photo.js
// Handles photo uploads from the admin page, storing them in Vercel Blob storage.
// Requires: ADMIN_PASSWORD and BLOB_READ_WRITE_TOKEN environment variables in Vercel.

import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false
  }
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const password = req.headers['x-admin-password'];
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const filename = req.headers['x-filename'] || `photo-${Date.now()}.jpg`;
  const caption = req.headers['x-caption'] ? decodeURIComponent(req.headers['x-caption']) : '';

  try {
    const fileBuffer = await readRawBody(req);

    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({ error: 'No file data received' });
    }

    const safeName = `gallery/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;

    const blob = await put(safeName, fileBuffer, {
      access: 'public',
      addRandomSuffix: false
    });

    // Store caption alongside via a small metadata blob (JSON) so gallery.js can read it
    const metaName = `gallery-meta/${safeName.split('/')[1]}.json`;
    await put(metaName, JSON.stringify({
      url: blob.url,
      caption: caption,
      uploadedAt: new Date().toISOString()
    }), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json'
    });

    return res.status(200).json({ success: true, url: blob.url });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Upload failed', details: err.message });
  }
}
