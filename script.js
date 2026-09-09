document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("textInput");
    const charCount = document.getElementById("charCount");
    const languageSelect = document.getElementById("languageSelect");
    const voiceSelect = document.getElementById("voiceSelect");
    const rateSelect = document.getElementById("rateSelect");
    const generateBtn = document.getElementById("generateBtn");
    const outputSection = document.getElementById("outputSection");
    const playBtn = document.getElementById("playBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const themeToggle = document.getElementById("themeToggle");

    let synth = window.speechSynthesis;
    let voices = [];

    // جلب الأصوات المتاحة في المتصفح وتصفيتها
    function populateVoices() {
        voices = synth.getVoices();
        voiceSelect.innerHTML = "";

        const selectedLangPrefix = languageSelect.value.split('-')[0]; // مثل ar أو en أو fr
        
        let filteredVoices = voices.filter(voice => voice.lang.startsWith(selectedLangPrefix));

        // إذا لم توجد أصوات مخصصة للغة الفرعية، اعرض كل أصوات اللغة الأساسية أو جميع الأصوات المتاحة
        if (filteredVoices.length === 0) {
            filteredVoices = voices;
        }

        filteredVoices.forEach((voice, index) => {
            const option = document.createElement("option");
            option.value = index;
            // تسميات أصوات تعبيرية وفخمة بناءً على النبرة
            let customName = `نبرة احترافية ${index + 1} (${voice.name})`;
            if(voice.name.includes('Natural') || voice.name.includes('Google')) {
                customName = `✨ صوت فخم عالي الوضوح (${voice.name})`;
            }
            option.textContent = customName;
            option.setAttribute('data-name', voice.name);
            voiceSelect.appendChild(option);
        });

        if (voiceSelect.options.length === 0) {
            const option = document.createElement("option");
            option.textContent = "لا توجد أصوات متاحة لهذه اللهجة";
            voiceSelect.appendChild(option);
        }
    }

    populateVoices();
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = populateVoices;
    }

    // تحديث قائمة الأصوات عند تغيير اللهجة / اللغة
    languageSelect.addEventListener("change", populateVoices);

    // عداد الحروف
    textInput.addEventListener("input", () => {
        const length = textInput.value.length;
        charCount.textContent = `${length} / 1000`;
    });

    // تبديل الوضع الليلي والنهاري
    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        if (currentTheme === "dark") {
            document.documentElement.removeAttribute("data-theme");
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    });

    let currentUtterance = null;

    // زر التوليد وتحويل النص
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
        
        const selectedLangPrefix = languageSelect.value.split('-')[0];
        let filteredVoices = voices.filter(voice => voice.lang.startsWith(selectedLangPrefix));
        if (filteredVoices.length === 0) filteredVoices = voices;

        if (filteredVoices[selectedVoiceIndex]) {
            currentUtterance.voice = filteredVoices[selectedVoiceIndex];
        }

        currentUtterance.rate = parseFloat(rateSelect.value);
        currentUtterance.lang = languageSelect.value;

        // إظهار قسم الموجات الصوتية والنجاح
        outputSection.classList.remove("hidden");

        synth.speak(currentUtterance);

        currentUtterance.onend = () => {
            // انتهى التلاوة الصوتية
        };
    });

    // زر الاستماع المباشر
    playBtn.addEventListener("click", () => {
        const text = textInput.value.trim();
        if (text) {
            if (synth.speaking) synth.cancel();
            synth.speak(currentUtterance || new SpeechSynthesisUtterance(text));
        }
    });

    // زر التحميل التخيلي (ملاحظة: Web Speech API في المتصفحات تولد صوتیات مباشرة ولا تتيح رابط تحميل مباشر ملف MP3 إلا عبر تسجيل داخلي، لذا سنضع رسالة إرشادية للمستخدم أو محاكاة)
    downloadBtn.addEventListener("click", () => {
        alert("ميزة التحميل المباشر لملفات MP3 تتطلب خادم معالجة سحابي (Backend)، يتم تشغيل الصوت حالياً عبر محرك المتصفح الفائق الجودة!");
    });
});
              
