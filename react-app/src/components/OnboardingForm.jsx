import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import {
  ChevronRight, ArrowLeft, CheckCircle2,
  Flame, Moon, ShieldCheck, Activity,
  Stethoscope, Star, Search, User
} from 'lucide-react';

const GOAL_OPTIONS = [
  { id: 'body-goals', label: 'Body Goals', Icon: Flame },
  { id: 'mental-health', label: 'Mental Health', Icon: Moon },
  { id: 'immune-booster', label: 'Immune Booster', Icon: ShieldCheck }
];

const CONDITION_OPTIONS = ['Diabetes', 'Hypertension', 'High Cholesterol', 'GERD', 'Pregnancy', 'None'];
const ALLERGY_OPTIONS = ['Peanut', 'Seafood', 'Milk', 'Egg', 'Soy', 'Gluten', 'None'];
const EQUIPMENT_OPTIONS = ['Gym', 'Dumbells at home', 'No equipment'];
const DIET_OPTIONS = ['Carnivore/High protein', 'Vegan', 'Vegetarian', 'Halal', 'Low carb', 'Lactose-free'];

export default function OnboardingForm({ onComplete }) {
  const { completeOnboarding } = useHealth();
  const [currentStep, setCurrentStep] = useState(0);

  const [onboardingData, setOnboardingData] = useState({
    email: '',
    phone: '',
    password: '',
    goals: [],
    gender: '',
    age: '',
    currentWeight: '',
    targetWeight: '',
    height: '',
    conditions: [],
    allergies: [],
    equipment: '',
    diet: ''
  });

  const hasPreferences = onboardingData.goals.includes('body-goals') || onboardingData.goals.length > 0;

  const updateData = (key, value) => setOnboardingData(prev => ({ ...prev, [key]: value }));

  const toggleArrayItem = (key, value, isExclusiveNone = false) => {
    setOnboardingData(prev => {
      const currentArray = prev[key];
      if (isExclusiveNone) {
        if (value === 'None') return { ...prev, [key]: ['None'] };
        const newArray = currentArray.filter(i => i !== 'None');
        if (newArray.includes(value)) return { ...prev, [key]: newArray.filter(i => i !== value) };
        return { ...prev, [key]: [...newArray, value] };
      } else {
        if (currentArray.includes(value)) return { ...prev, [key]: currentArray.filter(i => i !== value) };
        return { ...prev, [key]: [...currentArray, value] };
      }
    });
  };

  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handleBack = () => setCurrentStep(prev => prev - 1);

  const handleFinish = () => {
    if (completeOnboarding) {
      completeOnboarding(
        "User", 
        onboardingData.email, 
        onboardingData.phone, 
        onboardingData.goals, 
        { 
          healthConditions: onboardingData.conditions, 
          allergies: onboardingData.allergies,
          currentWeight: onboardingData.currentWeight,
          targetWeight: onboardingData.targetWeight,
          height: onboardingData.height,
          gender: onboardingData.gender,
          age: onboardingData.age,
          diet: onboardingData.diet,
          equipment: onboardingData.equipment
        }
      );
    }
    if (onComplete) onComplete();
  };

  const getContinueDisabled = () => {
    switch (currentStep) {
      case 1: return (!onboardingData.email && !onboardingData.phone) || onboardingData.password.length < 6;
      case 2: return onboardingData.goals.length === 0;
      case 3: return !onboardingData.gender || !onboardingData.age || !onboardingData.currentWeight || !onboardingData.targetWeight || !onboardingData.height;
      case 4: return onboardingData.conditions.length === 0;
      case 5: return onboardingData.allergies.length === 0;
      case 6: return !onboardingData.equipment || !onboardingData.diet;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex flex-col h-full items-center justify-center text-center px-4 mt-8">
            <div className="w-24 h-24 bg-teal-100 rounded-[2rem] flex items-center justify-center mb-8 shadow-sm">
              <ShieldCheck size={48} className="text-teal-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">AI-Health</h1>
            <p className="text-base text-slate-500 mb-8 max-w-[280px] leading-relaxed">
              Your intelligent companion for a healthier, happier life. Personalized just for you.
            </p>
          </div>
        );
      case 1:
        return (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-sm text-slate-500 mb-6">Enter your details to login or create a new account.</p>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Email</label>
                <input type="email" value={onboardingData.email} onChange={(e) => updateData('email', e.target.value)} placeholder="user@email.com" className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nomor Telepon</label>
                <input type="tel" value={onboardingData.phone} onChange={(e) => updateData('phone', e.target.value)} placeholder="08123456789" className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Password</label>
                <input type="password" value={onboardingData.password} onChange={(e) => updateData('password', e.target.value)} placeholder="Enter your password" className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 outline-none transition-all" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">What is your primary health goal?</h1>
            <p className="text-sm text-slate-500 mb-6">Select all that apply to personalize your experience.</p>
            <div className="space-y-3">
              {GOAL_OPTIONS.map(({ id, label, Icon }) => {
                const active = onboardingData.goals.includes(id);
                return (
                  <button key={id} onClick={() => toggleArrayItem('goals', id)} className={`w-full flex items-center gap-4 p-4 rounded-3xl border text-left transition-all active:scale-[0.98] ${active ? 'border-teal-500 bg-teal-50 shadow-sm' : 'border-slate-100 bg-white shadow-sm'}`}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${active ? 'bg-teal-600 text-white' : 'bg-slate-50 text-slate-500'}`}><Icon size={20} /></div>
                    <span className={`flex-1 font-semibold ${active ? 'text-teal-700' : 'text-slate-700'}`}>{label}</span>
                    <CheckCircle2 size={20} className={active ? 'text-teal-600' : 'text-slate-200'} fill={active ? '#e6faf7' : 'none'} />
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Tell us about yourself</h1>
            <p className="text-sm text-slate-500 mb-6">This helps us calculate your specific needs.</p>
            <div className="space-y-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Gender</label>
                <div className="flex gap-3">
                  {['Male', 'Female'].map(g => (
                    <button key={g} onClick={() => updateData('gender', g)} className={`flex-1 py-3.5 rounded-2xl border font-semibold text-sm transition-all ${onboardingData.gender === g ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-600'}`}>{g}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Age</label>
                  <input type="number" value={onboardingData.age} onChange={(e) => updateData('age', e.target.value)} placeholder="Years" className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 text-sm focus:border-teal-500 focus:bg-white outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Height (cm)</label>
                  <input type="number" value={onboardingData.height} onChange={(e) => updateData('height', e.target.value)} placeholder="e.g. 170" className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 text-sm focus:border-teal-500 focus:bg-white outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Weight (kg)</label>
                  <input type="number" value={onboardingData.currentWeight} onChange={(e) => updateData('currentWeight', e.target.value)} placeholder="Current" className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 text-sm focus:border-teal-500 focus:bg-white outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Target (kg)</label>
                  <input type="number" value={onboardingData.targetWeight} onChange={(e) => updateData('targetWeight', e.target.value)} placeholder="Target" className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 text-sm focus:border-teal-500 focus:bg-white outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Do you have any health conditions?</h1>
            <div className="flex flex-wrap gap-2.5 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mt-6">
              {CONDITION_OPTIONS.map((condition) => {
                const active = onboardingData.conditions.includes(condition);
                return (
                  <button key={condition} onClick={() => toggleArrayItem('conditions', condition, true)} className={`px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-all active:scale-[0.97] ${active ? condition === 'None' ? 'border-slate-500 bg-slate-700 text-white shadow-sm' : 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-600'}`}>{condition}</button>
                );
              })}
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Do you have any food allergies?</h1>
            <div className="flex flex-wrap gap-2.5 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mt-6">
              {ALLERGY_OPTIONS.map((allergy) => {
                const active = onboardingData.allergies.includes(allergy);
                return (
                  <button key={allergy} onClick={() => toggleArrayItem('allergies', allergy, true)} className={`px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-all active:scale-[0.97] ${active ? allergy === 'None' ? 'border-slate-500 bg-slate-700 text-white shadow-sm' : 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-600'}`}>{allergy}</button>
                );
              })}
            </div>
          </div>
        );
      case 6:
        return (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Preferences</h1>
            <p className="text-sm text-slate-500 mb-6">Let's refine how you'll achieve your goals.</p>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Workout Equipment</label>
                <div className="flex flex-col gap-2">
                  {EQUIPMENT_OPTIONS.map(opt => (
                    <button key={opt} onClick={() => updateData('equipment', opt)} className={`w-full text-left px-4 py-3.5 rounded-2xl border font-semibold text-sm transition-all ${onboardingData.equipment === opt ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-600'}`}>{opt}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Diet Methods</label>
                <div className="grid grid-cols-2 gap-3">
                  {DIET_OPTIONS.map(opt => (
                    <button key={opt} onClick={() => updateData('diet', opt)} className={`py-3.5 px-2 rounded-2xl border font-semibold text-xs text-center transition-all ${onboardingData.diet === opt ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-600'}`}>{opt}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Your Health Team</h1>
            <p className="text-sm text-slate-500 mb-6">Based on your goals, here are recommended specialists to consult.</p>
            <div className="space-y-6">
              <div>
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Dr. Umum</h2>
                <div className="p-4 rounded-3xl border border-slate-100 bg-white shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0"><Stethoscope size={24} /></div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-900">Dr. Andi Pratama</h3>
                    <p className="text-xs text-slate-500">General Practitioner</p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Dr. Spesialis</h2>
                <div className="p-4 rounded-3xl border border-slate-100 bg-white shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0"><Activity size={24} /></div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-900">Dr. Sarah Jenkins</h3>
                    <p className="text-xs text-slate-500">Clinical Nutritionist</p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Personal Trainer</h2>
                <div className="p-4 rounded-3xl border border-slate-100 bg-white shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0"><User size={24} /></div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-900">Bima Arya</h3>
                    <p className="text-xs text-slate-500">Certified PT</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="flex-1 overflow-y-auto px-5 pt-8 pb-6">
        {currentStep > 1 && currentStep < 7 && (
          <div className="flex items-center gap-2 mb-7">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${i < (currentStep - 1) ? 'bg-teal-600' : 'bg-slate-200'}`} />
            ))}
          </div>
        )}
        {renderStep()}
      </div>
      <div className="shrink-0 px-5 pb-8 pt-4 border-t border-slate-100 bg-white rounded-t-3xl shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
        {currentStep === 0 && (
          <button onClick={handleNext} className="w-full h-12 rounded-2xl bg-teal-600 text-white text-sm font-bold border-0 shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2">Get Started <ChevronRight size={16} /></button>
        )}
        {currentStep > 0 && currentStep < 7 && (
          <div className="flex gap-3">
             <button onClick={handleBack} className="h-12 px-5 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition-all active:scale-[0.98] flex items-center justify-center"><ArrowLeft size={16} /></button>
            <button onClick={handleNext} disabled={getContinueDisabled()} className="flex-1 h-12 rounded-2xl bg-teal-600 text-white text-sm font-bold border-0 shadow-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">Continue <ChevronRight size={16} /></button>
          </div>
        )}
        {currentStep === 7 && (
          <div className="flex gap-3">
            <button onClick={handleBack} className="h-12 px-5 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition-all active:scale-[0.98] flex items-center justify-center"><ArrowLeft size={16} /></button>
            <button onClick={handleFinish} className="flex-1 h-12 rounded-2xl bg-teal-600 text-white text-sm font-bold border-0 shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2">Finish & Enter App <ChevronRight size={16} /></button>
          </div>
        )}
      </div>
    </div>
  );
}
