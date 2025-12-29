import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const preference = {
      items: [
        {
          title: "Pack Musical Profesional",
          quantity: 1,
          currency_id: "PEN",
          unit_price: 10, // precio en soles
        },
      ],
      back_urls: {
        success: "https://ivanmunozsolis.github.io/pack---musica/",
        failure: "https://ivanmunozsolis.github.io/pack---musica/",
        pending: "https://ivanmunozsolis.github.io/pack---musica/",
      },
      auto_return: "approved",
    };

    const result = await mercadopago.preferences.create(preference);

    return res.status(200).json({
      init_point: result.body.init_point,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creando pago" });
  }
}
