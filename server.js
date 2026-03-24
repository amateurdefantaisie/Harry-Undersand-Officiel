const express = require("express");
const fetch = require("node-fetch");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

// 🔐 CONFIG
const TOKEN = "7626568863:AAHKZxxl8-lvO4eL-Wg4fQ8QasavbSrS_Ec";
const CHANNEL = "@insolitesmoments";

// 🔥 FIREBASE ADMIN (à configurer après)
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
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

  }

  res.sendStatus(200);
});

/* =========================
   ENVOI VERS TELEGRAM
========================= */
app.post("/send-to-telegram", async (req, res) => {

  const { video } = req.body;

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
  res.send(data);
});

/* ========================= */
app.listen(process.env.PORT || 3000, () => {
  console.log("Serveur lancé");
});
