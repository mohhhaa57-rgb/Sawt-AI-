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
// الأصوات
// ===============================
//
// ضع Voice ID الخاص بأصوات ElevenLabs هنا.
// سنستبدل القائمة لاحقًا بجلب الأصوات
// تلقائيًا من ElevenLabs.
//

const voices = [
  {
    id: "EXAVITQu4vr4xnSDxMaL",
    name: "صوت أنثوي - عربي/متعدد اللغات"
  },
  {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "صوت رجالي - متعدد اللغات"
  }
];


// إضافة الأصوات للقائمة

function loadVoices() {

  voice.innerHTML = '<option value="">اختر الصوت</option>';

  voices.forEach((item) => {

    const option = document.createElement("option");

    option.value = item.id;
    option.textContent = item.name;

    voice.appendChild(option);

  });
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


  // إظهار التحميل

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


    // الحصول على الملف الصوتي

    const audioBlob = await response.blob();

    const audioUrl = URL.createObjectURL(audioBlob);


    // تشغيل
