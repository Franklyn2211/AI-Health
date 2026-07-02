import { useState, useEffect } from 'react';

const genderOptions = ['Male', 'Female', 'Other'];
const dietaryOptions = ['No restriction', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Halal', 'Gluten-free'];
const exerciseOptions = ['Beginner', 'Intermediate', 'Advanced'];
const equipmentOptions = ['None', 'Dumbbells', 'Resistance bands', 'Pull-up bar', 'Full gym', 'Yoga mat', 'Treadmill', 'Stationary bike'];
const medicalOptions = ['None', 'Diabetes', 'Hypertension', 'Heart disease', 'Asthma', 'Arthritis', 'Thyroid', 'Anemia', 'High cholesterol', 'Other'];

export default function HealthAssessmentScreen({ onNext, onProfileUpdate, profile }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: '👤' },
    { id: 'medical', label: 'Medical', icon: '🩺' },
    { id: 'lifestyle', label: 'Lifestyle', icon: '🏃' },
  ];

  const updateField = (field, value) => {
    onProfileUpdate({ ...profile, [field]: value });
  };

  const toggleArrayField = (field, value) => {
    const arr = profile[field] || [];
    if (arr.includes(value)) {
      onProfileUpdate({ ...profile, [field]: arr.filter(v => v !== value) });
    } else {
      onProfileUpdate({ ...profile, [field]: [...arr, value] });
    }
  };

  const handleNext = () => {
    if (currentSection < 2) {
      setCurrentSection(s => s + 1);
    } else {
      setExiting(true);
      setTimeout(() => onNext(), 450);
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(s => s - 1);
    }
  };

  const progressPercent = 20 + ((currentSection + 1) / 3) * 30;

  return (
    <div className={`onboarding-screen ${visible ? 'visible' : ''} ${exiting ? 'exiting' : ''}`}>
      <div className="onboarding-progress">
        <div className="onboarding-progress-bar" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="onboarding-scroll">
        <header className="onboarding-header">
          <span className="onboarding-step-label">Step 2 of 4</span>
          <h1 className="onboarding-title">Tell us about yourself</h1>
          <p className="onboarding-desc">We'll personalize everything based on your profile</p>
        </header>

        {/* Section tabs */}
        <div className="assessment-tabs">
          {sections.map((sec, i) => (
            <button
              key={sec.id}
              className={`assessment-tab ${i === currentSection ? 'active' : ''} ${i < currentSection ? 'done' : ''}`}
              onClick={() => setCurrentSection(i)}
            >
              <span className="assessment-tab-icon">{i < currentSection ? '✓' : sec.icon}</span>
              <span className="assessment-tab-label">{sec.label}</span>
            </button>
          ))}
        </div>

        {/* Section 0: Basic Info */}
        {currentSection === 0 && (
          <div className="assessment-section" key="basic">
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter your age"
                value={profile.age || ''}
                onChange={e => updateField('age', e.target.value)}
                min="10"
                max="120"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <div className="form-chip-group">
                {genderOptions.map(g => (
                  <button
                    key={g}
                    className={`form-chip ${profile.gender === g ? 'selected' : ''}`}
                    onClick={() => updateField('gender', g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="170"
                  value={profile.height || ''}
                  onChange={e => updateField('height', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="70"
                  value={profile.weight || ''}
                  onChange={e => updateField('weight', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 1: Medical */}
        {currentSection === 1 && (
          <div className="assessment-section" key="medical">
            <div className="form-group">
              <label className="form-label">Medical History</label>
              <p className="form-hint">Select all that apply</p>
              <div className="form-chip-group wrap">
                {medicalOptions.map(m => (
                  <button
                    key={m}
                    className={`form-chip ${(profile.medical || []).includes(m) ? 'selected' : ''}`}
                    onClick={() => toggleArrayField('medical', m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Lifestyle */}
        {currentSection === 2 && (
          <div className="assessment-section" key="lifestyle">
            <div className="form-group">
              <label className="form-label">Daily Activity Level</label>
              <div className="form-slider-container">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={profile.activity || 3}
                  onChange={e => updateField('activity', Number(e.target.value))}
                  className="form-slider"
                />
                <div className="form-slider-labels">
                  <span>Sedentary</span>
                  <span>Moderate</span>
                  <span>Very Active</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Sleep Duration (hours)</label>
              <div className="form-slider-container">
                <input
                  type="range"
                  min="3"
                  max="12"
                  value={profile.sleep || 7}
                  onChange={e => updateField('sleep', Number(e.target.value))}
                  className="form-slider"
                />
                <div className="form-slider-value">{profile.sleep || 7} hours / night</div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Dietary Preference</label>
              <div className="form-chip-group wrap">
                {dietaryOptions.map(d => (
                  <button
                    key={d}
                    className={`form-chip ${profile.diet === d ? 'selected' : ''}`}
                    onClick={() => updateField('diet', d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Exercise Experience</label>
              <div className="form-chip-group">
                {exerciseOptions.map(e => (
                  <button
                    key={e}
                    className={`form-chip ${profile.experience === e ? 'selected' : ''}`}
                    onClick={() => updateField('experience', e)}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Available Equipment</label>
              <p className="form-hint">Select all that apply</p>
              <div className="form-chip-group wrap">
                {equipmentOptions.map(eq => (
                  <button
                    key={eq}
                    className={`form-chip ${(profile.equipment || []).includes(eq) ? 'selected' : ''}`}
                    onClick={() => toggleArrayField('equipment', eq)}
                  >
                    {eq}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="onboarding-footer">
        {currentSection > 0 && (
          <button className="onboarding-back" onClick={handleBack}>
            Back
          </button>
        )}
        <button
          id="assessment-next-btn"
          className="onboarding-cta active"
          onClick={handleNext}
        >
          {currentSection === 2 ? 'Analyze My Health' : 'Next'}
        </button>
      </div>
    </div>
  );
}
