export default async function handler(req, res) {

  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (!process.env.MP_ACCESS_TOKEN) {
      throw new Error("MP_ACCESS_TOKEN no definido");
    }

    const preference = {
      items: [
        {
          title: "Pack Musical Profesional",
          quantity: 1,
          currency_id: "PEN",
          unit_price: 1
        }
      ],
      back_urls: {
        success: "https://ivanmunozsolis.github.io/pack---musica/success.html?status=approved",
        failure: "https://ivanmunozsolis.github.io/pack---musica/success.html?status=failure",
        pending: "https://ivanmunozsolis.github.io/pack---musica/success.html?status=pending"
      },
      auto_return: "approved"
    };

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(preference)
      }
    );

    const data = await response.json();

    return res.status(200).json({
      init_point: data.init_point
    });

  } catch (error) {
    console.error("ERROR BACKEND:", error.message);

    return res.status(500).json({
      error: error.message
    });
  }
}
