import admin from "firebase-admin";

// ============================
// INIT FIREBASE
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

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {

    const { orderId } = req.query;

    // ============================
    // VALIDATION
    // ============================

    if (!orderId) {
      return res.status(400).json({ error: "orderId manquant" });
    }

    // ============================
    // RECHERCHE COMMANDE
    // ============================

    const snapshot = await db
      .collection("orders")
      .where("orderId", "==", orderId)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "Commande introuvable" });
    }

    const doc = snapshot.docs[0];
    const order = doc.data();

    // ============================
    // REPONSE PROPRE
    // ============================

    return res.status(200).json({
      success: true,
      order: {
        orderId: order.orderId,
        status: order.status,
        amount: order.amount,
        service: order.service,
        plan: order.plan,
        createdAt: order.createdAt || null
      }
    });

  } catch (error) {

    console.error("❌ Erreur check-status :", error);

    return res.status(500).json({
      error: "Erreur serveur",
      message: error.message
    });
  }
}
