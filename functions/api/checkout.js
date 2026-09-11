export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const body = await request.json().catch(() => ({}));
    const { rank, brandName, url, tagline, bidAmountUSD, returnUrl } = body;

    const amount = Number(bidAmountUSD);
    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Valid bid amount is required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Use API key provided by user or environment variable
    const apiKey = env?.DODO_PAYMENTS_API_KEY || '0sBurbjtawrdLcLg.Q9oitL5QLFBaz4AnTfcZnccjANGl6Cj0iCGIG-T2wLUTA6vF';
    const productId = env?.DODO_PRODUCT_ID || 'pdt_0Nm5UYjiECVXnZNzh0a2X';
    const isLive = env?.DODO_PAYMENTS_MODE === 'live';
    const endpoint = isLive
      ? 'https://live.dodopayments.com/checkouts'
      : 'https://test.dodopayments.com/checkouts';

    const origin = new URL(request.url).origin;
    const finalReturnUrl = returnUrl || `${origin}/?success=true&rank=${rank}&brand=${encodeURIComponent(brandName || '')}`;

    // Create Dodo Payments checkout session
    // Product 'pdt_0Nm5UYjiECVXnZNzh0a2X' has $1.00 unit price, quantity = amount
    const dodoPayload = {
      product_cart: [
        {
          product_id: productId,
          quantity: Math.max(1, Math.round(amount)),
        },
      ],
      return_url: finalReturnUrl,
      metadata: {
        rank: String(rank),
        brandName: String(brandName || ''),
        url: String(url || ''),
        tagline: String(tagline || ''),
      },
    };

    const dodoRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dodoPayload),
    });

    const dodoData = await dodoRes.json();

    if (!dodoRes.ok) {
      console.error('Dodo Payments API error:', dodoData);
      return new Response(JSON.stringify({
        error: dodoData.message || dodoData.error || 'Failed to create checkout session with Dodo Payments',
        details: dodoData,
      }), {
        status: dodoRes.status,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      checkout_url: dodoData.checkout_url,
      session_id: dodoData.session_id,
      mode: isLive ? 'live' : 'test',
    }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error('Checkout function error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
