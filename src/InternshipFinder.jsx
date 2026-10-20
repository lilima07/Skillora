
import { useState } from "react";
import "./App.css";

const API_URL = "https://skillora-s7ga.vercel.app/api/internships";

function cleanResults(items) {
  const seen = new Set();

  return (Array.isArray(items) ? items : []).filter((item) => {
    try {
      if (!item?.url) return false;

      const url = new URL(item.url);

      if (!["http:", "https:"].includes(url.protocol)) {
        return false;
      }

      const normalized = url.href
        .split("#")[0]
        .replace(/\/+$/, "");

      if (seen.has(normalized)) return false;

      seen.add(normalized);
      return true;
    } catch {
      return false;
    }
  });
}

function InternshipFinder({ onBack }) {
  const [role, setRole] = useState("software engineering");
  const [location, setLocation] = useState("India");
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [provider, setProvider] = useState("");

  async function searchInternships(event) {
    if (event) event.preventDefault();

    const searchRole = role.trim();
    const searchLocation = location.trim();

    if (!searchRole || !searchLocation) {
      setError("Please enter both a role and a location.");
      return;
    }

    setLoading(true);
    setError("");
    setInternships([]);
    setProvider("");
    setSearched(true);

    try {
      const params = new URLSearchParams({
        role: searchRole,
        location: searchLocation,
      });

      const response = await fetch(
        `${API_URL}?${params.toString()}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            `Internship service returned an error (${response.status}).`
        );
      }

      if (!data || !Array.isArray(data.results)) {
        throw new Error(
          "The internship service returned an unexpected response. Please check the backend API."
        );
      }

      const results = cleanResults(data.results);

      setInternships(results);
      setProvider(data.provider || "External search");

      if (results.length === 0) {
        setError(
          "No listings were returned for this search. Try a different role or location."
        );
      }
    } catch (err) {
      console.error("Internship search failed:", err);

      setError(
        err.message?.includes("Failed to fetch")
          ? "Could not connect to the internship service. Check your internet connection and backend deployment."
          : err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="internship-page">
      <button
        className="button-outline"
        type="button"
        onClick={onBack}
      >
        ← Back to dashboard
      </button>

      <section className="internship-hero">
        <span className="section-kicker">
          YOUR NEXT OPPORTUNITY
        </span>

        <h1>
          Find your internship<span>.</span>
        </h1>

        <p>
          Discover internship opportunities, explore different
          career paths, and take your next step.
        </p>

        <div className="internship-powered-by">
          <span
            className="internship-live-dot"
            aria-hidden="true"
          />
          Powered by internship search
        </div>
      </section>

      <form
        className="internship-search"
        onSubmit={searchInternships}
      >
        <label>
          <span>Role or skill</span>
          <input
            type="text"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            placeholder="e.g. Web Development"
            maxLength={100}
            required
          />
        </label>

        <label>
          <span>Location</span>
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="e.g. India or Bengaluru"
            maxLength={80}
            required
          />
        </label>

        <button
          className="button-coral internship-search-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Searching..." : "Find internships ↗"}
        </button>
      </form>

      <aside className="internship-trust-notice">
        <span className="trust-notice-icon" aria-hidden="true">
          🛡️
        </span>

        <div>
          <h3>Apply smart. Stay safe.</h3>
          <p>
            Listings come from external search results and have
            not been individually verified by Skillora. Check
            the original employer website before applying.
            Never pay a fee to secure an internship.
          </p>
        </div>
      </aside>

      {loading && (
        <div className="internship-message" role="status">
          <span
            className="internship-spinner"
            aria-hidden="true"
          />
          <div>
            <strong>Searching for opportunities...</strong>
            <p>
              Looking for {role.trim()} internships in{" "}
              {location.trim()}.
            </p>
          </div>
        </div>
      )}

      {!loading && error && (
        <div
          className="internship-message internship-error"
          role="alert"
        >
          <strong>Search notice</strong>
          <p>{error}</p>

          <button
            className="button-outline"
            type="button"
            onClick={() => searchInternships()}
          >
            Try again
          </button>
        </div>
      )}

      {!loading && internships.length > 0 && (
        <section className="internship-results">
          <div className="internship-results-heading">
            <div>
              <span className="section-kicker">
                SEARCH DISCOVERIES
              </span>

              <h2>Internship opportunities</h2>

              <p>
                Found {internships.length} listing
                {internships.length === 1 ? "" : "s"} for{" "}
                <strong>{role}</strong> in{" "}
                <strong>{location}</strong>.
              </p>
            </div>

            <span className="internship-result-count">
              {internships.length} results
            </span>
          </div>

          <div className="internship-source-info">
            <span
              className="internship-live-dot"
              aria-hidden="true"
            />
            Search provider: <strong>{provider}</strong>
          </div>

          <div className="internship-grid">
            {internships.map((item, index) => {
              let hostname = item.company || "External website";

              try {
                hostname = new URL(item.url).hostname.replace(
                  /^www\./i,
                  ""
                );
              } catch {
                // Keep the fallback source name.
              }

              return (
                <article
                  className="internship-card"
                  key={`${item.url}-${index}`}
                >
                  <div className="internship-card-top">
                    <span
                      className="internship-source-icon"
                      aria-hidden="true"
                    >
                      ↗
                    </span>

                    <span className="internship-status">
                      EXTERNAL LISTING
                    </span>
                  </div>

                  <h3>
                    {item.title || "Internship opportunity"}
                  </h3>

                  <p className="internship-company">
                    {item.company || hostname}
                  </p>

                  <p className="internship-description">
                    {item.snippet ||
                      "Open the original listing to learn about its requirements and application process."}
                  </p>

                  <div className="internship-card-footer">
                    <span
                      className="internship-source-label"
                      title={hostname}
                    >
                      {hostname}
                    </span>

                    <a
                      className="tool-link"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View original listing{" "}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="internship-results-disclaimer">
            Search results may include job boards, career pages,
            or expired listings. Check the original source for
            current availability and eligibility.
          </p>
        </section>
      )}

      {!loading &&
        !error &&
        internships.length === 0 &&
        !searched && (
          <section className="internship-empty-state">
            <span aria-hidden="true">✳</span>

            <h2>Your next opportunity starts here.</h2>

            <p>
              Enter your preferred role and location to discover
              internship listings.
            </p>

            <div className="internship-suggestions">
              <span>Try searching:</span>

              {[
                "Web Development",
                "Python",
                "Data Science",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="internship-suggestion"
                  onClick={() => setRole(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </section>
        )}
    </main>
  );
}

export default InternshipFinder;
