import { useState } from "react";
import "./RevenueModel.css";

const plans = [
  {
    name: "Freemium",
    price: "₹0",
    period: "Free forever",
    description: "Get started with essential career tools.",
    features: [
      "Basic resume analysis",
      "Internship search",
      "Limited recommendations",
    ],
    style: "free",
    button: "Choose Free Plan",
  },
  {
    name: "Skillora Pro",
    price: "₹99",
    period: "/month",
    description: "Take your career preparation further.",
    features: [
      "Detailed AI-powered resume feedback",
      "ATS-focused suggestions",
      "Personalized internship recommendations",
      "Advanced resume improvement tools",
    ],
    style: "pro",
    button: "Explore Pro",
    popular: true,
  },
  {
    name: "Featured Internship Listings",
    price: "₹999",
    period: "/listing",
    description: "Help recruiters reach more students.",
    features: [
      "Increased internship visibility",
      "Promotional placement for recruiters",
      "Affordable option for smaller companies",
    ],
    style: "recruiter",
    button: "Post an Internship",
  },
];

export default function RevenueModel({ onSelectPlan }) {
  const [activePlan, setActivePlan] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [proForm, setProForm] = useState({
    name: "",
    email: "",
  });

  const [recruiterForm, setRecruiterForm] = useState({
    company: "",
    email: "",
    title: "",
    description: "",
  });

  function handlePlanClick(planName) {
    setActivePlan(planName);
    setSelectedPlan(null);

    if (planName === "Freemium") {
      setSelectedPlan({
        name: "Freemium",
        price: "₹0",
        period: "Free forever",
        user: "Student",
        email: "Not required",
        message: "Your free plan has been selected successfully.",
      });
    }
  }

  function handleProSubmit(event) {
    event.preventDefault();

    setSelectedPlan({
      name: "Skillora Pro",
      price: "₹99",
      period: "per month",
      user: proForm.name,
      email: proForm.email,
      message:
        "Your Pro selection has been recorded in this demo. No payment was processed.",
    });
  }

  function handleRecruiterSubmit(event) {
    event.preventDefault();

    setSelectedPlan({
      name: "Featured Internship Listings",
      price: "₹999",
      period: "per listing",
      user: recruiterForm.company,
      email: recruiterForm.email,
      title: recruiterForm.title,
      description: recruiterForm.description,
      message:
        "Your internship listing details have been recorded in this demo.",
    });
  }

  function closePanel() {
    setActivePlan("");
    setSelectedPlan(null);
  }

  function continueToSkillora() {
    if (
      selectedPlan?.name === "Freemium" ||
      selectedPlan?.name === "Skillora Pro"
    ) {
      const planName = selectedPlan.name;

      // Save the selected student plan in the browser.
      localStorage.setItem("skilloraSelectedPlan", planName);
      localStorage.setItem(
        "skilloraPlanSelectedAt",
        new Date().toISOString()
      );

      // Update the dashboard through App.jsx.
      if (onSelectPlan) {
        onSelectPlan(planName);
      }

      closePanel();
    } else {
      // Recruiter listings are not student membership plans.
      closePanel();
    }
  }

  return (
    <section className="revenue-section" id="revenue">
      <div className="revenue-container">
        <div className="revenue-heading">
          <span className="revenue-eyebrow">
            OUR PRICING STRATEGY
          </span>

          <h2>Career growth, made accessible.</h2>

          <p>
            Start for free, upgrade when you need more, or
            connect with students as a recruiter.
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <article
              className={`pricing-card ${plan.style}`}
              key={plan.name}
            >
              {plan.popular && (
                <span className="popular-badge">
                  MOST POPULAR
                </span>
              )}

              <h3>{plan.name}</h3>

              <p className="plan-description">
                {plan.description}
              </p>

              <div className="plan-price">
                <strong>{plan.price}</strong>
                <span>{plan.period}</span>
              </div>

              <div className="plan-divider" />

              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <span className="feature-check">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="pricing-button"
                onClick={() => handlePlanClick(plan.name)}
              >
                {plan.button}
                <span aria-hidden="true">↗</span>
              </button>
            </article>
          ))}
        </div>

        {activePlan && (
          <div className="pricing-action-panel">
            <button
              type="button"
              className="pricing-close"
              onClick={closePanel}
              aria-label="Close pricing panel"
            >
              ×
            </button>

            {selectedPlan ? (
              <div className="selected-plan-confirmation">
                <div className="selected-plan-icon">✓</div>

                <span className="confirmation-eyebrow">
                  SKILLORA REGISTRATION
                </span>

                <h3>Plan Selected Successfully!</h3>

                <p className="confirmation-intro">
                  Here are the details of your selected plan.
                </p>

                <div className="selected-plan-summary">
                  <span className="summary-label">
                    YOUR SELECTED PLAN
                  </span>

                  <h2>{selectedPlan.name}</h2>

                  <div className="confirmation-price">
                    <strong>{selectedPlan.price}</strong>
                    <span>{selectedPlan.period}</span>
                  </div>
                </div>

                <div className="selected-plan-details">
                  <p>
                    <strong>Name / Company</strong>
                    <span>{selectedPlan.user}</span>
                  </p>

                  <p>
                    <strong>Email</strong>
                    <span>{selectedPlan.email}</span>
                  </p>

                  {selectedPlan.title && (
                    <p>
                      <strong>Internship title</strong>
                      <span>{selectedPlan.title}</span>
                    </p>
                  )}

                  {selectedPlan.description && (
                    <p>
                      <strong>Description</strong>
                      <span>{selectedPlan.description}</span>
                    </p>
                  )}
                </div>

                <p className="pricing-feedback" role="status">
                  {selectedPlan.message}
                </p>

                <p className="selected-plan-note">
                  Demo only: no payment was processed, and your
                  details have not been sent to a server.
                </p>

                <button
                  type="button"
                  className="pricing-button confirmation-button"
                  onClick={continueToSkillora}
                >
                  Continue to Skillora →
                </button>
              </div>
            ) : activePlan === "Skillora Pro" ? (
              <>
                <div className="form-heading">
                  <span className="form-eyebrow">
                    SKILLORA PRO
                  </span>

                  <h3>Take your career preparation further.</h3>

                  <p>
                    Proposed price: ₹99/month. Enter your details
                    to register your interest in the Pro plan.
                  </p>
                </div>

                <form onSubmit={handleProSubmit}>
                  <label htmlFor="pro-name">Your name</label>

                  <input
                    id="pro-name"
                    type="text"
                    autoComplete="name"
                    value={proForm.name}
                    onChange={(event) =>
                      setProForm({
                        ...proForm,
                        name: event.target.value,
                      })
                    }
                    placeholder="Enter your name"
                    required
                  />

                  <label htmlFor="pro-email">
                    Email address
                  </label>

                  <input
                    id="pro-email"
                    type="email"
                    autoComplete="email"
                    value={proForm.email}
                    onChange={(event) =>
                      setProForm({
                        ...proForm,
                        email: event.target.value,
                      })
                    }
                    placeholder="you@example.com"
                    required
                  />

                  <button type="submit" className="pricing-button">
                    Confirm Pro Selection →
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="form-heading">
                  <span className="form-eyebrow">
                    FOR RECRUITERS
                  </span>

                  <h3>Promote an internship on Skillora.</h3>

                  <p>
                    Proposed price: ₹999 per featured listing.
                    Enter the details to preview your registration.
                  </p>
                </div>

                <form onSubmit={handleRecruiterSubmit}>
                  <label htmlFor="company-name">
                    Company name
                  </label>

                  <input
                    id="company-name"
                    type="text"
                    autoComplete="organization"
                    value={recruiterForm.company}
                    onChange={(event) =>
                      setRecruiterForm({
                        ...recruiterForm,
                        company: event.target.value,
                      })
                    }
                    placeholder="Enter company name"
                    required
                  />

                  <label htmlFor="recruiter-email">
                    Recruiter email
                  </label>

                  <input
                    id="recruiter-email"
                    type="email"
                    autoComplete="email"
                    value={recruiterForm.email}
                    onChange={(event) =>
                      setRecruiterForm({
                        ...recruiterForm,
                        email: event.target.value,
                      })
                    }
                    placeholder="recruiter@company.com"
                    required
                  />

                  <label htmlFor="internship-title">
                    Internship title
                  </label>

                  <input
                    id="internship-title"
                    type="text"
                    value={recruiterForm.title}
                    onChange={(event) =>
                      setRecruiterForm({
                        ...recruiterForm,
                        title: event.target.value,
                      })
                    }
                    placeholder="e.g. Frontend Developer Intern"
                    required
                  />

                  <label htmlFor="internship-description">
                    Internship description
                  </label>

                  <textarea
                    id="internship-description"
                    value={recruiterForm.description}
                    onChange={(event) =>
                      setRecruiterForm({
                        ...recruiterForm,
                        description: event.target.value,
                      })
                    }
                    placeholder="Describe the role and requirements"
                    rows={4}
                    required
                  />

                  <button type="submit" className="pricing-button">
                    Confirm Listing Details →
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        <div className="pricing-justification">
          <div className="justification-icon">₹</div>

          <div>
            <h3>Why this pricing?</h3>

            <p>
              Our proposed prices aim to keep career tools
              affordable for students while giving recruiters
              a promotional option. The free plan provides a
              starting point, while paid services offer
              additional features.
            </p>
          </div>
        </div>

        <p className="revenue-disclaimer">
          Proposed pricing for demonstration purposes.
          Payments are not enabled in this prototype.
        </p>
      </div>
    </section>
  );
}