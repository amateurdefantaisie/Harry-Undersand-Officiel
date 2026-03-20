export default async function handler(req, res) {
  const { phone, amount } = req.body;

  const response = await fetch("https://api.sandbox.pawapay.io/v1/deposits", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PAWAPAY_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount,
      currency: "XAF",
      correspondent: "MTN_MOMO_CG",
      payer: {
        type: "MSISDN",
        address: { value: phone }
      }
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
