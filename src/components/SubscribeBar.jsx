import React, { useState, useEffect } from "react";

export default function SubscribeBar() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Honeypot anti-bot
  const [robot, setRobot] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("wu_subscribed_email");
    if (saved) {
      setOk(true);
      setEmail(saved);
    }
  }, []);

  function validate(e) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return re.test(e);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (robot) return; // bot trap

    if (!validate(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setBusy(true);

      // TODO: Wire to your backend / Email service here (Formspree/EmailJS/etc).
      // For now we simulate success:
      await new Promise((r) => setTimeout(r, 700));

      localStorage.setItem("wu_subscribed_email", email);
      setOk(true);
    } catch (err) {
      // Use the caught error so ESLint doesn't complain
      console.error("Subscribe error:", err);
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel subscribe" aria-labelledby="sub-title">
      <div className="sub-inner">
        <div>
          <h3 id="sub-title">Get weather updates</h3>
          <p className="sub-tagline">
            Subscribe to receive occasional updates and new features.
          </p>
        </div>

        {ok ? (
          <div className="sub-success" role="status">
            ✅ Subscribed with <strong>{email}</strong>. You’re all set!
          </div>
        ) : (
          <form className="sub-form" onSubmit={onSubmit} noValidate>
            {/* Honeypot input (hidden) */}
            <input
              type="text"
              value={robot}
              onChange={(e) => setRobot(e.target.value)}
              tabIndex="-1"
              autoComplete="off"
              className="hp"
            />

            <input
              type="email"
              className="sub-input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              required
            />
            <button className="btn sub-btn" type="submit" disabled={busy}>
              {busy ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}

        {error && (
          <div className="sub-error" role="alert">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
