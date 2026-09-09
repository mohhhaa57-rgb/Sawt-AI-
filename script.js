const express = require('express');
const OpenAI = require('openai'); // مكتبة OpenAI الرسمية
const app = express();

const openai = new OpenAI({ apiKey: 'YOUR_OPENAI_API_KEY' }); // ضع مفتاح الـ API الخاص بك هنا

app.use(express.json());
app.use(express.static('public')); // مجلد ملفات الواجهة

app.post('/api/text-to-speech', async (req, res) => {
    try {
        const { text, voice } = req.body;

        // استدعاء خدمة توليد الصوت من OpenAI
        const mp3Response = await openai.audio.speech.create({
            model: "tts-1", // نموذج عالي السرعة والجودة
            voice: voice,   // النبرة المختارة (alloy, nova, shimmer, echo...)
            input: text,
            response_format: "mp3"
        });

        const buffer = Buffer.from(await mp3Response.arrayBuffer());

        // إرسال الملف الصوتي مباشرة إلى المتصفح
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': buffer.length
        });
        res.send(buffer);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating speech');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
