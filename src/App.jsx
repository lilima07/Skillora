
import { useState } from "react";
import "./App.css";
import ResumeAnalyzer from "./ResumeAnalyzer";
import InternshipFinder from "./InternshipFinder";

const features = [
  {
    icon: "✳",
    title: "Improve your resume",
    description:
      "Understand your strengths and discover ways to present your skills better.",
    color: "mint",
  },
  {
    icon: "↗",
    title: "Explore opportunities",
    description:
      "Discover internships and entry-level roles suited to your goals.",
    color: "pink",
  },
  {
    icon: "◎",
    title: "Know your match",
    description:
      "Compare your skills with role requirements and find areas to improve.",
    color: "yellow",
  },
];

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("skilloraUser")) || null;
    } catch {
      return null;
    }
  });

  const [page, setPage] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("skilloraUser"))
        ? "profile"
        : "home";
    } catch {
      return "home";
    }
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function goTo(nextPage) {
    if (!user && !["home", "signup", "login"].includes(nextPage)) {
      nextPage = "signup";
    }

    setPage(nextPage);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setError("");
  }

  function handleAuth(event) {
    event.preventDefault();

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (page === "signup" && !form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    let accounts = [];

    try {
      accounts =
        JSON.parse(localStorage.getItem("skilloraAccounts")) || [];
    } catch {
      accounts = [];
    }

    if (page === "signup") {
      if (accounts.some((account) => account.email === email)) {
        setError("This email already has an account. Please log in.");
        return;
      }

      const newAccount = {
        name: form.name.trim(),
        email,
        password,
      };

      accounts.push(newAccount);

      try {
        localStorage.setItem(
          "skilloraAccounts",
          JSON.stringify(accounts)
        );
      } catch {
        setError("Browser storage is unavailable. Please try again.");
        return;
      }

      const nextUser = {
        name: newAccount.name,
        email: newAccount.email,
      };

      try {
        localStorage.setItem("skilloraUser", JSON.stringify(nextUser));
      } catch {
        // Continue for this browser session.
      }

      setUser(nextUser);
      setForm({ name: "", email: "", password: "" });
      setShowPassword(false);
      goTo("profile");
      return;
    }

    const account = accounts.find(
      (savedAccount) =>
        savedAccount.email === email &&
        savedAccount.password === password
    );

    if (!account) {
      setError("Incorrect email or password. Please try again.");
      return;
    }

    const nextUser = {
      name: account.name,
      email: account.email,
    };

    try {
      localStorage.setItem("skilloraUser", JSON.stringify(nextUser));
    } catch {
      // Continue for this browser session.
    }

    setUser(nextUser);
    setForm({ name: "", email: "", password: "" });
    setShowPassword(false);
    goTo("profile");
  }

  function logout() {
    try {
      localStorage.removeItem("skilloraUser");
    } catch {
      // Browser storage may be unavailable.
    }

    setUser(null);
    setForm({ name: "", email: "", password: "" });
    setShowPassword(false);
    goTo("home");
  }

  function SiteNavbar() {
    return (
      <header className="navbar">
        <button
          type="button"
          className="brand"
          onClick={() => goTo(user ? "profile" : "home")}
        >
          skillora<span>.</span>
        </button>

        <nav className="nav-links">
          <button
            type="button"
            onClick={() => goTo(user ? "profile" : "home")}
          >
            Home
          </button>

          {user ? (
            <>


              <button type="button" onClick={() => goTo("resume")}>
                Resume Analyzer
              </button>

              <button type="button" onClick={() => goTo("internships")}>
                Find Internships
              </button>

              <button
                type="button"
                className="button-outline"
                onClick={logout}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <a href="#about">About</a>

              <button type="button" onClick={() => goTo("login")}>
                Log in
              </button>

              <button
                type="button"
                className="button-coral nav-signup"
                onClick={() => goTo("signup")}
              >
                Sign up ↗
              </button>
            </>
          )}
        </nav>
      </header>
    );
  }

  return (
    <div className="app">
      {/* HOMEPAGE */}
      {page === "home" && (
        <>
          <SiteNavbar />

          <main>
            <section className="hero">
              <div className="hero-content">
                <span className="section-kicker">
                  YOUR CAREER, YOUR NEXT CHAPTER
                </span>

                <h1>
                  Make your
                  <br />
                  next move
                  <br />
                  <span>count.</span>
                </h1>

                <p>
                  Your skills deserve the right opportunity. Build a
                  stronger resume, discover internships, and take your
                  next career step with confidence.
                </p>

                <div className="hero-buttons">
                  <button
                    type="button"
                    className="button-coral"
                    onClick={() => goTo("signup")}
                  >
                    Get started <span>↗</span>
                  </button>

                  <a className="button-outline" href="#features">
                    Explore features ↓
                  </a>
                </div>
              </div>

              <div className="hero-art" aria-hidden="true">
                <div className="hero-art-card">
                  <div className="resume-preview-top">
                    <span className="resume-preview-avatar">S</span>

                    <div className="resume-preview-lines">
                      <div className="art-line" />
                      <div className="art-line short" />
                    </div>
                  </div>

                  <span className="preview-label">
                    YOUR CAREER PROFILE
                  </span>

                  <div className="art-line long" />
                  <div className="art-line medium" />

                  <span className="preview-label">
                    SKILLS &amp; STRENGTHS
                  </span>

                  <div className="preview-tags">
                    <span>Creative</span>
                    <span>Problem solving</span>
                    <span>Teamwork</span>
                  </div>

                  <div className="preview-footer">
                    GROW AT YOUR OWN PACE <span>↗</span>
                  </div>
                </div>

                <div className="floating-card floating-top">
                  ✦ &nbsp; Potential unlocked
                </div>

                <div className="floating-card floating-bottom">
                  <span className="floating-icon">↗</span>

                  <div>
                    <strong>One step at a time</strong>
                    <p>Your future starts here.</p>
                  </div>
                </div>

                <span className="hero-star hero-star-one">✳</span>
                <span className="hero-star hero-star-two">✦</span>
              </div>
            </section>

            <section className="features-section" id="features">
              <div className="section-heading">
                <span className="section-kicker">WHAT YOU CAN DO</span>
                <h2>A little support goes a long way.</h2>

                <p>
                  Everything you need to take your next career step
                  with confidence.
                </p>
              </div>

              <div className="features-grid">
                {features.map((feature) => (
                  <article
                    className={`feature-card ${feature.color}`}
                    key={feature.title}
                  >
                    <div className="feature-icon">{feature.icon}</div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="how-section" id="how-it-works">
              <span className="section-kicker">HOW IT WORKS</span>
              <h2>Your journey, one step at a time.</h2>

              <div className="steps-grid">
                <article className="step-card">
                  <span>01</span>
                  <h3>Build your profile</h3>
                  <p>
                    Tell Skillora about your skills and career goals.
                  </p>
                </article>

                <article className="step-card">
                  <span>02</span>
                  <h3>Explore opportunities</h3>
                  <p>
                    Find internships and roles that fit your interests.
                  </p>
                </article>

                <article className="step-card">
                  <span>03</span>
                  <h3>Take your next step</h3>
                  <p>
                    Improve your resume and prepare for your future.
                  </p>
                </article>
              </div>
            </section>

            <section className="about-strip" id="about">
              <div className="about-star">✳</div>

              <div>
                <h2>Your potential is not a checklist.</h2>
                <p>
                  Skillora helps you discover what you can do next.
                </p>
              </div>

              <button
                type="button"
                className="button-dark"
                onClick={() => goTo("signup")}
              >
                Take your next step ↗
              </button>
            </section>
          </main>

          <footer className="footer">
            <button
              type="button"
              className="brand footer-brand"
              onClick={() => goTo("home")}
            >
              skillora<span>.</span>
            </button>

            <p>Helping students take their next career step.</p>

            <span>© {new Date().getFullYear()} Skillora</span>
          </footer>
        </>
      )}

      {/* SIGNUP AND LOGIN */}
      {(page === "signup" || page === "login") && (
        <main className="auth-layout">
          <section className="auth-art">
            <button
              type="button"
              className="auth-back"
              onClick={() => goTo("home")}
            >
              ← Back to home
            </button>

            <div className="auth-art-content">
              <span className="section-kicker">YOUR NEXT CHAPTER</span>

              <h1>
                Big dreams.
                <br />
                <span>Small steps.</span>
                <br />
                Real progress.
              </h1>

              <p>
                Make room for your potential. Your career journey starts
                with one simple step.
              </p>

              <div className="auth-shapes" aria-hidden="true">
                <span>✳</span>
                <i />
                <b>↗</b>
              </div>
            </div>
          </section>

          <section className="auth-form-wrap">
            <div className="auth-form">
              <button
                type="button"
                className="brand auth-brand"
                onClick={() => goTo("home")}
              >
                skillora<span>.</span>
              </button>

              <span className="section-kicker">
                {page === "signup"
                  ? "LET'S GET YOU STARTED"
                  : "WELCOME BACK"}
              </span>

              <h2>
                {page === "signup"
                  ? "Create your account"
                  : "Good to see you."}
              </h2>

              <p className="auth-subtitle">
                {page === "signup"
                  ? "Create a space for your goals, skills, and next opportunity."
                  : "Log in to continue your career journey."}
              </p>

              <form onSubmit={handleAuth}>
                {page === "signup" && (
                  <label>
                    Your name

                    <input
                      name="name"
                      value={form.name}
                      onChange={updateForm}
                      placeholder="e.g. Alex Morgan"
                      autoComplete="name"
                      required
                    />
                  </label>
                )}

                <label>
                  Email address

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={updateForm}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </label>

                <label>
                  Password

                  <div className="password-field">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={updateForm}
                      placeholder="At least 6 characters"
                      autoComplete={
                        page === "signup"
                          ? "new-password"
                          : "current-password"
                      }
                      minLength={6}
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword((show) => !show)
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </label>

                {error && <p className="form-error">{error}</p>}

                <button
                  type="submit"
                  className="button-coral auth-submit"
                >
                  {page === "signup" ? "Create my account" : "Log in"}{" "}
                  <span>↗</span>
                </button>
              </form>

              <p className="auth-switch">
                {page === "signup"
                  ? "Already have an account?"
                  : "New to Skillora?"}

                <button
                  type="button"
                  onClick={() =>
                    goTo(page === "signup" ? "login" : "signup")
                  }
                >
                  {page === "signup" ? "Log in" : "Sign up"}
                </button>
              </p>
            </div>
          </section>
        </main>
      )}

      {/* STUDENT DASHBOARD */}
      {page === "profile" && user && (
        <>
          <SiteNavbar />

          <main className="dashboard-page">
            <section className="dashboard-welcome">
              <div>
                <span className="section-kicker">
                  YOUR CAREER, YOUR FUTURE
                </span>

                <h1>
                  Hey, {user.name?.split(" ")[0] || "there"}! <span>✳</span>
                </h1>

                <p>
                  Every big career starts with a small step. Let's make
                  yours count.
                </p>
              </div>

              <div className="dashboard-avatar">
                {(user.name || "S").charAt(0).toUpperCase()}
              </div>
            </section>

            <section className="dashboard-banner">
              <div className="banner-content">
                <span className="banner-label">YOUR NEXT STEP</span>
                <h2>Your future self will thank you.</h2>

                <p>
                  Start with your resume, discover new opportunities, and
                  find the roles that fit your skills.
                </p>

                <button
                  type="button"
                  className="button-coral"
                  onClick={() =>
                    document
                      .getElementById("dashboard-actions")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Explore your tools <span>↗</span>
                </button>
              </div>

              <div className="dashboard-banner-art" aria-hidden="true">
                <span>✳</span>
                <div>Dream big.</div>
                <div>Start small.</div>
                <div>Keep growing. ↗</div>
              </div>
            </section>

            <section className="dashboard-stats">
              <article className="dashboard-stat stat-mint">
                <span className="stat-icon">✳</span>
                <p>Resume status</p>
                <h3>Ready to analyze</h3>
                <span className="stat-note">Take your first step</span>
              </article>

              <article className="dashboard-stat stat-pink">
                <span className="stat-icon">↗</span>
                <p>Opportunities</p>
                <h3>Ready to explore</h3>
                <span className="stat-note">
                  Find your next possibility
                </span>
              </article>

              <article className="dashboard-stat stat-yellow">
                <span className="stat-icon">◎</span>
                <p>Skill match</p>
                <h3>Ready to explore</h3>
                <span className="stat-note">
                  Analyze your skills and discover opportunities
                </span>
              </article>
            </section>

            <section
              className="dashboard-section"
              id="dashboard-actions"
            >
              <div className="dashboard-section-heading">
                <div>
                  <span className="section-kicker">YOUR TOOLKIT</span>
                  <h2>What would you like to do?</h2>
                </div>
              </div>

              <div className="dashboard-tools">
                <article className="dashboard-tool">
                  <div className="tool-icon tool-mint">✳</div>
                  <span className="tool-label">STEP 01</span>
                  <h3>Resume analyzer</h3>

                  <p>
                    Review your resume, highlight your strengths, and
                    discover areas to improve.
                  </p>

                  <button
                    type="button"
                    className="tool-link"
                    onClick={() => goTo("resume")}
                  >
                    Analyze my resume <span>↗</span>
                  </button>
                </article>

                <article className="dashboard-tool">
                  <div className="tool-icon tool-pink">⌕</div>
                  <span className="tool-label">STEP 02</span>
                  <h3>Find internships</h3>

                  <p>
                    Explore internships and entry-level roles that match
                    your interests and goals.
                  </p>

                  <button
                    type="button"
                    className="tool-link"
                    onClick={() => goTo("internships")}
                  >
                    Explore opportunities <span>↗</span>
                  </button>
                </article>
              </div>
            </section>

            <section className="dashboard-bottom">
              <div className="dashboard-profile-card">
                <span className="section-kicker">YOUR ACCOUNT</span>

                <div className="account-row">
                  <div className="dashboard-avatar small-avatar">
                    {(user.name || "S").charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                </div>

                <span className="profile-tag">Career explorer</span>

                <button
                  type="button"
                  className="button-outline dashboard-logout"
                  onClick={logout}
                >
                  Log out
                </button>
              </div>

              <div className="dashboard-tip">
                <span className="tip-symbol">✦</span>

                <span className="section-kicker">
                  A LITTLE REMINDER
                </span>

                <h2>You don't need to have it all figured out.</h2>

                <p>
                  Keep learning, keep exploring, and take one step at a
                  time. Your journey is just getting started.
                </p>
              </div>
            </section>
          </main>

          <footer className="footer dashboard-footer">
            <button
              type="button"
              className="brand footer-brand"
              onClick={() => goTo("profile")}
            >
              skillora<span>.</span>
            </button>

            <p>Helping students take their next career step.</p>

            <span>© {new Date().getFullYear()} Skillora</span>
          </footer>
        </>
      )}

      {/* RESUME ANALYZER */}
      {page === "resume" && user && (
        <>
          <SiteNavbar />
          <ResumeAnalyzer onBack={() => goTo("profile")} />
        </>
      )}

      {/* INTERNSHIP FINDER */}
      {page === "internships" && user && (
        <>
          <SiteNavbar />
          <InternshipFinder onBack={() => goTo("profile")} />
        </>
      )}
    </div>
  );
}

export default App;
