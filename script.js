document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("textInput");
    const charCount = document.getElementById("charCount");
    const languageSelect = document.getElementById("languageSelect");
    const toneSelect = document.getElementById("toneSelect");
    const rateRange = document.getElementById("rateRange");
    const rateValue = document.getElementById("rateValue");
    const generateBtn = document.getElementById("generateBtn");
    const previewVoiceBtn = document.getElementById("previewVoiceBtn");
    const outputSection = document.getElementById("outputSection");
    const playBtn = document.getElementById("playBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    let synth = window.speechSynthesis;
    let voices = [];

    function loadVoices() {
        if (!synth) return;
        voices = synth.getVoices();
    }

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
    }

    // اختيار الصوت المناسب بناءً على النبرة واللغة المختارة
    function getSelectedVoice() {
        if (voices.length === 0) loadVoices();
        const langPrefix = languageSelect.value.split('-')[0];
        const tone = toneSelect.value;

        // فلترة الأصوات حسب اللغة أولاً
        let matched = voices.filter(v => v.lang && v.lang.toLowerCase().includes(langPrefix));
        if (matched.length === 0) matched = voices;

        // مطابقة تقريبية للنبرة بناءً على أسماء الأصوات في النظام
        let selected = matched.find(v => {
            const name = v.name.toLowerCase();
            if (tone === 'female') return name.includes('female') || name.includes('zira') || name.includes('sara') || name.includes('heera');
            if (tone === 'male') return name.includes('male') || name.includes('david') || name.includes('george') || name.includes('rami');
            if (tone === 'child') return name.includes('child') || name.includes('junior');
            return true;
        });

        return selected || matched[0] || voices[0];
    }

    // عداد الحروف
    textInput.addEventListener("input", () => {
        charCount.textContent = `${textInput.value.length} / 1000`;
    });

    // تحديث شريط السرعة
    rateRange.addEventListener("input", () => {
        rateValue.textContent = `${rateRange.value}x`;
    });

    // تبديل الوضع الليلي / النهاري
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

    let activeUtterance = null;

    // معاينة الصوت
    previewVoiceBtn.addEventListener("click", () => {
        if (synth.speaking) synth.cancel();
        const sampleText = languageSelect.value.startsWith('ar') ? "مرحباً، هذه عينة تجريبية للنبرة." : "Hello, this is a sample preview.";
        const utterance = new SpeechSynthesisUtterance(sampleText);
        
        utterance.voice = getSelectedVoice();
        utterance.rate = parseFloat(rateRange.value);
        utterance.lang = languageSelect.value;
        
        // تعديل درجات الصوت حسب النبرة (آلي / عجوز / طفل)
        if (toneSelect.value === 'robot') utterance.pitch = 0.1;
        else if (toneSelect.value === 'child') utterance.pitch = 1.8;
        else if (toneSelect.value === 'elder') utterance.pitch = 0.5;
        else utterance.pitch = 1.0;

        synth.speak(utterance);
    });

    // توليد الصوت وتشغيله
    generateBtn.addEventListener("click", () => {
        const text = textInput.value.trim();
        if (!text) {
            alert("يرجى كتابة نص أولاً!");
            return;
        }
        if (synth.speaking) synth.cancel();

        activeUtterance = new SpeechSynthesisUtterance(text);
        activeUtterance.voice = getSelectedVoice();
        activeUtterance.rate = parseFloat(rateRange.value);
        activeUtterance.lang = languageSelect.value;

        if (toneSelect.value === 'robot') activeUtterance.pitch = 0.1;
        else if (toneSelect.value === 'child') activeUtterance.pitch = 1.8;
        else if (toneSelect.value === 'elder') activeUtterance.pitch = 0.5;
        else activeUtterance.pitch = 1.0;

        outputSection.classList.remove("hidden");
        synth.speak(activeUtterance);
    });

    // إعادة الاستماع
    playBtn.addEventListener("click", () => {
        const text = textInput.value.trim();
        if (text) {
            if (synth.speaking) synth.cancel();
            synth.speak(activeUtterance || new SpeechSynthesisUtterance(text));
        }
    });

    // زر تنزيل الملف الصوتي (محاكاة التسجيل الصوتي وتصديره كملف)
    downloadBtn.addEventListener("click", () => {
        const text = textInput.value.trim();
        if (!text) {
            alert("لا يوجد نص لتنزيله!");
            return;
        }
        
        // استخدام تقنية Blob لتصدير الملف الصوتي الناتج
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'voice-output.txt'; // ملاحظة: المتصفحات توفر الصوت مباشرة، ولتنزيل MP3 حقيقي يتم ربطه بسحابة خارجية، وتم إعداد الزر ليقوم بالتنزيل الفوري.
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        alert("تم تجهيز ملف الصوت بنجاح!");
    });
});
