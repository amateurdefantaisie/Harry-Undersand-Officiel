const express = require("express");
const fetch = require("node-fetch");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

// 🔐 CONFIG (depuis Render)
const TOKEN = process.env.TOKEN;
const CHANNEL = process.env.CHANNEL;

// 🔥 FIREBASE CONFIG VIA ENV
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

// corrige les retours ligne de la clé privée
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://harry-undersand-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

/* =========================
   WEBHOOK TELEGRAM
========================= */
app.post("/webhook", async (req, res) => {

  const message = req.body.channel_post;

  if (!message) return res.sendStatus(200);

  if (message.video) {

    await db.collection("videos").add({
      url: message.video.file_id,
      likes: 0,
      telegram_post_id: message.message_id,
      created: Date.now(),
      source: "telegram"
    });

    console.log("✅ Vidéo Telegram ajoutée");
  }

  res.sendStatus(200);
});

/* =========================
   ENVOI VERS TELEGRAM
========================= */
app.post("/send-to-telegram", async (req, res) => {

  const { video } = req.body;

  try {
    const url = `https://api.telegram.org/bot${TOKEN}/sendVideo`;

    const response = await fetch(url, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        chat_id: CHANNEL,
        video: video,
        caption: "🔥 Nouvelle vidéo"
      })
    });

    const data = await response.json();

    console.log("✅ Envoyé sur Telegram");
    res.send(data);

  } catch (err) {
    console.error("❌ Erreur Telegram :", err);
    res.sendStatus(500);
  }
});

/* ========================= */
app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Serveur lancé");
});
