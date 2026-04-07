# 🚀 Telegram Motivational Bot (Serverless with Netlify)

A simple and smart Telegram bot that sends short motivational messages (with emojis 🎯) using AI, powered  by Netlify Functions without needing a persistent server.

---

## 💡 Project Idea

Instead of running a bot continuously (loop-based), this project uses a **Serverless approach**:

- A Netlify Function is created
- When a specific endpoint is triggered:
  1. Generate a motivational message using OpenRouter API 🤖
  2. Send it to a Telegram channel 📩
  3. Return and display the message in the browser ✅

---

## 🔗 Live Channel

📢 Telegram Channel:  
👉 https://t.me/motivation_letter_p

---

## ⚙️ Technologies Used

- Netlify Functions (Serverless)
- OpenRouter API (AI)
- Telegram Bot API
- Node.js

---

## 📁 Project Structure

```

/netlify/functions/sendMessage.js
netlify.toml
package.json

````

---

## 🔧 Setup

### 1️⃣ Add Environment Variables in Netlify

Go to your Netlify Dashboard → Site Settings → Environment Variables:

- `TOKEN` → Telegram Bot Token  
- `GROUP_CHAT_ID` → Telegram Channel ID  
- `OPENROUTER_API_KEY` → OpenRouter API Key  

---

### 2️⃣ netlify.toml

```toml
[build]
  functions = "netlify/functions"

[[redirects]]
  from = "/send"
  to = "/.netlify/functions/sendMessage"
  status = 200
````

---

## ▶️ Usage

After deployment, call this endpoint:

```
https://your-site.netlify.app/send
```

🔄 When you open the URL:

* A new AI-generated message is created
* It is sent to your Telegram channel
* It is displayed in your browser

---

## ⏱️ Automation

This project uses:

👉 [https://cron-job.org](https://cron-job.org)

To send a request every 15 minutes to:

```
https://your-site.netlify.app/send
```

✔️ This ensures:

* Automatic message sending
* No need for a running server
* No sleep or downtime issues

---

## ⚠️ Notes

* No loops or polling → Netlify does not support long-running processes
* Keep request frequency reasonable to avoid API limits
* Always use Environment Variables to protect your keys

---

## 🔥 Features

* Fully serverless ⚡
* Low resource usage
* Easy deployment
* Scalable and customizable

---

## 💭 Future Improvements

* Support multiple message types (religious, quotes, thoughts)
* Send multiple messages per request
* Build a simple dashboard for control

---

## ❤️

If you like this project, consider supporting the channel 🙌
👉 [https://t.me/motivation_letter_p](https://t.me/motivation_letter_p)

```

---

إذا بدك 🔥 أقدر أعمل لك نسخة **GitHub جاهزة مع badges + preview + شكل portfolio احترافي** يخلي المشروع يبين أقوى بكثير.
```
