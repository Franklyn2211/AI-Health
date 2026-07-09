import { useState, useEffect } from 'react';

const floatingIcons = ['❤️', '🧬', '🩺', '💊', '🏃', '🥗', '😴', '💧', '🧘', '📊'];

export default function WelcomeScreen({ onNext }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleStart = () => {
    setExiting(true);
    setTimeout(() => onNext(), 500);
  };

  return (
    <div className={`welcome-screen ${visible ? 'visible' : ''} ${exiting ? 'exiting' : ''}`}>
      {/* Floating health icons */}
      <div className="welcome-floating-icons" aria-hidden="true">
        {floatingIcons.map((icon, i) => (
          <span
            key={i}
            className="welcome-float-icon"
            style={{
              left: `${8 + (i % 5) * 20}%`,
              top: `${10 + Math.floor(i / 5) * 45}%`,
              animationDelay: `${i * 0.4}s`,
              fontSize: `${20 + (i % 3) * 6}px`,
            }}
          >
            {icon}
          </span>
        ))}
      </div>

      {/* Gradient orb */}
      <div className="welcome-orb" aria-hidden="true" />

      {/* Content */}
      <div className="welcome-content">
        <div className="welcome-logo-container">
          <div className="welcome-logo">
            <span className="welcome-logo-icon">🛡️</span>
          </div>
          <div className="welcome-logo-ring" />
        </div>

        <h1 className="welcome-title">
          Welcome to <span className="welcome-brand">VIN AI</span>
        </h1>

        <p className="welcome-subtitle">
          Your AI-powered preventive healthcare companion.
        </p>

        <div className="welcome-features">
          {['Smart Health Analysis', 'Personalized Plans', 'Early Risk Detection'].map((f, i) => (
            <div key={i} className="welcome-feature-chip" style={{ animationDelay: `${0.8 + i * 0.15}s` }}>
              <span className="welcome-feature-dot" />
              {f}
            </div>
          ))}
        </div>

        <button
          id="welcome-start-btn"
          className="welcome-cta"
          onClick={handleStart}
        >
          <span>Get Started</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        <p className="welcome-footer">Free · No credit card required</p>
      </div>
    </div>
  );
}
