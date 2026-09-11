export async function onRequestPost(context) {
  const { env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    if (env?.DB) {
      await env.DB.prepare('DELETE FROM spots').run();
      await env.DB.prepare('DELETE FROM activity').run();
      await env.DB.prepare('DELETE FROM checkout_sessions').run();
    }
    return new Response(JSON.stringify({ success: true, message: 'Database reset to scratch (0 spots)' }), {
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
