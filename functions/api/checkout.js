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
    const { rank, brandName, url, tagline, bidAmountUSD, logoBg, logoText, logoUrl, returnUrl } = body;

    const amount = Number(bidAmountUSD);
    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Valid bid amount is required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const apiKey = env?.DODO_PAYMENTS_API_KEY || '0sBurbjtawrdLcLg.Q9oitL5QLFBaz4AnTfcZnccjANGl6Cj0iCGIG-T2wLUTA6vF';
    const productId = env?.DODO_PRODUCT_ID || 'pdt_0Nm5UYjiECVXnZNzh0a2X';
    const isLive = env?.DODO_PAYMENTS_MODE === 'live';
    const endpoint = isLive
      ? 'https://live.dodopayments.com/checkouts'
      : 'https://test.dodopayments.com/checkouts';

    const origin = new URL(request.url).origin;
    const finalReturnUrl = returnUrl || `${origin}/?success=true&rank=${rank}&brand=${encodeURIComponent(brandName || '')}`;

    // Product 'pdt_0Nm5UYjiECVXnZNzh0a2X' unit price is $1.00 USD, quantity = amount
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
        error: dodoData.message || dodoData.error || 'Failed to create Dodo Payments checkout',
        details: dodoData,
      }), {
        status: dodoRes.status,
        headers: corsHeaders,
      });
    }

    // Save pending checkout session in D1 if available
    if (env?.DB && dodoData.session_id) {
      try {
        await env.DB.prepare(
          `INSERT OR REPLACE INTO checkout_sessions (session_id, rank, brand_name, url, tagline, bid_amount_usd, logo_bg, logo_text, logo_url, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`
        ).bind(
          dodoData.session_id,
          Number(rank),
          String(brandName || ''),
          String(url || ''),
          String(tagline || ''),
          amount,
          logoBg || '#1d1d1f',
          logoText || String(brandName || '').slice(0, 2),
          logoUrl || null
        ).run();
      } catch (dbErr) {
        console.warn('DB session log warning:', dbErr.message);
      }
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
