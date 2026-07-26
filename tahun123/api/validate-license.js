// Vercel Serverless Function - sahkan kod lesen di SERVER (bukan client), supaya
// rahsia (MMA_LICENSE_SECRET) tak pernah terdedah dalam kod JS yang dihantar ke browser.
// Set MMA_LICENSE_SECRET di Vercel Project Settings -> Environment Variables.
const { validateKey } = require('../lib/license-algo');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const secret = process.env.MMA_LICENSE_SECRET;
  if (!secret) {
    res.status(500).json({ ok: false, error: 'Server belum dikonfigurasi (MMA_LICENSE_SECRET tiada)' });
    return;
  }

  const key = (req.body && req.body.key) || '';
  if (validateKey(key, secret)) {
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ ok: false, error: 'Kod lesen tidak sah' });
  }
};
