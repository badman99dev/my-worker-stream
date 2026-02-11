export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const videoUrl = url.searchParams.get('url');

    if (!videoUrl) {
      return new Response('Bhai, Google Link kidhar hai? 😅', { status: 400 });
    }

    try {
      // यूजर के Headers (जैसे Range) को Google को भेजना
      let response = await fetch(videoUrl, {
        headers: {
          'Range': request.headers.get('Range'),
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
        }
      });

      // CORS हेडर सेट करना ताकि प्लेयर में एरर न आए
      let newHeaders = new Headers(response.headers);
      newHeaders.set("Access-Control-Allow-Origin", "*");
      newHeaders.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
      newHeaders.set("Access-Control-Allow-Headers", "Range, Content-Type");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
    } catch (e) {
      return new Response('Error: ' + e.message, { status: 500 });
    }
  }
};
