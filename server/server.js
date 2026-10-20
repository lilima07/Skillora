
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const TINYFISH_URL = "https://api.search.tinyfish.ai";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Skillora backend is running!",
    tinyfishConfigured: Boolean(process.env.TINYFISH_API_KEY),
  });
});

function normalizeUrl(value) {
  try {
    const raw = String(value || "").trim();
    if (!raw) return null;

    const url = new URL(
      /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
    );

    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}

function getCountryCode(location) {
  const countries = {
    india: "IN",
    in: "IN",
    usa: "US",
    "united states": "US",
    us: "US",
    uk: "GB",
    "united kingdom": "GB",
    canada: "CA",
    australia: "AU",
    singapore: "SG",
    germany: "DE",
  };

  return countries[String(location).trim().toLowerCase()] || "IN";
}

app.get("/api/internships", async (req, res) => {
  try {
    const apiKey = process.env.TINYFISH_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "TinyFish API key is missing.",
      });
    }

    const role = String(
      req.query.role || "software engineering"
    )
      .trim()
      .slice(0, 100);

    const location = String(req.query.location || "India")
      .trim()
      .slice(0, 80);

    if (!role || !location) {
      return res.status(400).json({
        error: "Please provide both a role and a location.",
      });
    }

    const query =
      `${role} internship for college students in ${location} ` +
      `${new Date().getFullYear()} apply company careers`;

    const searchUrl = new URL(TINYFISH_URL);

    searchUrl.searchParams.set("query", query);
    searchUrl.searchParams.set("location", getCountryCode(location));
    searchUrl.searchParams.set("language", "en");

    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(30000),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("TinyFish status:", response.status);

      return res.status(502).json({
        error:
          response.status === 401 || response.status === 403
            ? "TinyFish rejected the API key. Check your key."
            : response.status === 429
              ? "TinyFish rate limit reached. Please try again later."
              : "Internship search failed. Please try again.",
      });
    }

    const seen = new Set();

    const results = (
      Array.isArray(data.results) ? data.results : []
    )
      .map((item) => {
        const url = normalizeUrl(item.url);

        if (!url) return null;

        return {
          title: item.title || "Internship opportunity",
          company: item.site_name || "External website",
          url,
          snippet: item.snippet || "",
        };
      })
      .filter((item) => {
        if (!item) return false;

        const normalizedUrl = item.url
          .split("#")[0]
          .replace(/\/+$/, "");

        if (seen.has(normalizedUrl)) return false;

        seen.add(normalizedUrl);
        return true;
      });

    return res.json({
      provider: "TinyFish Search",
      query,
      total: results.length,
      results,
    });
  } catch (error) {
    console.error("Internship search error:", error.message);

    return res.status(500).json({
      error:
        error.name === "TimeoutError"
          ? "The search took too long. Please try again."
          : "Could not connect to TinyFish. Please try again.",
    });
  }
});

export default app;


if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Skillora backend running at http://localhost:${PORT}`);
  });
}
