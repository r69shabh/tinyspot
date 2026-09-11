export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id') || url.searchParams.get('sessionId');

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'session_id parameter is required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!env?.DB) {
      return new Response(JSON.stringify({ status: 'unknown', warning: 'No DB binding' }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    const session = await env.DB.prepare(
      'SELECT session_id, rank, brand_name, url, tagline, bid_amount_usd, logo_bg, logo_text, logo_url, status, created_at FROM checkout_sessions WHERE session_id = ?'
    ).bind(sessionId).first();

    if (!session) {
      return new Response(JSON.stringify({ found: false, status: 'not_found' }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({
      found: true,
      session,
    }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
