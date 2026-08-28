// Vercel Serverless Function: Midtrans Webhook Notification Receiver
// Verifies SHA-512 Signature: SHA512(order_id + status_code + gross_amount + ServerKey)

import crypto from 'crypto';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    return;
  }

  try {
    const notification = req.body || {};
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = notification;

    if (!order_id || !status_code || !gross_amount) {
      res.status(400).json({ error: 'Incomplete notification payload.' });
      return;
    }

    const serverKey = process.env.VITE_MIDTRANS_SERVER_KEY || process.env.MIDTRANS_SERVER_KEY || '';

    // Verify SHA-512 signature if server key is configured
    if (serverKey && signature_key) {
      const rawString = `${order_id}${status_code}${gross_amount}${serverKey}`;
      const expectedSignature = crypto.createHash('sha512').update(rawString).digest('hex');

      if (signature_key !== expectedSignature) {
        console.warn(`[SECURITY ALERT] Invalid Midtrans Signature for order ${order_id}. Expected: ${expectedSignature}, Received: ${signature_key}`);
        res.status(403).json({ error: 'Forbidden: Invalid Signature Key.' });
        return;
      }
    }

    console.log(`[MIDTRANS WEBHOOK] Order ${order_id} status: ${transaction_status} (Fraud: ${fraud_status}, Type: ${payment_type})`);

    // Determine final payment outcome
    let isSuccess = false;
    if (transaction_status === 'capture') {
      if (fraud_status === 'challenge') {
        console.log(`Order ${order_id} is challenged by FDS.`);
      } else if (fraud_status === 'accept') {
        isSuccess = true;
      }
    } else if (transaction_status === 'settlement') {
      isSuccess = true;
    } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
      console.log(`Order ${order_id} failed with status: ${transaction_status}`);
    } else if (transaction_status === 'pending') {
      console.log(`Order ${order_id} is pending customer payment.`);
    }

    res.status(200).json({
      status: 'OK',
      order_id,
      payment_verified: isSuccess,
      received_at: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error handling Midtrans webhook:', err);
    res.status(500).json({ error: 'Webhook processing error: ' + err.message });
  }
}
