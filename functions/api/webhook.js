export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Webhook-Signature',
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
    const payload = await request.json().catch(() => ({}));
    const eventType = payload.event || payload.type;
    const data = payload.data || {};
    const metadata = data.metadata || {};
    const sessionId = data.session_id || payload.session_id;

    if (!env?.DB) {
      return new Response(JSON.stringify({ success: true, warning: 'No DB binding' }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Process payment success event
    if (eventType === 'payment.succeeded' || eventType === 'checkout.completed') {
      let rank = metadata.rank ? Number(metadata.rank) : null;
      let brandName = metadata.brandName || metadata.name || '';
      let url = metadata.url || '';
      let tagline = metadata.tagline || '';
      let amountUSD = metadata.amountUSD || metadata.bidAmountUSD ? Number(metadata.amountUSD || metadata.bidAmountUSD) : null;
      let logoBg = metadata.logoBg || '#1d1d1f';
      let logoText = metadata.logoText || '';
      let logoUrl = metadata.logoUrl || null;

      // If metadata is incomplete, fallback to checkout_sessions record in D1
      if (sessionId) {
        const sessionRecord = await env.DB.prepare(
          'SELECT * FROM checkout_sessions WHERE session_id = ?'
        ).bind(sessionId).first();

        if (sessionRecord) {
          // Idempotency check: If already marked paid and processed, avoid double rank shifting
          if (sessionRecord.status === 'paid') {
            return new Response(JSON.stringify({ success: true, message: 'Webhook already processed' }), {
              status: 200,
              headers: corsHeaders,
            });
          }

          rank = rank || sessionRecord.rank;
          brandName = brandName || sessionRecord.brand_name;
          url = url || sessionRecord.url;
          tagline = tagline || sessionRecord.tagline;
          amountUSD = amountUSD || sessionRecord.bid_amount_usd;
          logoBg = logoBg || sessionRecord.logo_bg;
          logoText = logoText || sessionRecord.logo_text;
          logoUrl = logoUrl || sessionRecord.logo_url;
        }
      }

      if (!rank || rank < 1 || rank > 20) {
        rank = 1;
      }

      if (!amountUSD || amountUSD <= 0) {
        amountUSD = 20;
      }

      const cleanBrand = String(brandName || '').trim() || 'Verified Sponsor';
      let cleanUrl = String(url || '').trim();
      if (cleanUrl && !/^https?:\/\//i.test(cleanUrl)) {
        cleanUrl = `https://${cleanUrl}`;
      }
      const cleanTagline = String(tagline || '').trim() || 'Official sponsor on iPhone Fold';
      const screen = rank <= 5 ? 'outside' : 'inside';
      const amountINR = Math.round(amountUSD * 83.3055);

      // Check existing occupant
      const existing = await env.DB.prepare(
        'SELECT brand_name FROM spots WHERE rank = ?'
      ).bind(rank).first();
      const previousBrand = existing ? existing.brand_name : null;

      // Shift existing spots down
      const { results: spotsToShift } = await env.DB.prepare(
        'SELECT rank FROM spots WHERE rank >= ? ORDER BY rank DESC'
      ).bind(rank).all();

      if (spotsToShift && spotsToShift.length > 0) {
        for (const s of spotsToShift) {
          const oldRank = s.rank;
          const newRank = oldRank + 1;
          const newScreen = newRank <= 5 ? 'outside' : 'inside';
          await env.DB.prepare(
            'UPDATE spots SET rank = ?, screen = ? WHERE rank = ?'
          ).bind(newRank, newScreen, oldRank).run();
        }
      }

      // Insert new sponsor into spots
      await env.DB.prepare(
        `INSERT OR REPLACE INTO spots (rank, brand_name, url, tagline, logo_bg, logo_text, logo_url, bid_amount_usd, bid_amount_inr, screen, claimed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
      ).bind(
        rank,
        cleanBrand,
        cleanUrl,
        cleanTagline,
        logoBg,
        logoText || cleanBrand.slice(0, 2),
        logoUrl,
        amountUSD,
        amountINR,
        screen
      ).run();

      // Log activity
      const activityId = `act_hook_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      await env.DB.prepare(
        `INSERT INTO activity (id, type, rank, brand_name, previous_brand_name, amount_usd, created_at)
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
      ).bind(
        activityId,
        previousBrand ? 'outbid' : 'claim',
        rank,
        cleanBrand,
        previousBrand,
        amountUSD
      ).run();

      // Mark session as paid
      if (sessionId) {
        await env.DB.prepare(
          "UPDATE checkout_sessions SET status = 'paid' WHERE session_id = ?"
        ).bind(sessionId).run();
      }

      return new Response(JSON.stringify({
        success: true,
        event: eventType,
        rank,
        brandName: cleanBrand,
      }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (eventType === 'payment.failed' && sessionId) {
      await env.DB.prepare(
        "UPDATE checkout_sessions SET status = 'failed' WHERE session_id = ?"
      ).bind(sessionId).run();
    }

    return new Response(JSON.stringify({ success: true, ignoredEvent: eventType }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Webhook failed' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
