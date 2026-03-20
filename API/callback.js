import { db } from "../lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const data = req.body;

  console.log("Callback reçu :", data);

  const transactionId = data.depositId || data.paymentId;

  await db.collection("transactions").doc(transactionId).set({
    status: data.status,
    amount: data.amount,
    phone: data.payer?.address?.value,
    updatedAt: new Date()
  });

  if (data.status === "SUCCESSFUL") {
    console.log("Paiement validé !");
  }

  res.status(200).json({ message: "OK" });
}
