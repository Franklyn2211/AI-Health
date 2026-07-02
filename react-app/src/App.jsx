import { useState } from 'react';
import StatusBar from './components/StatusBar';
import BottomNav from './components/BottomNav';
import WelcomeScreen from './components/WelcomeScreen';
import GoalSelectionScreen from './components/GoalSelectionScreen';
import HealthAssessmentScreen from './components/HealthAssessmentScreen';
import AIAnalysisScreen from './components/AIAnalysisScreen';
import PlanRevealScreen from './components/PlanRevealScreen';
import HomeView from './components/HomeView';
import ChatView from './components/ChatView';
import HealthView from './components/HealthView';
import DoctorView from './components/DoctorView';
import FollowUpView from './components/FollowUpView';

export default function App() {
  // App phase: 'welcome' | 'goal' | 'assessment' | 'analysis' | 'plan-reveal' | 'dashboard'
  const [appPhase, setAppPhase] = useState('welcome');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    medical: [],
    activity: 3,
    sleep: 7,
    diet: '',
    experience: '',
    equipment: [],
  });

  const isDashboard = appPhase === 'dashboard';

  return (
    <main
      className="min-h-screen grid place-items-center p-[28px] max-sm:p-0"
      aria-label="TARA AI Preventive Healthcare Companion"
    >
      <section
        className="relative overflow-hidden border-[10px] border-[#1b2422] rounded-[48px] bg-[#f8faf7] shadow-[0_32px_96px_rgba(30,45,40,0.4)] max-sm:w-full max-sm:h-screen max-sm:min-h-screen max-sm:border-0 max-sm:rounded-none"
        style={{
          width: 'min(100%, 410px)',
          height: 'min(860px, calc(100vh - 56px))',
          minHeight: '740px',
        }}
        aria-label="TARA AI app"
      >
        <StatusBar />

        <div className="h-[calc(100%-34px)] relative">
          {/* Onboarding flow */}
          {appPhase === 'welcome' && (
            <WelcomeScreen onNext={() => setAppPhase('goal')} />
          )}

          {appPhase === 'goal' && (
            <GoalSelectionScreen
              onNext={() => setAppPhase('assessment')}
              onGoalSelect={setSelectedGoal}
              selectedGoal={selectedGoal}
            />
          )}

          {appPhase === 'assessment' && (
            <HealthAssessmentScreen
              onNext={() => setAppPhase('analysis')}
              onProfileUpdate={setProfile}
              profile={profile}
            />
          )}

          {appPhase === 'analysis' && (
            <AIAnalysisScreen
              onNext={() => setAppPhase('plan-reveal')}
              profile={profile}
              selectedGoal={selectedGoal}
            />
          )}

          {appPhase === 'plan-reveal' && (
            <PlanRevealScreen
              onNext={() => setAppPhase('dashboard')}
              selectedGoal={selectedGoal}
              profile={profile}
            />
          )}

          {/* Dashboard views */}
          {isDashboard && activeTab === 'home' && (
            <HomeView
              onTabChange={setActiveTab}
              selectedGoal={selectedGoal}
            />
          )}
          {isDashboard && activeTab === 'health' && (
            <HealthView onTabChange={setActiveTab} />
          )}
          {isDashboard && activeTab === 'chat' && (
            <ChatView onTabChange={setActiveTab} />
          )}
          {isDashboard && activeTab === 'doctor' && (
            <DoctorView onTabChange={setActiveTab} />
          )}
          {isDashboard && activeTab === 'followup' && (
            <FollowUpView onTabChange={setActiveTab} />
          )}
          {isDashboard && activeTab === 'profile' && (
            <div className="screen-scroll h-full overflow-y-auto px-5 pt-5 pb-24">
              <header className="mb-5">
                <p className="m-0 mb-1 uppercase text-[11px] leading-tight text-[#61716c] font-[850]">
                  Settings
                </p>
                <h1 className="text-2xl leading-tight font-[800]">Profile</h1>
              </header>

              <section className="rounded-3xl bg-white p-5 shadow-lg shadow-black/5 mb-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#1f6e64] grid place-items-center text-white text-xl font-[900] shadow-lg shadow-[#1f6e64]/30">
                    TA
                  </div>
                  <div>
                    <h2 className="text-lg font-[800]">TARA User</h2>
                    <p className="text-[13px] text-[#61716c]">{selectedGoal ? selectedGoal.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'No goal set'}</p>
                  </div>
                </div>
                <div className="grid gap-2 text-[13px]">
                  <div className="flex justify-between py-2 border-b border-[#e4eae6]">
                    <span className="text-[#61716c]">Age</span>
                    <strong>{profile.age || '—'}</strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#e4eae6]">
                    <span className="text-[#61716c]">Gender</span>
                    <strong>{profile.gender || '—'}</strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#e4eae6]">
                    <span className="text-[#61716c]">Height</span>
                    <strong>{profile.height ? `${profile.height} cm` : '—'}</strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#e4eae6]">
                    <span className="text-[#61716c]">Weight</span>
                    <strong>{profile.weight ? `${profile.weight} kg` : '—'}</strong>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[#61716c]">Diet</span>
                    <strong>{profile.diet || '—'}</strong>
                  </div>
                </div>
              </section>

              <button
                className="w-full min-h-[48px] rounded-2xl bg-[#f4f8f5] text-[#b91c1c] font-[800] text-[13px] border-0 shadow-md shadow-black/5 transition-all active:scale-95"
                onClick={() => {
                  setAppPhase('welcome');
                  setActiveTab('home');
                  setSelectedGoal('');
                  setProfile({ age: '', gender: '', height: '', weight: '', medical: [], activity: 3, sleep: 7, diet: '', experience: '', equipment: [] });
                }}
              >
                Restart Onboarding
              </button>
            </div>
          )}

          {/* Bottom nav only in dashboard */}
          {isDashboard && (
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
          )}
        </div>
      </section>
    </main>
  );
}
