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
    const { rank, brandName, name, url, tagline, bidAmountUSD, amountUSD, amount: rawAmount, logoBg, logoText, logoUrl, returnUrl } = body;

    const resolvedBrand = brandName || name || '';
    const amount = Number(bidAmountUSD || amountUSD || rawAmount);
    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Valid bid amount is required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const requestedMode = (body?.mode || env?.DODO_PAYMENTS_MODE || 'live').toLowerCase();
    const apiKey = env?.DODO_PAYMENTS_API_KEY || 'VuHu0EoaUUgLzxl8.6vHnpw_yaIbf6ntsoRzz61zQAW7rcKNLfGbqbCcRWv_7ZVuG';
    const productId = env?.DODO_PRODUCT_ID || 'pdt_0NnO5oC305a42RPnKWtls';
    const isLive = requestedMode !== 'test';
    const endpoint = isLive
      ? 'https://live.dodopayments.com/checkouts'
      : 'https://test.dodopayments.com/checkouts';

    const origin = new URL(request.url).origin;
    const finalReturnUrl = returnUrl || `${origin}/?success=true&rank=${rank}&brand=${encodeURIComponent(resolvedBrand)}`;

    // Dynamic pricing: amount in cents, quantity = 1
    const amountInCents = Math.round(amount * 100);
    const dodoPayload = {
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
          amount: amountInCents,
        },
      ],
      return_url: finalReturnUrl,
      customization: {
        show_order_details: false,
        theme: 'system',
      },
      minimal_address: true,
      metadata: {
        rank: String(rank),
        brandName: String(resolvedBrand),
        url: String(url || ''),
        tagline: String(tagline || ''),
        amountUSD: String(amount),
        logoBg: String(logoBg || '#1d1d1f'),
        logoText: String(logoText || String(resolvedBrand).slice(0, 2)),
        logoUrl: String(logoUrl || ''),
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
      const isUnauthorizedLive = isLive && dodoRes.status === 401;
      const errorMsg = isUnauthorizedLive
        ? 'Dodo Payments Live Mode requires a Live API Key. Switch to Live Mode in app.dodopayments.com and add DODO_PAYMENTS_API_KEY.'
        : (dodoData.message || dodoData.error || 'Failed to create Dodo Payments checkout');

      return new Response(JSON.stringify({
        error: errorMsg,
        details: dodoData,
        isUnauthorizedLive,
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
          String(resolvedBrand),
          String(url || ''),
          String(tagline || ''),
          amount,
          logoBg || '#1d1d1f',
          logoText || String(resolvedBrand).slice(0, 2),
          logoUrl || null
        ).run();
      } catch (dbErr) {
        console.warn('DB session log warning:', dbErr.message);
      }
    }

    // Build mobile-responsive overlay URL (/overlay/session/...)
    const rawUrl = dodoData.checkout_url || '';
    const overlayUrl = rawUrl.includes('/overlay/')
      ? rawUrl
      : rawUrl.replace('/session/', '/overlay/session/');

    return new Response(JSON.stringify({
      success: true,
      checkout_url: overlayUrl || rawUrl,
      raw_checkout_url: rawUrl,
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
