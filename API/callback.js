import admin from "firebase-admin";

// ============================
// INIT FIREBASE (SECURE)
// ============================

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    )
  });
}

const db = admin.firestore();

// ============================
// HANDLER
// ============================

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {

    const data = req.body;

    console.log("📩 Callback reçu :", data);

    // ============================
    // VALIDATION DONNÉES
    // ============================

    const status = data.status;
    const amount = data.amount;
    const depositId = data.depositId;
    const orderId = data.metadata?.orderId;

    if (!status || !depositId || !orderId) {
      return res.status(400).json({ error: "Données invalides" });
    }

    // ============================
    // TROUVER COMMANDE
    // ============================

    const snapshot = await db
      .collection("orders")
      .where("orderId", "==", orderId)
      .get();

    if (snapshot.empty) {
      console.log("❌ Commande introuvable :", orderId);
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    const doc = snapshot.docs[0];
    const order = doc.data();

    // ============================
    // ANTI FRAUDE
    // ============================

    if (order.amount !== amount) {
      console.log("❌ Montant incohérent !");
      return res.status(400).json({ error: "Montant invalide" });
    }

    // ============================
    // ANTI DOUBLE TRAITEMENT
    // ============================

    if (order.status === "Payé") {
      console.log("⚠️ Déjà payé, ignoré");
      return res.status(200).json({ success: true });
    }

    // ============================
    // MAPPING STATUS
    // ============================

    let newStatus = "Échec";

    if (status === "SUCCESSFUL") newStatus = "Payé";
    if (status === "FAILED") newStatus = "Échoué";
    if (status === "PENDING") newStatus = "En attente";

    // ============================
    // UPDATE FIRESTORE
    // ============================

    await doc.ref.update({
      status: newStatus,
      depositId,
      updatedAt: Date.now()
    });

    // ============================
    // NOTIFICATION USER
    // ============================

    await db.collection("notifications").add({
      userId: order.userId,
      message:
        newStatus === "Payé"
          ? "✅ Paiement validé ! Votre commande est en cours."
          : "❌ Paiement échoué. Veuillez réessayer.",
      read: false,
      createdAt: Date.now()
    });

    console.log("✅ Commande mise à jour :", newStatus);

    return res.status(200).json({ success: true });

  } catch (error) {

    console.error("❌ Erreur callback :", error);

    return res.status(500).json({
      error: "Erreur serveur",
      message: error.message
    });
  }
}
