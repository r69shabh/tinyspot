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
    const {
      rank,
      brandName,
      url,
      tagline,
      bidAmountUSD,
      logoBg,
      logoText,
      logoUrl,
    } = body;

    const targetRank = Number(rank);
    const amountUSD = Number(bidAmountUSD);

    if (!targetRank || targetRank < 1 || !amountUSD || amountUSD <= 0) {
      return new Response(JSON.stringify({ error: 'Valid rank and bid amount required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const cleanBrand = String(brandName || '').trim() || 'Anonymous Sponsor';
    const cleanUrl = String(url || '').trim().startsWith('http') ? String(url).trim() : `https://${String(url || '').trim()}`;
    const cleanTagline = String(tagline || '').trim() || 'Official sponsor on iPhone Duo';
    const screen = targetRank <= 5 ? 'outside' : 'inside';
    const amountINR = Math.round(amountUSD * 83.3055);

    if (env?.DB) {
      // 1. Check if spot is currently occupied
      const existing = await env.DB.prepare(
        'SELECT brand_name FROM spots WHERE rank = ?'
      ).bind(targetRank).first();

      const previousBrand = existing ? existing.brand_name : null;

      // 2. Shift all spots >= targetRank downwards to make room
      // We order by rank DESC so we don't violate PRIMARY KEY constraints
      const { results: spotsToShift } = await env.DB.prepare(
        'SELECT rank FROM spots WHERE rank >= ? ORDER BY rank DESC'
      ).bind(targetRank).all();

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

      // 3. Insert new spot
      await env.DB.prepare(
        `INSERT OR REPLACE INTO spots (rank, brand_name, url, tagline, logo_bg, logo_text, logo_url, bid_amount_usd, bid_amount_inr, screen, claimed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
      ).bind(
        targetRank,
        cleanBrand,
        cleanUrl,
        cleanTagline,
        logoBg || '#1d1d1f',
        logoText || cleanBrand.slice(0, 2),
        logoUrl || null,
        amountUSD,
        amountINR,
        screen
      ).run();

      // 4. Log activity
      const activityId = `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      await env.DB.prepare(
        `INSERT INTO activity (id, type, rank, brand_name, previous_brand_name, amount_usd, created_at)
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
      ).bind(
        activityId,
        previousBrand ? 'outbid' : 'claim',
        targetRank,
        cleanBrand,
        previousBrand,
        amountUSD
      ).run();

      // Return updated spots
      const { results: allSpots } = await env.DB.prepare(
        'SELECT * FROM spots ORDER BY rank ASC'
      ).all();

      const { results: allActivity } = await env.DB.prepare(
        'SELECT * FROM activity ORDER BY created_at DESC LIMIT 20'
      ).all();

      return new Response(JSON.stringify({
        success: true,
        spots: allSpots,
        activity: allActivity,
      }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Local simulation fallback
    return new Response(JSON.stringify({
      success: true,
      simulated: true,
      spot: {
        rank: targetRank,
        brand_name: cleanBrand,
        url: cleanUrl,
        tagline: cleanTagline,
        bid_amount_usd: amountUSD,
        screen,
      }
    }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error('Error claiming spot in D1:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
