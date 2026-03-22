export default async function handler(req, res) {

  // ============================
  // METHOD CHECK
  // ============================

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {

    // ============================
    // DATA
    // ============================

    const { phone, amount, orderId } = req.body;

    // ============================
    // VALIDATION
    // ============================

    if (!phone || !amount || !orderId) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "Montant invalide" });
    }

    if (!phone.startsWith("242")) {
      return res.status(400).json({ error: "Numéro invalide (Congo requis)" });
    }

    // ============================
    // CONFIG API
    // ============================

    const PAWAPAY_TOKEN = process.env.PAWAPAY_TOKEN;

    if (!PAWAPAY_TOKEN) {
      return res.status(500).json({ error: "Token PawaPay manquant" });
    }

    // ============================
    // REQUEST PAWAPAY
    // ============================

    const response = await fetch("https://api.sandbox.pawapay.io/v1/deposits", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PAWAPAY_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount,
        currency: "XAF",
        correspondent: "MTN_MOMO_CG",
        customerTimestamp: new Date().toISOString(),
        statementDescription: "Commande Amateur De Fantaisie",
        payer: {
          type: "MSISDN",
          address: { value: phone }
        },
        metadata: {
          orderId
        }
      })
    });

    const data = await response.json();

    // ============================
    // ERROR PAWAPAY
    // ============================

    if (!response.ok) {
      console.error("❌ PawaPay erreur :", data);

      return res.status(500).json({
        error: "Erreur paiement",
        details: data
      });
    }

    // ============================
    // SUCCESS
    // ============================

    console.log("✅ Paiement initié :", orderId);

    return res.status(200).json({
      success: true,
      depositId: data.depositId,
      status: data.status || "PENDING"
    });

  } catch (error) {

    console.error("❌ Erreur serveur :", error);

    return res.status(500).json({
      error: "Erreur serveur",
      message: error.message
    });
  }
}
