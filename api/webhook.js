import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const topic = req.query.topic || req.query.type;
    const id = req.query.id || req.query["data.id"];

    if (topic !== "payment") {
      return res.status(200).send("Evento ignorado");
    }

    // Consultar pago a Mercado Pago
    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    const payment = await paymentResponse.json();

    if (payment.status === "approved") {
      console.log("✅ Pago aprobado:", payment.id);

      // AQUÍ luego podremos:
      // - guardar el pago
      // - habilitar descarga
      // - enviar correo
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Error webhook:", error);
    return res.status(500).send("Webhook error");
  }
}
