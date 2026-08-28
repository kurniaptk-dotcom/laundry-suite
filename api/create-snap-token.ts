// Vercel Serverless Function: Secure Midtrans Snap Token Generator
// Uses MIDTRANS_SERVER_KEY safely on server without exposing secrets to frontend

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    return;
  }

  try {
    const { orderId, grossAmount, customerDetails, itemDetails } = req.body || {};

    if (!orderId || !grossAmount) {
      res.status(400).json({ error: 'Missing required parameters: orderId and grossAmount.' });
      return;
    }

    const serverKey = process.env.VITE_MIDTRANS_SERVER_KEY || process.env.MIDTRANS_SERVER_KEY || '';
    const isProduction = process.env.VITE_MIDTRANS_IS_PRODUCTION === 'true';

    // If no real server key is set on Vercel environment, return a secure simulated Snap token
    if (!serverKey || serverKey.startsWith('SB-Mid-server-your')) {
      const simulatedToken = `SNAP-SIM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      res.status(200).json({
        token: simulatedToken,
        redirect_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${simulatedToken}`,
        mode: 'sandbox_simulation'
      });
      return;
    }

    const authHeader = `Basic ${Buffer.from(serverKey + ':').toString('base64')}`;
    const midtransEndpoint = isProduction
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    const payload = {
      transaction_details: {
        order_id: String(orderId),
        gross_amount: Math.round(Number(grossAmount)),
      },
      customer_details: customerDetails || {
        first_name: 'Tenant Owner',
        email: 'billing@laundrysuite.com',
        phone: '081234567890',
      },
      item_details: itemDetails || [
        {
          id: 'ITEM-1',
          price: Math.round(Number(grossAmount)),
          quantity: 1,
          name: 'Langganan Laundry Suite SaaS',
        },
      ],
      credit_card: {
        secure: true,
      },
    };

    const midtransRes = await fetch(midtransEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(payload),
    });

    const data = await midtransRes.json();

    if (!midtransRes.ok) {
      res.status(midtransRes.status).json({
        error: data.error_messages || 'Failed to create Snap token from Midtrans API.',
      });
      return;
    }

    res.status(200).json({
      token: data.token,
      redirect_url: data.redirect_url,
      mode: isProduction ? 'production' : 'sandbox',
    });
  } catch (err: any) {
    console.error('Server error creating snap token:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
}
