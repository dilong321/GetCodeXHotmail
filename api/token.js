export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  // Đọc body kiểu raw, cần parse JSON nếu là Vercel Serverless Functions
  let body = req.body;
  if (typeof body === 'string') body = JSON.parse(body);
  const { client_id, refresh_token, client_secret, scope } = body;
  const params = new URLSearchParams({
    client_id,
    refresh_token,
    grant_type: 'refresh_token',
    scope: scope || 'Mail.Read offline_access'
  });
  if (client_secret) params.append('client_secret', client_secret);

  try {
    const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}
