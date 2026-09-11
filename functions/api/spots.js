export async function onRequestGet(context) {
  const { env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  try {
    if (env?.DB) {
      const { results: spots } = await env.DB.prepare(
        'SELECT * FROM spots ORDER BY rank ASC'
      ).all();

      const { results: activity } = await env.DB.prepare(
        'SELECT * FROM activity ORDER BY created_at DESC LIMIT 20'
      ).all();

      return new Response(JSON.stringify({
        spots: spots || [],
        activity: activity || [],
      }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Fallback if DB binding is not yet active
    return new Response(JSON.stringify({ spots: [], activity: [] }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error('Error fetching spots from D1:', err);
    return new Response(JSON.stringify({ spots: [], activity: [], error: err.message }), {
      status: 200,
      headers: corsHeaders,
    });
  }
}
