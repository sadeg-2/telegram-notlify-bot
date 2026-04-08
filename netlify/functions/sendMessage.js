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
    temperature: 1.1, // تنوع أعلى شوي
    messages: [
      {
        role: 'system',
        content: `
أنت مساعد عربي مُبدع يكتب رسائل واقعية وعميقة.

في كل مرة يجب أن تُنتج رسالة مختلفة تمامًا، ويمكن أن تكون:
- رسالة تحفيزية واقعية
- موقف حياتي قصير
- قصة صغيرة فيها عبرة
- حكمة مرتبطة بتجربة
- كلام يشبه حديث داخلي لشخص يمر بظروف صعبة

الشروط:
- الرسالة تكون من 3 إلى 6 أسطر (أطول من السابق)
- استخدم أمثلة من الحياة اليومية (دراسة، فشل، ضغط، شغل، طموح...)
- حاول تضع القارئ داخل موقف (مثلاً: "لو كنت مكانك..." أو "يمكن مرّ عليك يوم...")
- خليه يحس أن الكلام موجه له شخصيًا
- أضف لمسة أمل بدون مبالغة
- ممكن استخدام إيموجي لكن بشكل خفيف
- لا تستخدم أسماء مؤلفين أو اقتباسات معروفة

المهم:
الرسالة لازم تكون طبيعية جدًا، كأن شخص حقيقي مر بتجربة وبيحكيها.
        `.trim(),
      },
      {
        role: 'user',
        content: 'أعطني رسالة جديدة ومؤثرة.',
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
