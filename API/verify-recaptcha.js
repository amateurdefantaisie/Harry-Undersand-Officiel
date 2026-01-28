export default async function handler(req, res) {
  const { token } = req.body;

  const secret = process.env.RECAPTCHA_SECRET;

  const googleRes = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secret}&response=${token}`
    }
  );

  const data = await googleRes.json();

  if (data.success && data.score > 0.5) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
}
