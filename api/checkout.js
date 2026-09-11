import DodoPayments from 'dodopayments';

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rank, brandName, url, tagline, bidAmountUSD, returnUrl } = req.body || {};

    if (!bidAmountUSD || bidAmountUSD <= 0) {
      return res.status(400).json({ error: 'Valid bid amount is required' });
    }

    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    const mode = process.env.DODO_PAYMENTS_MODE || (apiKey?.startsWith('test_') ? 'test_mode' : 'live_mode');
    const productId = process.env.DODO_PRODUCT_ID || 'pdt_0NnMDvs4DmKQ0QN5rReBn';

    // If real Dodo Payments API key is provided, create real checkout session
    if (apiKey) {
      const client = new DodoPayments({
        bearerToken: apiKey,
        environment: mode === 'live_mode' ? 'live_mode' : 'test_mode',
      });

      // Amount in cents
      const amountInCents = Math.round(Number(bidAmountUSD) * 100);

      const session = await client.checkoutSessions.create({
        product_cart: [
          {
            product_id: productId,
            quantity: 1,
            amount: amountInCents,
          },
        ],
        return_url: returnUrl || 'https://tinyspot.lol',
        metadata: {
          rank: String(rank),
          brandName: String(brandName || ''),
          url: String(url || ''),
          tagline: String(tagline || ''),
        },
      });

      return res.status(200).json({
        success: true,
        checkout_url: session.checkout_url,
        session_id: session.session_id,
        mode,
      });
    }

    // Graceful fallback for local development or demo before user adds live Dodo key
    return res.status(200).json({
      success: true,
      simulated: true,
      message: 'Dodo Payments simulation active. Add DODO_PAYMENTS_API_KEY in Vercel to activate live checkout.',
      bidAmountUSD,
      rank,
      brandName,
    });
  } catch (error) {
    console.error('Dodo Payments Checkout Error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to initialize Dodo Payments session',
    });
  }
}
