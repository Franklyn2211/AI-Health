import { useState, useEffect } from 'react';

const analysisSteps = [
  { label: 'BMI Analysis', icon: '📊', getResult: (p) => {
    const h = (p.height || 170) / 100;
    const w = p.weight || 70;
    const bmi = (w / (h * h)).toFixed(1);
    const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal range' : bmi < 30 ? 'Overweight' : 'Obese';
    return `BMI: ${bmi} — ${cat}`;
  }},
  { label: 'Lifestyle Analysis', icon: '🏃', getResult: (p) => {
    const act = p.activity || 3;
    const sleep = p.sleep || 7;
    const level = act <= 2 ? 'Low activity' : act <= 3 ? 'Moderate activity' : 'Active lifestyle';
    const sleepNote = sleep < 6 ? ', sleep needs improvement' : sleep >= 7 ? ', good sleep pattern' : ', adequate sleep';
    return `${level}${sleepNote}`;
  }},
  { label: 'Risk Assessment', icon: '⚠️', getResult: (p) => {
    const medical = p.medical || [];
    if (medical.length === 0 || (medical.length === 1 && medical[0] === 'None')) return 'Low risk — no major conditions detected';
    if (medical.length <= 2) return `Moderate risk — monitoring ${medical[0]}`;
    return `Elevated risk — multiple conditions require attention`;
  }},
  { label: 'Goal Feasibility', icon: '🎯', getResult: () => {
    return 'Goal is achievable with consistent effort';
  }},
  { label: 'Personalized Recommendation', icon: '✨', getResult: (p, goal) => {
    const goals = {
      'lose-weight': 'Focus on caloric deficit with strength training',
      'build-muscle': 'Progressive overload with high-protein nutrition',
      'heart-health': 'Cardio routine with heart-healthy meals',
      'eat-healthier': 'Balanced nutrition with portion awareness',
      'sleep-better': 'Sleep hygiene optimization with wind-down routine',
      'reduce-stress': 'Mindfulness practice with gentle movement',
      'blood-sugar': 'Glycemic-friendly meals with regular monitoring',
      'blood-pressure': 'DASH-style diet with stress management',
    };
    return goals[goal] || 'Comprehensive lifestyle improvement plan ready';
  }},
];

export default function AIAnalysisScreen({ onNext, profile, selectedGoal }) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [results, setResults] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timers = [];
    // Start first step after 600ms
    timers.push(setTimeout(() => setCurrentStep(0), 600));

    analysisSteps.forEach((step, i) => {
      timers.push(setTimeout(() => {
        setResults(prev => [...prev, step.getResult(profile, selectedGoal)]);
        if (i < analysisSteps.length - 1) {
          setCurrentStep(i + 1);
        } else {
          setTimeout(() => setCompleted(true), 500);
        }
      }, 1200 + i * 1000));
    });

    return () => timers.forEach(clearTimeout);
  }, [profile, selectedGoal]);

  const handleContinue = () => {
    setExiting(true);
    setTimeout(() => onNext(), 450);
  };

  const progress = ((results.length) / analysisSteps.length) * 100;

  return (
    <div className={`analysis-screen ${exiting ? 'exiting' : ''}`}>
      {/* Scanning animation */}
      <div className="analysis-ring-container">
        <svg className="analysis-ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
          <circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke="url(#ring-gradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${progress * 3.27} ${327 - progress * 3.27}`}
            strokeDashoffset="82"
            className="analysis-ring-progress"
          />
          <defs>
            <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
        </svg>
        <div className="analysis-ring-center">
          {completed ? (
            <span className="analysis-complete-icon">✅</span>
          ) : (
            <>
              <span className="analysis-percent">{Math.round(progress)}%</span>
              <span className="analysis-ring-label">Analyzing</span>
            </>
          )}
        </div>
      </div>

      <h2 className="analysis-title">
        {completed ? 'Analysis Complete!' : 'VIN AI is analyzing your health profile'}
      </h2>

      {/* Step list */}
      <div className="analysis-steps">
        {analysisSteps.map((step, i) => (
          <div
            key={i}
            className={`analysis-step ${i < results.length ? 'done' : ''} ${i === currentStep && i >= results.length ? 'active' : ''}`}
          >
            <span className="analysis-step-icon">
              {i < results.length ? '✅' : i === currentStep ? (
                <span className="analysis-spinner" />
              ) : step.icon}
            </span>
            <div className="analysis-step-content">
              <span className="analysis-step-label">{step.label}</span>
              {i < results.length && (
                <span className="analysis-step-result">{results[i]}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {completed && (
        <button
          id="analysis-continue-btn"
          className="onboarding-cta active analysis-cta"
          onClick={handleContinue}
        >
          View My Health Plan
        </button>
      )}
    </div>
  );
}
