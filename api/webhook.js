import crypto from "crypto";
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const secret = process.env.MP_WEBHOOK_SECRET;

    const signature = req.headers["x-signature"];
    const requestId = req.headers["x-request-id"];

    if (!signature || !requestId) {
      return res.status(400).send("Missing headers");
    }

    const body = JSON.stringify(req.body);

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(`${requestId}.${body}`);
    const expectedSignature = hmac.digest("hex");

    if (signature !== expectedSignature) {
      return res.status(401).send("Invalid signature");
    }

    // 👉 Obtener pago real
    const paymentId = req.body?.data?.id;
    if (!paymentId) {
      return res.status(200).send("No payment ID");
    }

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    const payment = await response.json();

    if (payment.status === "approved") {
      console.log("✅ PAGO APROBADO REAL:", payment.id);
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error);
    return res.status(500).send("Webhook error");
  }
}
