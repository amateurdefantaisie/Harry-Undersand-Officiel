import TelegramBot from "node-telegram-bot-api";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// 🔐 CONFIG
const TOKEN = "7626568863:AAHKZxxl8-lvO4eL-Wg4fQ8QasavbSrS_Ec";

const firebaseConfig = {
  apiKey: "AIzaSyBdo7NO1PnAa90PhEhuzpllkB1ESGZu3J8",
  authDomain: "harry-undersand.firebaseapp.com",
  projectId: "harry-undersand",
};

// INIT
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const bot = new TelegramBot(TOKEN, { polling: true });

// 📥 RÉCUPÉRER VIDÉOS DU CANAL
bot.on("channel_post", async (msg) => {

  if (msg.video) {
    const fileId = msg.video.file_id;

    // 🔗 récupérer URL
    const file = await bot.getFile(fileId);
    const url = `https://api.telegram.org/file/bot${TOKEN}/${file.file_path}`;

    // 🔥 envoyer vers Firebase
    await addDoc(collection(db, "videos"), {
      url: url,
      likes: 0,
      source: "telegram",
      date: Date.now()
    });

    console.log("✅ Vidéo ajoutée !");
  }
});
