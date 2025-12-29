const { createClient } = require("@supabase/supabase-js");

module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // 1) crear token simple
  const token = Math.random().toString(36).slice(2, 10);

  // 2) tu link de descarga (pon tu link directo Drive)
  const downloadUrl = "https://drive.google.com/uc?export=download&id=FILE_ID";

  // 3) guardar en supabase como pendiente
  const { error } = await supabase.from("payments").insert([{
    token,
    paid: false,
    download_url: downloadUrl
  }]);

  if (error) return res.status(500).json({ error: error.message });

  // 4) crear preference de MercadoPago (API directa)
  const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      items: [{ title: "Pack de Música", quantity: 1, unit_price: 10 }],
      back_urls: {
        success: `https://TU_GITHUB_PAGES/success.html?token=${token}`,
        failure: `https://TU_GITHUB_PAGES/failure.html?token=${token}`,
        pending: `https://TU_GITHUB_PAGES/pending.html?token=${token}`
      },
      auto_return: "approved",
      external_reference: token
    })
  });

  const mpData = await mpRes.json();
  if (!mpData.init_point) return res.status(500).json({ error: "MP init_point not created", mpData });

  return res.status(200).json({
    token,
    payUrl: mpData.init_point
  });
};
