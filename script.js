function updateCounter() {
  const text = document.getElementById("text");
  document.getElementById("counter").textContent =
    text.value.length + " / 1000";
}

function toggleMenu() {
  document.getElementById("nav").classList.toggle("active");
}

function generateVoice() {
  const text = document.getElementById("text").value.trim();

  if (!text) {
    alert("اكتب نصًا أولاً");
    return;
  }

  alert("واجهة الموقع جاهزة. سنربط محرك تحويل النص إلى صوت في المرحلة التالية.");
}
