import { useState, useEffect } from 'react';

const goals = [
  { id: 'lose-weight', emoji: '🔥', label: 'Lose Weight', desc: 'Healthy fat-loss with workout & meal plans' },
  { id: 'build-muscle', emoji: '💪', label: 'Build Muscle', desc: 'Strength-focused with progressive overload' },
  { id: 'heart-health', emoji: '❤️', label: 'Improve Heart Health', desc: 'Cardio plan with blood pressure insights' },
  { id: 'eat-healthier', emoji: '🥗', label: 'Eat Healthier', desc: 'Simple meal habits for your lifestyle' },
  { id: 'sleep-better', emoji: '😴', label: 'Sleep Better', desc: 'Sleep coaching & recovery habits' },
  { id: 'reduce-stress', emoji: '🧘', label: 'Reduce Stress', desc: 'Calmer routines & breathing practices' },
  { id: 'blood-sugar', emoji: '🩸', label: 'Manage Blood Sugar', desc: 'Smart carbs & meal timing support' },
  { id: 'blood-pressure', emoji: '🫀', label: 'Lower Blood Pressure', desc: 'Movement, salt awareness & hydration' },
];

export default function GoalSelectionScreen({ onNext, onGoalSelect, selectedGoal }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleContinue = () => {
    if (!selectedGoal) return;
    setExiting(true);
    setTimeout(() => onNext(), 450);
  };

  return (
    <div className={`onboarding-screen ${visible ? 'visible' : ''} ${exiting ? 'exiting' : ''}`}>
      {/* Progress bar */}
      <div className="onboarding-progress">
        <div className="onboarding-progress-bar" style={{ width: '20%' }} />
      </div>

      <div className="onboarding-scroll">
        <header className="onboarding-header">
          <span className="onboarding-step-label">Step 1 of 4</span>
          <h1 className="onboarding-title">What is your primary health goal?</h1>
          <p className="onboarding-desc">Choose one to personalize your AI health plan</p>
        </header>

        <div className="goal-grid">
          {goals.map((goal, i) => (
            <button
              key={goal.id}
              id={`goal-${goal.id}`}
              className={`goal-card ${selectedGoal === goal.id ? 'selected' : ''}`}
              style={{ animationDelay: `${i * 0.06}s` }}
              onClick={() => onGoalSelect(goal.id)}
            >
              <span className="goal-emoji">{goal.emoji}</span>
              <div className="goal-text">
                <strong className="goal-label">{goal.label}</strong>
                <span className="goal-desc">{goal.desc}</span>
              </div>
              {selectedGoal === goal.id && (
                <span className="goal-check">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="onboarding-footer">
        <button
          id="goal-continue-btn"
          className={`onboarding-cta ${selectedGoal ? 'active' : 'disabled'}`}
          onClick={handleContinue}
          disabled={!selectedGoal}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
