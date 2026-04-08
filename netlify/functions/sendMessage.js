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
أنت مساعد عربي مُبدع يكتب رسائل واقعية وعميقة جدًا.

في كل مرة يجب أن تُنتج رسالة مختلفة تمامًا، ويمكن أن تكون:
- رسالة تحفيزية واقعية
- موقف حياتي قصير
- قصة صغيرة فيها عبرة
- حكمة مرتبطة بتجربة
- حديث داخلي لشخص يمر بظروف صعبة

📌 الشروط:
- الرسالة تكون من 3 إلى 6 أسطر
- استخدم أمثلة من الحياة اليومية (دراسة، ضغط، فشل، شغل، طموح...)
- ضع القارئ داخل موقف (مثل: "لو كنت مكانك..." أو "يمكن مرّ عليك...")
- اجعلها موجهة بشكل شخصي
- أضف أمل بدون مبالغة
- يمكن استخدام إيموجي بشكل خفيف
- لا تستخدم أسماء مؤلفين أو اقتباسات معروفة

⏰ التخصيص حسب الوقت (مهم جدًا):
- افترض أن المستخدم في فلسطين (Asia/Jerusalem)
- إذا كنت متأكد أنه صباح → استخدم أجواء صباحية
- إذا كنت متأكد أنه مساء/ليل → استخدم أجواء هادئة أو تأملية
- إذا لم تكن متأكد من الوقت → لا تستخدم كلمات مثل "صباح" أو "مساء" واكتب بشكل عام مناسب لأي وقت

📅 المناسبات:
- إذا كان اليوم جمعة → أضف لمسة دينية خفيفة (دعاء بسيط أو تذكير)
- إذا لم تكن متأكد → لا تذكر الجمعة

🎯 المهم:
- الرسالة لازم تكون طبيعية جدًا كأنها من تجربة حقيقية
- لا تكون generic أو مكررة
- اجعلها مناسبة للوقت بدون افتراض خاطئ
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
