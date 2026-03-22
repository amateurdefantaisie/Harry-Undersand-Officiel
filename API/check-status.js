import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.AIzaSyBdo7NO1PnAa90PhEhuzpllkB1ESGZu3J8)
    )
  });
}

const db = admin.firestore();

export default async function handler(req, res) {

  const { orderId } = req.query;

  if (!orderId) {
    return res.status(400).json({ error: "orderId manquant" });
  }

  const snapshot = await db
    .collection("orders")
    .where("orderId", "==", orderId)
    .get();

  if (snapshot.empty) {
    return res.status(404).json({ error: "Commande non trouvée" });
  }

  const order = snapshot.docs[0].data();

  res.status(200).json({
    status: order.status
  });
}
