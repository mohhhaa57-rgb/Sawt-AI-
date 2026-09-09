document.getElementById('convertBtn').addEventListener('click', async () => {
    const textInput = document.getElementById('textInput');
    const voiceSelect = document.getElementById('voiceSelect');
    const btn = document.getElementById('convertBtn');

    const text = textInput.value.trim();
    const voice_id = voiceSelect.value;

    if (!text) {
        alert('الرجاء كتابة نص أولاً!');
        return;
    }

    // تغيير حالة الزر أثناء المعالجة
    btn.innerText = 'جاري توليد الصوت... ⏳';
    btn.disabled = true;

    try {
        // [هام] استبدل الرابط أدناه برابط الـ Cloudflare Worker الخاص بك
        const workerUrl = 'https://sawt-ai.mohshaa57.workers.dev'; 

        const response = await fetch(workerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                voice_id: voice_id
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'فشل الاتصال بخادم التوليد');
        }

        // استقبال ملف الصوت (Blob) وتحميله تلقائياً
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `voiceai-${Date.now()}.mp3`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        btn.innerText = 'تم التنزيل بنجاح! 🎉';
        setTimeout(() => {
            btn.innerText = 'تحويل وتنزيل كـ MP3 🎵';
        }, 3000);

    } catch (error) {
        alert('حدث خطأ: ' + error.message);
        btn.innerText = 'تحويل وتنزيل كـ MP3 🎵';
    } finally {
        btn.disabled = false;
    }
});
