export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const text = body.text;
    const voiceId = body.voiceId;

    if (!text || !voiceId) {
      return new Response(
        JSON.stringify({
          error: "النص والصوت مطلوبان"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",

        headers: {
          "xi-api-key": context.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg"
        },

        body: JSON.stringify({
          text: text,

          model_id: "eleven_multilingual_v2",

          output_format: "mp3_44100_128",

          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      return new Response(
        JSON.stringify({
          error: "فشل إنشاء الصوت",
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

    const audio = await response.arrayBuffer();

    return new Response(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store"
      }
    });

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
