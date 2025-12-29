import fetch from "node-fetch";

export default async function handler(req, res) {
  // ✅ Mercado Pago SIEMPRE envía POST
  if (req.method !== "POST") {
    return res.status(200).send("OK");
  }

  try {
    const { type, data } = req.body;

    // Solo nos interesa pagos
    if (type !== "payment") {
      return res.status(200).send("Evento ignorado");
    }

    const paymentId = data.id;

    // 🔍 Consultar pago real a Mercado Pago
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      }
    );

    const payment = await response.json();

    console.log("📦 Pago recibido:", payment.id, payment.status);

    // ✅ SOLO si el pago está aprobado
    if (payment.status === "approved") {
      // Aquí luego puedes guardar en DB (opcional)
      console.log("✅ PAGO APROBADO:", payment.id);
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error("❌ Error webhook:", error);
    return res.status(200).json({ error: "Webhook error" });
  }
}
