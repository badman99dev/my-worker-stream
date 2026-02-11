export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const videoUrl = url.searchParams.get('url');

    if (!videoUrl) {
      return new Response('Bhai, URL missing hai! Kya stream karun? 😂', { status: 400 });
    }

    try {
      // यूजर की Range रिक्वेस्ट को Google तक पहुँचाना (Seek/Skip के लिए)
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
      newHeaders.set("Content-Disposition", "inline");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
    } catch (e) {
      return new Response('Lagg gaye! Error: ' + e.message, { status: 500 });
    }
  }
};
