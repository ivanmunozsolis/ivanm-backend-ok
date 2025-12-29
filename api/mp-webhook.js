const { createClient } = require("@supabase/supabase-js");

module.exports = async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // MercadoPago manda distintos formatos. Guardamos rápido y respondemos 200
  try {
    const body = req.body || {};
    // Si te llega el payment_id, aquí lo usaremos después
    return res.status(200).send("ok");
  } catch (e) {
    return res.status(200).send("ok");
  }
};
