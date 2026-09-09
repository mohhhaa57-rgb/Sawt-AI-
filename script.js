const text = document.getElementById("text");
const counter = document.getElementById("counter");
const voice = document.getElementById("voice");
const speed = document.getElementById("speed");

const generateBtn = document.getElementById("generateBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const errorBox = document.getElementById("error");

const audioPlayer = document.getElementById("audioPlayer");
const downloadBtn = document.getElementById("downloadBtn");


// ===============================
// عداد الأحرف
// ===============================

text.addEventListener("input", () => {
  counter.textContent = `${text.value.length} / 5000`;
});


// ===============================
// جلب الأصوات من ElevenLabs
// ===============================

async function loadVoices() {
  voice.innerHTML = '<option value="">جاري تحميل الأصوات...</option>';

  try {
    const response = await fetch("/api/voices");

    if (!response.ok) {
      throw new Error("فشل تحميل الأصوات");
    }

    const data = await response.json();

    voice.innerHTML = '<option value="">اختر الصوت</option>';

    if (!data.voices || data.voices.length === 0) {
      voice.innerHTML = '<option value="">لا توجد أصوات</option>';
      return;
    }

    data.voices.forEach((item) => {
      const option = document.createElement("option");

      option.value = item.voice_id;

      let name = item.name || "صوت بدون اسم";

      if (item.labels) {
        const gender = item.labels.gender;
        const age = item.labels.age;
        const accent = item.labels.accent;

        const details = [gender, age, accent]
          .filter(Boolean)
          .join(" - ");

        if (details) {
          name += ` (${details})`;
        }
      }

      option.textContent = name;

      voice.appendChild(option);
    });

  } catch (error) {
    voice.innerHTML = '<option value="">تعذر تحميل الأصوات</option>';
    console.error(error);
  }
}

loadVoices();


// ===============================
// إظهار الخطأ
// ===============================

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}

function hideError() {
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}


// ===============================
// إنشاء الصوت
// ===============================

generateBtn.addEventListener("click", async () => {

  hideError();

  const textValue = text.value.trim();
  const voiceId = voice.value;

  if (!textValue) {
    showError("اكتب النص أولاً.");
    return;
  }

  if (!voiceId) {
    showError("اختر صوتًا أولاً.");
    return;
  }

  loading.classList.remove("hidden");
  result.classList.add("hidden");

  generateBtn.disabled = true;
  generateBtn.textContent = "⏳ جاري إنشاء الصوت...";

  try {

    const response = await fetch("/api/tts", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        text: textValue,
        voiceId: voiceId,
        speed: Number(speed.value)
      })

    });

    if (!response.ok) {

      let message = "حدث خطأ أثناء إنشاء الصوت.";

      try {
        const data = await response.json();

        if (data.error) {
          message = data.error;
        }

      } catch (_) {}

      throw new Error(message);
    }

    const audioBlob = await response.blob();

    const audioUrl = URL.createObjectURL(audioBlob);

    audioPlayer.src = audioUrl;

    downloadBtn.href = audioUrl;
    downloadBtn.download = "voice-ai.mp3";

    result.classList.remove("hidden");

    audioPlayer.play().catch(() => {});

  } catch (error) {

    showError(
      error.message || "حدث خطأ غير متوقع."
    );

  } finally {

    loading.classList.add("hidden");

    generateBtn.disabled = false;

    generateBtn.textContent =
      "🎙️ تحويل النص إلى صوت";
  }

});
