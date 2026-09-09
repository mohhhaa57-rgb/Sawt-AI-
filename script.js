document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("textInput");
    const charCount = document.getElementById("charCount");
    const languageSelect = document.getElementById("languageSelect");
    const voiceSelect = document.getElementById("voiceSelect");
    const rateRange = document.getElementById("rateRange");
    const rateValue = document.getElementById("rateValue");
    const generateBtn = document.getElementById("generateBtn");
    const previewVoiceBtn = document.getElementById("previewVoiceBtn");
    const outputSection = document.getElementById("outputSection");
    const playBtn = document.getElementById("playBtn");
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    let synth = window.speechSynthesis;
    let voices = [];

    function populateVoices() {
        if (!synth) return;
        voices = synth.getVoices();
        voiceSelect.innerHTML = "";

        const langFilter = languageSelect.value;
        let filtered = voices.filter(v => v.lang.startsWith(langFilter));
        if (filtered.length === 0) filtered = voices;

        filtered.forEach((voice, index) => {
            const option = document.createElement("option");
            option.value = voices.indexOf(voice);
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
    }

    populateVoices();
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = populateVoices;
    }

    languageSelect.addEventListener("change", populateVoices);

    textInput.addEventListener("input", () => {
        charCount.textContent = `${textInput.value.length} / 1000`;
    });

    rateRange.addEventListener("input", () => {
        rateValue.textContent = `${rateRange.value}x`;
    });

    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        if (currentTheme === "dark") {
            document.documentElement.setAttribute("data-theme", "light");
            themeIcon.className = "fa-solid fa-moon";
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            themeIcon.className = "fa-solid fa-sun";
        }
    });

    let currentUtterance = null;

    previewVoiceBtn.addEventListener("click", () => {
        if (synth.speaking) synth.cancel();
        const utterance = new SpeechSynthesisUtterance("مرحباً، هذه عينة صوتية تجريبية.");
        const idx = voiceSelect.value;
        if (voices[idx]) utterance.voice = voices[idx];
        utterance.rate = parseFloat(rateRange.value);
        synth.speak(utterance);
    });

    generateBtn.addEventListener("click", () => {
        const text = textInput.value.trim();
        if (!text) {
            alert("يرجى كتابة نص أولاً!");
            return;
        }
        if (synth.speaking) synth.cancel();

        currentUtterance = new SpeechSynthesisUtterance(text);
        const idx = voiceSelect.value;
        if (voices[idx]) currentUtterance.voice = voices[idx];
        currentUtterance.rate = parseFloat(rateRange.value);

        outputSection.classList.remove("hidden");
        synth.speak(currentUtterance);
    });

    playBtn.addEventListener("click", () => {
        const text = textInput.value.trim();
        if (text) {
            if (synth.speaking) synth.cancel();
            synth.speak(currentUtterance || new SpeechSynthesisUtterance(text));
        }
    });
});
