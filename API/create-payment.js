export default async function handler(req, res) {
  const { phone, amount } = req.body;

  const response = await fetch("https://api.sandbox.pawapay.io/v1/deposits", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjE4MjcxIiwibWF2IjoiMSIsImV4cCI6MjA4OTgwNTQ3MCwiaWF0IjoxNzc0MTg2MjcwLCJwbSI6IkRBRixQQUYiLCJqdGkiOiJmMjc2ZjBiMS1lZWEyLTQxN2MtYTNlNC05YjUxZTJhNGJlM2IifQ.sdfLrXMARwGt1KH_cJ7FwXEz4At02G1QNNZ4VQeorY0zz_AjBnkyUG33nmEkYM-CsEYeoJYZY-4NPyJ_c9QKhg}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  amount,
  currency: "XAF",
  correspondent: "MTN_MOMO_CG",
  customerTimestamp: new Date().toISOString(),

  statementDescription: "Commande site",

  payer: {
    type: "MSISDN",
    address: { value: phone }
  },

  metadata: {
    orderId: orderId
  }
})

  const data = await response.json();
  res.status(200).json(data);
}
