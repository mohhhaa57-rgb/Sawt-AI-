export async function POST(request) {
  try {
    const body = await request.json();

    const text = body.text;
    const language = body.language || "ar";
    const speed = Number(body.speed) || 1;

    if (!text || !text.trim()) {
      return Response.json(
        { error: "النص فارغ." },
        { status: 400 }
      );
    }

    if (text.length > 500) {
      return Response.json(
        {
          error: "الحد الأقصى للنص هو 500 حرف."
        },
        { status: 400 }
      );
    }

    let voice;
    let model;

    if (language === "ar") {
      voice = "Kareem";
      model = "piper";
    } else {
      voice = "af_bella";
      model = "kokoro";
    }

    const response = await fetch(
      "https://api.tts.ai/v1/tts/",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          model,
          text,
          voice,
          format: "mp3",
          speed,
          language
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          error:
            data.error ||
            "فشل الاتصال بخدمة تحويل النص إلى صوت."
        },
        { status: response.status }
      );
    }

    if (!data.uuid) {
      return Response.json(
        {
          error: "لم يتم إنشاء مهمة الصوت."
        },
        { status: 500 }
      );
    }

    const uuid = data.uuid;

    let result = null;

    for (let i = 0; i < 20; i++) {

      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );

      const resultResponse = await fetch(
        `https://api.tts.ai/v1/speech/results/?uuid=${uuid}`
      );

      result = await resultResponse.json();

      if (result.status === "completed") {
        break;
      }

      if (result.status === "failed") {
        return Response.json(
          {
            error:
              result.error ||
              "فشل إنشاء الصوت."
          },
          { status: 500 }
        );
      }
    }

    if (!result || !result.result_url) {
      return Response.json(
        {
          error:
            "استغرق إنشاء الصوت وقتًا أطول من المتوقع."
        },
        { status: 504 }
      );
    }

    return Response.json({
      audioUrl: result.result_url
    });

  } catch (error) {

    console.error(error);

    return Response.json(
      {
        error:
          "حدث خطأ في الخادم. حاول مرة أخرى."
      },
      { status: 500 }
    );
  }
}
