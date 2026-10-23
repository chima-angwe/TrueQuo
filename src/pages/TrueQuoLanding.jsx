import { useState } from "react";
import "./CasePreview.css";

const PORTAL_URL = "https://chima-angwe.github.io/truequo-portal/";
const WAITLIST_URL = "https://truequo-backend.onrender.com/api/waitlist";
const BRAND_MARK = `${import.meta.env.BASE_URL}truequo-mark.svg`;

const Arrow = ({ diagonal = false }) => (
  <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>
);

function WorkflowPreview() {
  return (
    <div className="workflow-window case-preview-window" aria-label="A verification case moving through its workflow">
      <div className="case-preview-topbar">
        <div className="case-preview-brand"><img className="brand-mark" src={BRAND_MARK} alt="" /><span>Case workspace</span></div>
        <span className="case-preview-status"><i /> In progress</span>
      </div>
      <div className="case-preview-content">
        <div className="case-preview-table" role="table" aria-label="Case summary">
          <div className="case-preview-head" role="row"><span role="columnheader">Case</span><span role="columnheader">Candidate</span><span role="columnheader">Check</span><span role="columnheader">Status</span></div>
          <div className="case-preview-row" role="row">
            <span className="case-preview-number" role="cell">TR-1004<span className="case-preview-mobile-name">Hauwa Bello</span></span>
            <span className="case-preview-candidate" role="cell">Hauwa Bello</span>
            <span className="case-preview-check" role="cell"><strong>Employment</strong><span>Zenith Bank</span></span>
            <span className="case-preview-row-status" role="cell"><i /> In progress</span>
          </div>
        </div>
        <div className="case-progress-heading"><span>CASE PROGRESS</span><span>Step 3 of 4</span></div>
        <div className="case-flow" aria-label="Received, assigned, verifying, then reviewed">
          <div className="case-flow-rail" aria-hidden="true"><span /></div>
          {["Received", "Assigned", "Verifying", "Reviewed"].map((step, index) => <div className={`case-flow-step ${index < 2 ? "is-done" : ""} ${index === 2 ? "is-current" : ""}`} key={step} style={{ "--step-index": index }}><span className="case-flow-dot">{index < 2 ? "✓" : ""}</span><span className="case-flow-label">{step}</span></div>)}
        </div>
      </div>
    </div>
  );
}

const capabilities = [
  { number: "01", title: "Keep cases together", text: "Bring candidate details, check types, ownership and progress into one case workspace." },
  { number: "02", title: "Coordinate the checks", text: "Assign verification tasks and see what is moving, waiting or needs attention." },
  { number: "03", title: "Review before completion", text: "Give supervisors a clear place to review findings and return work when it needs follow-up." },
];

function WaitlistForm() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", role: "" });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const updateField = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
    if (status === "error") {
      setStatus("idle");
      setMessage("");
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(WAITLIST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        throw new Error(result.message || "We couldn’t add you right now. Please try again.");
      }
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(error.name === "AbortError"
        ? "The request took too long. Please try again."
        : error.message || "Unable to connect. Please try again in a moment.");
    } finally {
      window.clearTimeout(timeout);
    }
  };

  if (status === "success") {
    return (
      <div className="waitlist-success" role="status">
        <span className="waitlist-success-icon">✓</span>
        <h3>You’re on the list.</h3>
        <p>Thanks for your interest, {formData.name.split(" ")[0]}. We’ll be in touch at <strong>{formData.email}</strong>.</p>
        <button className="waitlist-reset" onClick={() => { setFormData({ name: "", email: "", company: "", role: "" }); setStatus("idle"); }}>Register someone else</button>
      </div>
    );
  }

  return (
    <form className="waitlist-form" onSubmit={submit}>
      <div className="waitlist-field-row">
        <label className="waitlist-field"><span>Full name</span><input name="name" autoComplete="name" placeholder="Your name" value={formData.name} onChange={updateField} required disabled={status === "submitting"} /></label>
        <label className="waitlist-field"><span>Work email</span><input name="email" type="email" autoComplete="email" placeholder="you@company.com" value={formData.email} onChange={updateField} required disabled={status === "submitting"} /></label>
      </div>
      <label className="waitlist-field"><span>Company</span><input name="company" autoComplete="organization" placeholder="Company name" value={formData.company} onChange={updateField} required disabled={status === "submitting"} /></label>
      <label className="waitlist-field"><span>Your role</span><select name="role" value={formData.role} onChange={updateField} required disabled={status === "submitting"}><option value="" disabled>Select your role</option><option value="operations">Operations manager</option><option value="supervisor">Supervisor / QA lead</option><option value="founder">Founder / executive</option><option value="other">Other</option></select></label>
      {status === "error" && <p className="waitlist-error" role="alert">{message}</p>}
      <button className="button button-primary waitlist-submit" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Joining…" : "Join the waitlist"}<Arrow /></button>
      <p className="waitlist-privacy">We’ll only use these details to follow up about TrueQuo.</p>
    </form>
  );
}

function TrueQuoLanding() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="TrueQuo home"><img className="wordmark-mark" src={BRAND_MARK} alt="" /><span><span className="wordmark-t">T</span>rue<span className="wordmark-q">Q</span>uo</span></a>
        <nav className="main-nav" aria-label="Main navigation"><a href="#workflow">The workflow</a><a href="#built-for">Who it’s for</a></nav>
        <a className="header-cta" href={PORTAL_URL} target="_blank" rel="noreferrer">Open the portal <Arrow diagonal /></a>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> BUILT FOR VERIFICATION OPERATIONS</span>
          <h1>Keep every verification case <em>moving.</em></h1>
          <p className="hero-lede">TrueQuo gives background verification teams one place to coordinate checks, follow progress and review findings—from intake through completion.</p>
          <div className="hero-actions"><a className="button button-primary" href={PORTAL_URL} target="_blank" rel="noreferrer">Explore the TrueQuo portal <Arrow diagonal /></a><a className="text-link" href="#waitlist">Join the waitlist <Arrow /></a></div>
          <div className="hero-proof"><span className="proof-check">✓</span><span>Designed around the day-to-day work of verification teams</span></div>
        </div>
        <div className="hero-visual"><div className="visual-label"><span className="visual-label-dot" /> THE WORK, CLEARLY IN VIEW</div><WorkflowPreview /><div className="visual-caption"><span>01</span> A shared view of cases, tasks and next steps</div></div>
        <div className="hero-watermark" aria-hidden="true">TQ</div>
      </section>

      <section className="waitlist-section" id="waitlist">
        <div className="waitlist-layout">
          <div className="waitlist-copy"><span className="eyebrow">EARLY ACCESS</span><h2>Help shape how<br /><em>the work gets done.</em></h2><p>Join the TrueQuo pilot waitlist for updates and an opportunity to explore the workflow with us.</p><div className="waitlist-note"><span>↗</span> Built for background verification teams</div></div>
          <div className="waitlist-card"><div className="waitlist-card-heading"><span>TRUEQUO · PILOT ACCESS</span><h3>Join the waitlist</h3><p>Tell us a little about yourself and your team.</p></div><WaitlistForm /></div>
        </div>
      </section>

      <section className="workflow-section" id="workflow">
        <div className="section-intro"><span className="eyebrow">FROM REQUEST TO REVIEW</span><h2>The work has many steps.<br /><em>Keep them connected.</em></h2><p>Each case can involve multiple checks, people and follow-ups. TrueQuo helps your team keep the moving parts and their status together.</p></div>
        <div className="steps-track">{[{n:"01",t:"Receive",d:"Capture the request and the checks needed."},{n:"02",t:"Assign",d:"Route tasks to the people doing the work."},{n:"03",t:"Verify",d:"Record findings and manage follow-ups."},{n:"04",t:"Review",d:"Review work before the case is completed."}].map((step, i) => <div className="step" key={step.n}><div className="step-top"><span>{step.n}</span>{i < 3 && <i />}</div><h3>{step.t}</h3><p>{step.d}</p></div>)}</div>
      </section>

      <section className="capabilities-section" id="built-for">
        <div className="capabilities-heading"><div><span className="eyebrow">MADE FOR THE OPERATIONS LAYER</span><h2>More than a checklist.<br /><em>A view of the whole case.</em></h2></div><p>Built for background verification providers coordinating work across operations, verifiers and reviewers.</p></div>
        <div className="capability-grid">{capabilities.map((item) => <article className="capability-card" key={item.number}><span className="capability-number">{item.number}</span><div className="capability-icon">{item.number === "01" ? "▤" : item.number === "02" ? "↗" : "✓"}</div><h3>{item.title}</h3><p>{item.text}</p><span className="card-arrow"><Arrow /></span></article>)}</div>
      </section>

      <section className="closing-cta"><div className="closing-orb" /><div className="closing-content"><span className="eyebrow">SEE THE PRODUCT</span><h2>Take a closer look at<br /><em>verification work in motion.</em></h2><p>Explore the TrueQuo portal and see how the workflow comes together.</p><div className="closing-actions"><a className="button button-light" href={PORTAL_URL} target="_blank" rel="noreferrer">Go to the TrueQuo portal <Arrow diagonal /></a><a className="closing-waitlist" href="#waitlist">Join the waitlist <Arrow /></a></div></div><div className="closing-mark" aria-hidden="true">T</div></section>

      <footer className="site-footer"><a className="wordmark footer-wordmark" href="#home"><img className="wordmark-mark" src={BRAND_MARK} alt="" /><span><span className="wordmark-t">T</span>rue<span className="wordmark-q">Q</span>uo</span></a><span>Verification work, brought into view.</span><a href={PORTAL_URL} target="_blank" rel="noreferrer">Open portal <Arrow diagonal /></a><small>© {new Date().getFullYear()} TrueQuo</small></footer>
    </main>
  );
}

export default TrueQuoLanding;
