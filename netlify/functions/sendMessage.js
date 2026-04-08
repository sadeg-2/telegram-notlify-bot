export async function handler() {
  const TOKEN = process.env.TOKEN;
  const CHAT_ID = process.env.GROUP_CHAT_ID;
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  try {
    // 🔹 طلب OpenRouter
    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        temperature: 1.1,
        messages: [
          {
            role: 'system',
            content: `
أنت مساعد عربي يكتب نصوص قصيرة واقعية ومتنوعة بأسلوب طبيعي جدًا.

🎯 أنواع المحتوى (غيّر بينهم كل مرة):
- رسالة تحفيزية
- رسالة تشجيعية هادئة
- وصف شعور يمر فيه الإنسان
- موقف حياتي بسيط
- حكمة واقعية
- تأمل قصير
- أحيانًا لمسة دينية خفيفة (بدون مبالغة)

📌 الأسلوب:
- لا تتحدث بصيغة "أنا"
- لا تكتب تجربة شخصية مباشرة
- استخدم أسلوب عام:
  "أحيانًا الإنسان..."، "يمر الشخص..."، "في لحظات..."
- خلي النص يشعر القارئ أنه واقعي وقريب منه

📌 الشروط:
- من 3 إلى 6 أسطر
- استخدم أمثلة من الحياة اليومية (دراسة، تعب، ضغط، تفكير...)
- بسيط، عفوي، بدون تصنّع
- ممكن إيموجي خفيف

⚠️ تجنب:
- لا تستخدم: "تخيل لو كنت مكانك"
- لا تعطي أوامر مباشرة
- لا يكون الكلام مبالغ فيه أو فلسفي زيادة

⏰ التوقيت:
- افترض أن المستخدم في فلسطين
- إذا لم تكن متأكد من الوقت → لا تذكر صباح أو مساء

📅 المناسبات:
- إذا كان يوم جمعة → أضف لمسة دينية بسيطة (دعاء أو تذكير)
- غير ذلك لا تذكر

🎯 الهدف:
نص قصير واقعي جدًا، أحيانًا مريح، أحيانًا محفّز، وأحيانًا مجرد وصف شعور… 
كأنه مكتوب من شخص فاهم الحياة، مش كاتب محتوى.
  `.trim(),
          },
          {
            role: 'user',
            content: 'أعطني رسالة جديدة ومؤثرة تناسب هذا الوقت.',
          },
        ],
      }),
    });

    const aiData = await aiRes.json();

    const message = aiData.choices?.[0]?.message?.content || '⚠️ فشل توليد الرسالة';

    // 🔹 إرسال Telegram
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    });

    // 🔹 عرض النتيجة في الصفحة
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: `
        <h2>✅ تم إرسال الرسالة</h2>
        <p style="font-size:20px">${message}</p>
      `,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Error: ${err}`,
    };
  }
}
