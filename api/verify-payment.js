const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Token requerido" });
    }

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("token", token)
      .eq("paid", true)
      .single();

    if (error || !data) {
      return res.status(200).json({ valid: false });
    }

    return res.status(200).json({
      valid: true,
      downloadUrl: data.download_url,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
};
