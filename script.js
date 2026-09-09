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

    // تحميل وتعبئة النبرات والأصوات بناءً على اللغة المختارة
    function populateVoices() {
        if (!synth) return;
        voices = synth.getVoices();
        voiceSelect.innerHTML = "";

        const selectedLangCode = languageSelect.value; // مثال: ar-SA أو en-US
        const langPrefix = selectedLangCode.split('-')[0];

        // فلترة الأصوات المتوافقة مع اللغة أو جلب الكل كاحتياطي
        let matchedVoices = voices.filter(voice => voice.lang && voice.lang.toLowerCase().includes(langPrefix));
        if (matchedVoices.length === 0) {
            matchedVoices = voices; // لو لم توجد أصوات مطابقة دقيقة، اعرض المتاحة
        }

        matchedVoices.forEach((voice, index) => {
            const option = document.createElement("option");
            option.value = voices.indexOf(voice); // حفظ المؤشر الحقيقي الأصلي للصوت
            
            let badgeName = "✨ نبرة احترافية";
            if (voice.name.includes("Google") || voice.name.includes("Natural") || voice.name.includes("Microsoft")) {
                badgeName = "🎙️ صوت فخم عالي الوضوح";
            }
            option.textContent = `${badgeName} (${voice.name})`;
            voiceSelect.appendChild(option);
        });

        if (voiceSelect.options.length === 0) {
            const option = document.createElement("option");
            option.textContent = "لا توجد أصوات متاحة في المتصفح لهذه اللغة";
            voiceSelect.appendChild(option);
        }
    }

    populateVoices();
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = populateVoices;
    }

    // تحديث الأصوات عند تغيير اللغة
    languageSelect.addEventListener("change", populateVoices);

    // عداد الحروف
    textInput.addEventListener("input", () => {
        const length = textInput.value.length;
        charCount.textContent = `${length} / 1000`;
    });

    // تحديث قيمة شريط السرعة بصرياً
    rateRange.addEventListener("input", () => {
        rateValue.textContent = `${rateRange.value}x`;
    });

    // تفعيل الوضع الليلي والنهاري وحفظ الخيار
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

    // زر معاينة الصوت (Preview)
    previewVoiceBtn.addEventListener("click", () => {
        if (synth.speaking) {
            synth.cancel();
        }
        const sampleText = languageSelect.value.startsWith('ar') ? "مرحباً، هذه عينة لتجربة نبرة الصوت." : "Hello, this is a voice preview sample.";
        const utterance = new SpeechSynthesisUtterance(sampleText);
        
        const selectedVoiceIndex = voiceSelect.value;
        if (voices[selectedVoiceIndex]) {
            utterance.voice = voices[selectedVoiceIndex];
        }
        utterance.rate = parseFloat(rateRange.value);
        utterance.lang = languageSelect.value;

        synth.speak(utterance);
    });

    // زر تحويل النص الكامل إلى صوت
    generateBtn.addEventListener("click", () => {
        const text = textInput.value.trim();
        if (!text) {
            alert("يرجى كتابة نص أولاً لتحويله إلى صوت!");
            return;
        }

        if (synth.speaking) {
            synth.cancel();
        }

        currentUtterance = new SpeechSynthesisUtterance(text);
        
        const selectedVoiceIndex = voiceSelect.value;
        if (voices[selectedVoiceIndex]) {
            currentUtterance.voice = voices[selectedVoiceIndex];
        }

        currentUtterance.rate = parseFloat(rateRange.value);
        currentUtterance.lang = languageSelect.value;

        outputSection.classList.remove("hidden");
        synth.speak(currentUtterance);
    });

    // زر إعادة الاستماع
    playBtn.addEventListener("click", () => {
        const text = textInput.value.trim();
        if (text) {
            if (synth.speaking) synth.cancel();
            synth.speak(currentUtterance || new SpeechSynthesisUtterance(text));
        }
    });
});
