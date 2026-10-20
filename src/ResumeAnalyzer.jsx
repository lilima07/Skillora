
import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import "./ResumeAnalyzer.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const API_BASE = "";;

const sections = [
  { label: "Contact information", terms: ["@", "phone", "linkedin", "github"] },
  { label: "Education", terms: ["education", "university", "college", "degree", "bachelor"] },
  { label: "Skills", terms: ["skills", "technologies", "javascript", "python", "react"] },
  { label: "Experience", terms: ["experience", "employment", "intern", "worked"] },
  { label: "Projects", terms: ["projects", "developed", "built", "created"] },
  { label: "Achievements", terms: ["achievements", "certifications", "awards", "courses"] },
];

const knownSkills = [
  "javascript",
  "typescript",
  "react",
  "node.js",
  "express",
  "html",
  "css",
  "python",
  "java",
  "c++",
  "sql",
  "mongodb",
  "mysql",
  "git",
  "github",
  "docker",
  "aws",
  "machine learning",
  "data analysis",
  "excel",
  "figma",
  "ui/ux",
  "next.js",
  "rest api",
  "django",
  "flask",
  "communication",
];

function extractSkills(text) {
  const normalized = text.toLowerCase();

  return knownSkills.filter((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(
      `(^|[^a-z0-9+#.])${escaped}(?=$|[^a-z0-9+#.])`,
      "i"
    );

    return pattern.test(normalized);
  });
}

function analyzeResume(text) {
  const content = text.toLowerCase();

  const results = sections.map((section) => ({
    label: section.label,
    found: section.terms.some((term) => content.includes(term)),
  }));

  const foundCount = results.filter((item) => item.found).length;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  let score = Math.round((foundCount / sections.length) * 70);

  if (wordCount >= 150) score += 10;
  if (wordCount >= 300) score += 10;

  const hasMetrics =
    /\d+%|\d+\s*(users|projects|clients|hours)/i.test(text);

  if (hasMetrics) score += 10;

  const suggestions = [];

  if (!results[0].found) {
    suggestions.push("Add your email and professional contact information.");
  }

  if (!results[1].found) {
    suggestions.push("Add your education, degree, and college.");
  }

  if (!results[2].found) {
    suggestions.push("List technical and soft skills relevant to your target role.");
  }

  if (!results[3].found) {
    suggestions.push("Include internships, work experience, or practical experience.");
  }

  if (!results[4].found) {
    suggestions.push("Showcase projects and explain your contribution.");
  }

  if (!results[5].found) {
    suggestions.push("Include relevant certifications, courses, or achievements.");
  }

  if (!hasMetrics) {
    suggestions.push("Add measurable results where possible.");
  }

  if (wordCount < 150) {
    suggestions.push(
      "Your extracted resume text is short. Check that all pages contain readable text."
    );
  }

  return {
    score: Math.min(score, 100),
    wordCount,
    sections: results,
    suggestions,
    skills: extractSkills(text),
  };
}

function getInternshipList(data) {
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.internships)) return data.internships;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;

  return [];
}

export default function ResumeAnalyzer({ onBack }) {
  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [internshipError, setInternshipError] = useState("");
  const [internships, setInternships] = useState([]);

  function handleFileChange(event) {
    const selected = event.target.files?.[0];

    setError("");
    setReport(null);
    setInternships([]);
    setInternshipError("");

    if (!selected) {
      setFile(null);
      return;
    }

    if (
      selected.type !== "application/pdf" &&
      !selected.name.toLowerCase().endsWith(".pdf")
    ) {
      setFile(null);
      setError("Please upload a PDF file.");
      event.target.value = "";
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setFile(null);
      setError("Your PDF must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setFile(selected);
  }

  async function handleAnalyze() {
    if (!file) {
      setError("Choose a PDF resume before analyzing.");
      return;
    }

    setLoading(true);
    setError("");
    setReport(null);
    setInternships([]);
    setInternshipError("");

    try {
      const buffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(buffer),
      }).promise;

      let fullText = "";

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();

        fullText +=
          textContent.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ") + "\n";
      }

      if (fullText.trim().length < 20) {
        throw new Error(
          "No readable text found. Scanned PDFs may need OCR first."
        );
      }

      setReport(analyzeResume(fullText));
    } catch (err) {
      setError(err?.message || "Could not read this PDF.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFindInternships() {
    if (!report) return;

    if (report.skills.length === 0) {
      setInternshipError(
        "No supported skills were detected. Add technical skills to your resume or search manually."
      );
      return;
    }

    setSearching(true);
    setInternshipError("");
    setInternships([]);

    try {
      const params = new URLSearchParams({
        role: `${report.skills.join(", ")} internship`,
        location: "India",
      });

      const response = await fetch(
        `${API_BASE}/api/internships?${params.toString()}`
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || `Internship search failed (${response.status}).`
        );
      }

      const results = getInternshipList(data);

      if (results.length === 0) {
        throw new Error(
          "No internship results were returned. Try different skills."
        );
      }

      setInternships(results);
    } catch (err) {
      setInternshipError(
        err?.message ||
          "Could not connect to the internship server. Check that your backend is running."
      );
    } finally {
      setSearching(false);
    }
  }

  function resetAnalyzer() {
    setFile(null);
    setReport(null);
    setError("");
    setInternships([]);
    setInternshipError("");

    const input = document.getElementById("resume-file-input");
    if (input) input.value = "";
  }

  return (
    <main className="resume-page">
      <div className="resume-topbar">
        <button className="resume-back" onClick={onBack}>
          ← Back to dashboard
        </button>

        <span className="resume-brand">
          skillora<span>.</span>
        </span>
      </div>

      <section className="resume-heading">
        <span className="resume-eyebrow">YOUR NEXT CHAPTER</span>

        <h1>
          Make your resume <span>stand out.</span>
        </h1>

        <p>
          Review your resume, identify your skills, and discover relevant
          internship opportunities.
        </p>
      </section>

      <section className="resume-upload-card">
        <div className="resume-upload-icon">↑</div>

        <h2>Upload your resume</h2>
        <p>Choose a PDF file up to 5 MB.</p>

        <label className="resume-file-label" htmlFor="resume-file-input">
          Choose PDF resume
        </label>

        <input
          id="resume-file-input"
          className="resume-file-input"
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
        />

        {file && (
          <div className="resume-selected-file">
            <span className="resume-file-icon">PDF</span>

            <div>
              <strong>{file.name}</strong>
              <p>{(file.size / 1024).toFixed(0)} KB</p>
            </div>

            <button onClick={resetAnalyzer} aria-label="Remove selected file">
              ×
            </button>
          </div>
        )}

        {error && <p className="resume-error">{error}</p>}

        <button
          className="resume-primary-button"
          onClick={handleAnalyze}
          disabled={!file || loading}
        >
          {loading ? "Analyzing resume..." : "Analyze my resume ↗"}
        </button>

        <p className="resume-privacy">
          Resume analysis.
        </p>
      </section>

      {report && (
        <section className="resume-report">
          <div className="resume-report-header">
            <div>
              <span className="resume-eyebrow">YOUR RESUME REPORT</span>

              <h2>Your starting point</h2>

              <p>
                This is a basic checklist score, not a prediction of hiring
                success.
              </p>
            </div>

            <div
              className="resume-score"
              style={{ "--score-angle": `${report.score * 3.6}deg` }}
            >
              <div>
                <strong>{report.score}</strong>
                <span>/100</span>
              </div>
            </div>
          </div>

          <div className="resume-summary-grid">
            <article className="resume-summary-card">
              <span>Text extracted</span>
              <strong>{report.wordCount}</strong>
              <small>Approximate words</small>
            </article>

            <article className="resume-summary-card">
              <span>Sections detected</span>
              <strong>
                {report.sections.filter((item) => item.found).length}/
                {report.sections.length}
              </strong>
              <small>Common resume sections</small>
            </article>
          </div>

          <article className="resume-result-card">
            <h3>Skills detected</h3>

            {report.skills.length > 0 ? (
              <div className="resume-skills-list">
                {report.skills.map((skill) => (
                  <span className="resume-skill-tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p>
                No supported skills were detected. Check your resume's skills
                section.
              </p>
            )}
          </article>

          <div className="resume-report-columns">
            <article className="resume-result-card">
              <h3>Resume checklist</h3>

              {report.sections.map((section) => (
                <div className="resume-check-row" key={section.label}>
                  <span>{section.label}</span>

                  <strong
                    className={
                      section.found ? "check-found" : "check-missing"
                    }
                  >
                    {section.found ? "Detected" : "Review"}
                  </strong>
                </div>
              ))}
            </article>

            <article className="resume-result-card resume-suggestions-card">
              <h3>Ways to improve</h3>

              {report.suggestions.length === 0 ? (
                <p>
                  The basic checklist looks good. Tailor your resume to each
                  job description.
                </p>
              ) : (
                <ul>
                  {report.suggestions.map((suggestion) => (
                    <li key={suggestion}>{suggestion}</li>
                  ))}
                </ul>
              )}
            </article>
          </div>

          <article className="resume-result-card resume-matching-card">
            <h3>Find internships matching your skills</h3>

            <p>
              Search for internship listings related to the skills detected
              in your resume.
            </p>

            <button
              className="resume-primary-button"
              onClick={handleFindInternships}
              disabled={searching || report.skills.length === 0}
            >
              {searching
                ? "Searching internships..."
                : "Find Matching Internships ↗"}
            </button>

            {internshipError && (
              <p className="resume-error">{internshipError}</p>
            )}

            {internships.length > 0 && (
              <div className="resume-internship-list">
                <h3>Search results</h3>

                {internships.map((item, index) => {
                  const title =
                    item.title ||
                    item.role ||
                    item.position ||
                    "Internship opportunity";

                  const company =
                    item.company ||
                    item.companyName ||
                    item.organization ||
                    "Company not specified";

                  const url =
                    item.url ||
                    item.applyUrl ||
                    item.applicationUrl ||
                    item.link ||
                    "";

                  const description =
                    item.description || item.summary || item.snippet || "";

                  return (
                    <article
                      className="resume-internship-item"
                      key={`${title}-${index}`}
                    >
                      <h4>{title}</h4>

                      <p>{company}</p>

                      {description && <p>{description}</p>}

                      {/^https?:\/\//i.test(url) ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View original listing ↗
                        </a>
                      ) : (
                        <p>
                          No valid listing URL was provided. Verify this
                          opportunity before applying.
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </article>

          <button
            className="resume-secondary-button"
            onClick={resetAnalyzer}
          >
            Analyze another resume
          </button>
        </section>
      )}
    </main>
  );
}
