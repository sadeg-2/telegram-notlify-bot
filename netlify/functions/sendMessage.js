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
        temperature: 1.0, // رفع التنوع في النتائج
        messages: [
          {
            role: 'system',
            content: `
أنت مساعد عربي مُبدع يكتب رسائل قصيرة متنوعة. 
في كل مرة يجب أن تُرسل رسالة مختلفة تمامًا، يمكن أن تكون:
- رسالة تحفيزية
- حكمة
- بيت شعر
- اقتباس جميل
- نص قصير ممتع

اجعل الرسالة جذابة ومبهجة، ممكن أن تحتوي على إيموجي. 
الرسالة يمكن أن تكون سطرين أو ثلاثة كحد أقصى. 
لا تضع اسم مؤلف، الرسالة ستكون للاستخدام المباشر.
        `.trim(),
          },
          {
            role: 'user',
            content: 'أعطني رسالة جديدة ومميزة.',
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
