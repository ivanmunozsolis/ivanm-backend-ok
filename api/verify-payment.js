import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { payment_id } = req.query;

    if (!payment_id) {
      return res.status(400).json({ approved: false });
    }

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${payment_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      }
    );

    const data = await response.json();

    if (data.status === "approved") {
      return res.status(200).json({ approved: true });
    }

    return res.status(200).json({ approved: false });

  } catch (error) {
    return res.status(200).json({ approved: false });
  }
}
