const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const TOKEN = "7626568863:AAHKZxxl8-lvO4eL-Wg4fQ8QasavbSrS_Ec";
const CHANNEL = "@insolitesmoments";

app.post("/send-to-telegram", async (req,res)=>{

    const {video, id} = req.body;

    const url = `https://api.telegram.org/bot${TOKEN}/sendVideo`;

    const response = await fetch(url,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
            chat_id: CHANNEL,
            video: video,
            caption: "Nouvelle vidéo publiée 🔥"
        })
    });

    const data = await response.json();

    res.send(data);
});

app.listen(3000, ()=> console.log("Serveur lancé"));
