export default async function handler(req, res) {
  try {
    // Mercado Pago envía POST
    if (req.method !== "POST") {
      return res.status(200).json({ ok: true });
    }

    const body = req.body;

    console.log("📩 Webhook recibido:", body);

    // Siempre responder 200 para que Mercado Pago NO falle
    return res.status(200).json({ received: true });

  } catch (error) {
    console.error("❌ Error webhook:", error);
    // AUN con error, responder 200 (esto es CLAVE)
    return res.status(200).json({ received: true });
  }
}
