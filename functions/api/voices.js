export async function onRequestGet(context) {
  try {
    const response = await fetch(
      "https://api.elevenlabs.io/v1/voices",
      {
        method: "GET",
        headers: {
          "xi-api-key": context.env.ELEVENLABS_API_KEY
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      return new Response(
        JSON.stringify({
          error: "فشل جلب الأصوات",
          details: errorText
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300"
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "حدث خطأ في الخادم"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}
