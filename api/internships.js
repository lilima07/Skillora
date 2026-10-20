
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.TINYFISH_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "TINYFISH_API_KEY is missing in Vercel settings.",
      });
    }

    const role = String(req.query.role || "software engineering").trim();
    const location = String(req.query.location || "India").trim();

    const searchUrl = new URL("https://api.search.tinyfish.ai");
    searchUrl.searchParams.set(
      "query",
      `${role} internship for college students in ${location} 2026 apply company careers`
    );
    searchUrl.searchParams.set("location", "IN");
    searchUrl.searchParams.set("language", "en");

    const response = await fetch(searchUrl, {
      headers: {
        "X-API-Key": apiKey,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("TinyFish error:", response.status, data);
      return res.status(502).json({
        error: "Internship search provider returned an error.",
      });
    }

    const results = (Array.isArray(data.results) ? data.results : [])
      .filter((item) => item.url)
      .map((item) => ({
        title: item.title || "Internship opportunity",
        company: item.site_name || "Company",
        url: item.url,
        snippet: item.snippet || "",
      }));

    return res.status(200).json({
      provider: "TinyFish Search",
      total: results.length,
      results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Could not complete internship search.",
    });
  }
}

