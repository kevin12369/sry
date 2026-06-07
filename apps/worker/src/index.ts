export default {
  async fetch(req: Request): Promise<Response> {
    if (req.method === 'GET' && new URL(req.url).pathname === '/api/health') {
      return new Response(JSON.stringify({ ok: true, ts: Date.now() }), {
        headers: { 'content-type': 'application/json' },
      });
    }
    return new Response('not found', { status: 404 });
  },
};
