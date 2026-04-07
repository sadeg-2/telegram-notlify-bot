export async function handler() {
  const TOKEN = process.env.TOKEN;
  const CHAT_ID = process.env.GROUP_CHAT_ID;
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  try {
    // 🔹 طلب OpenRouter
    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        temperature: 0.9,
        max_tokens: 120,
        messages: [
          {
            role: "system",
            content: "Generate a short Arabic motivational message with emojis, no author, under 2 sentences."
          },
          {
            role: "user",
            content: "أعطني رسالة تحفيزية قصيرة ومختلفة."
          }
        ]
      })
    });

    const aiData = await aiRes.json();

    const message =
      aiData.choices?.[0]?.message?.content ||
      "⚠️ فشل توليد الرسالة";

    // 🔹 إرسال Telegram
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    });

    // 🔹 عرض النتيجة في الصفحة
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: `
        <h2>✅ تم إرسال الرسالة</h2>
        <p style="font-size:20px">${message}</p>
      `
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: `Error: ${err}`
    };
  }
}