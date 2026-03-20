import admin from "firebase-admin";

// Initialisation Firebase (sécurisé)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_KEY)
    )
  });
}

const db = admin.firestore();

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {

    const data = req.body;

    console.log("📩 Callback PawaPay reçu :", data);

    // Récupération des infos
    const status = data.status;
    const amount = data.amount;
    const depositId = data.depositId;

    // 🔥 IMPORTANT : récupérer orderId
    const orderId = data.metadata?.orderId;

    if (!orderId) {
      console.log("❌ Aucun orderId trouvé");
      return res.status(400).json({ error: "orderId manquant" });
    }

    // 🔎 Trouver la commande
    const snapshot = await db
      .collection("orders")
      .where("orderId", "==", orderId)
      .get();

    if (snapshot.empty) {
      console.log("❌ Commande introuvable");
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    // 🔁 Mise à jour de la commande
    const doc = snapshot.docs[0];

    let newStatus = "Échec";

    if (status === "SUCCESSFUL") {
      newStatus = "Payé";
    } else if (status === "FAILED") {
      newStatus = "Échoué";
    } else if (status === "PENDING") {
      newStatus = "En attente";
    }

    await doc.ref.update({
      status: newStatus,
      depositId: depositId,
      amount: amount,
      updatedAt: Date.now()
    });

    // 🔔 Notification utilisateur
    const orderData = doc.data();

    await db.collection("notifications").add({
      userId: orderData.userId,
      message:
        newStatus === "Payé"
          ? "✅ Paiement validé ! Votre commande est en cours."
          : "❌ Paiement échoué. Veuillez réessayer.",
      read: false,
      date: Date.now()
    });

    console.log("✅ Commande mise à jour :", newStatus);

    return res.status(200).json({ success: true });

  } catch (error) {

    console.error("❌ Erreur callback :", error);

    return res.status(500).json({
      error: "Erreur serveur",
      details: error.message
    });
  }
}
