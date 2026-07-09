import { useState, useEffect } from 'react';

const goalPlans = {
  'lose-weight': [
    { icon: '🏋', title: 'Workout Plan', detail: '3 strength + 2 cardio sessions per week', sub: 'Adapted to your equipment & experience' },
    { icon: '🥗', title: 'Meal Plan', detail: '1,800 kcal/day · High protein, balanced carbs', sub: 'Budget-friendly with your dietary preference' },
    { icon: '💧', title: 'Water Intake', detail: '2.2L daily target', sub: 'Hydration reminders every 2 hours' },
    { icon: '😴', title: 'Sleep Goal', detail: '7.5 hours per night', sub: 'Wind-down routine at 22:00' },
    { icon: '🚶', title: 'Daily Activity', detail: '8,000 steps minimum', sub: 'Walking after meals recommended' },
    { icon: '📅', title: 'Weekly Challenge', detail: 'Complete 5/7 workout days', sub: 'Progress reviewed every Sunday' },
  ],
  'build-muscle': [
    { icon: '🏋', title: 'Workout Plan', detail: 'Upper/Lower split · 4 days/week', sub: 'Progressive overload tracking' },
    { icon: '🥗', title: 'Meal Plan', detail: '2,400 kcal/day · 150g protein target', sub: 'Pre & post workout nutrition' },
    { icon: '💧', title: 'Water Intake', detail: '2.8L daily target', sub: 'Electrolytes on training days' },
    { icon: '😴', title: 'Sleep Goal', detail: '8 hours recovery sleep', sub: 'Sleep quality monitoring' },
    { icon: '🚶', title: 'Daily Activity', detail: '6,000 steps + training', sub: 'Active recovery on rest days' },
    { icon: '📅', title: 'Weekly Challenge', detail: 'Increase load by 2.5%', sub: 'Strength progress tracking' },
  ],
  'heart-health': [
    { icon: '🏋', title: 'Cardio Plan', detail: '30 min cardio · 5 days/week', sub: 'Zone 2 heart rate training' },
    { icon: '🥗', title: 'Heart-Healthy Meals', detail: 'Low sodium · Omega-3 rich', sub: 'Mediterranean-style diet' },
    { icon: '💧', title: 'Water Intake', detail: '2.5L daily target', sub: 'Reduce caffeine intake' },
    { icon: '😴', title: 'Sleep Goal', detail: '7-8 hours consistent', sub: 'Blood pressure monitoring' },
    { icon: '🚶', title: 'Daily Activity', detail: '10,000 steps', sub: 'Walking reduces resting heart rate' },
    { icon: '📅', title: 'Weekly Challenge', detail: '150 min moderate activity', sub: 'Heart rate variability tracking' },
  ],
};

// Fallback for goals without specific plans
const defaultPlan = [
  { icon: '🏋', title: 'Workout Plan', detail: 'Personalized exercise routine', sub: 'Based on your goals & ability' },
  { icon: '🥗', title: 'Meal Plan', detail: 'Balanced daily nutrition', sub: 'Matched to your preferences' },
  { icon: '💧', title: 'Water Intake', detail: '2.2L daily target', sub: 'Smart hydration reminders' },
  { icon: '😴', title: 'Sleep Goal', detail: '7-8 hours per night', sub: 'Sleep quality optimization' },
  { icon: '🚶', title: 'Daily Activity', detail: '8,000 steps goal', sub: 'Movement throughout the day' },
  { icon: '📅', title: 'Weekly Challenge', detail: 'Stay consistent for 7 days', sub: 'Weekly progress reviews' },
];

export default function PlanRevealScreen({ onNext, selectedGoal, profile }) {
  const [visible, setVisible] = useState(false);
  const [revealedCards, setRevealedCards] = useState(0);
  const [exiting, setExiting] = useState(false);

  const plan = goalPlans[selectedGoal] || defaultPlan;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timers = [];
    plan.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setRevealedCards(i + 1);
      }, 300 + i * 250));
    });
    return () => timers.forEach(clearTimeout);
  }, [visible, plan]);

  const handleStart = () => {
    setExiting(true);
    setTimeout(() => onNext(), 450);
  };

  const userName = profile.gender === 'Female' ? 'Queen' : profile.gender === 'Male' ? 'Champ' : 'Friend';

  return (
    <div className={`onboarding-screen plan-reveal ${visible ? 'visible' : ''} ${exiting ? 'exiting' : ''}`}>
      <div className="onboarding-progress">
        <div className="onboarding-progress-bar" style={{ width: '90%' }} />
      </div>

      <div className="onboarding-scroll">
        <header className="onboarding-header">
          <span className="onboarding-step-label">Your Plan is Ready! 🎉</span>
          <h1 className="onboarding-title">Your Personalized Health Plan</h1>
          <p className="onboarding-desc">Here's what VIN AI created for you, {userName}</p>
        </header>

        <div className="plan-cards">
          {plan.map((item, i) => (
            <div
              key={i}
              className={`plan-card ${i < revealedCards ? 'revealed' : ''}`}
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              <span className="plan-card-icon">{item.icon}</span>
              <div className="plan-card-content">
                <strong className="plan-card-title">{item.title}</strong>
                <span className="plan-card-detail">{item.detail}</span>
                <span className="plan-card-sub">{item.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="onboarding-footer">
        <button
          id="plan-start-btn"
          className={`onboarding-cta ${revealedCards >= plan.length ? 'active' : 'disabled'}`}
          onClick={handleStart}
          disabled={revealedCards < plan.length}
        >
          🚀 Start My Journey
        </button>
      </div>
    </div>
  );
}
