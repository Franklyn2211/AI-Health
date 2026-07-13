import { useState, useEffect } from 'react';
import { HealthProvider } from './context/HealthContext';
import { useHealth } from './context/healthContextCore';
import StatusBar from './components/StatusBar';
import BottomNav from './components/BottomNav';
import OnboardingForm from './components/OnboardingForm';
import HomeView from './components/HomeView';
import PlanView from './components/PlanView';
import LifestyleView from './components/LifestyleView';
import ConsultationAIView from './components/ConsultationAIView';
import ExpertTeamView from './components/ExpertTeamView';
import ProfileView from './components/ProfileView';
import FoodScannerView from './components/FoodScannerView';
import MealPlannerView from './components/MealPlannerView';
import FitnessPlannerView from './components/FitnessPlannerView';
import SleepTrackerView from './components/SleepTrackerView';
import MoodTrackerView from './components/MoodTrackerView';
import DoctorListView from './components/DoctorListView';
import WeeklyInsightsView from './components/WeeklyInsightsView';
import HealthMemoryView from './components/HealthMemoryView';
import ReviewedPlaybooksView from './components/ReviewedPlaybooksView';
import SpecialistChatView from './components/SpecialistChatView';
import DemoWalkthrough from './components/DemoWalkthrough';
import HealthTeamIntro from './components/HealthTeamIntro';
import { DEMO_STEPS } from './lib/demoSteps';

const HEALTH_TEAM_INTRO_KEY = 'healthTeamIntroV3Seen';
const MAIN_TABS = new Set(['home', 'plan', 'ai', 'clinic', 'profile']);

function normalizeMainTab(tabId) {
  return MAIN_TABS.has(tabId) ? tabId : 'home';
}

function AppContent() {
  const { hasOnboarded, loadDemoData, userProfile } = useHealth();
  const [activeTab, setActiveTab] = useState('home');
  const [activeSubView, setActiveSubView] = useState(null);
  const [demoGuideOpen, setDemoGuideOpen] = useState(false);
  const [demoStepIndex, setDemoStepIndex] = useState(0);
  const [showHealthTeamIntro, setShowHealthTeamIntro] = useState(() => (
    localStorage.getItem(HEALTH_TEAM_INTRO_KEY) !== 'true'
  ));

  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) setActiveTab(normalizeMainTab(savedTab));
  }, []);

  const [activeTabParams, setActiveTabParams] = useState(null);

  const handleTabChange = (tabId, params = null) => {
    const nextTab = normalizeMainTab(tabId);
    setActiveTab(nextTab);
    setActiveSubView(null);
    setActiveTabParams(params);
    localStorage.setItem('activeTab', nextTab);
  };

  const handleSubViewChange = (subViewId) => setActiveSubView(subViewId);
  const handleBackFromSubView = () => setActiveSubView(null);
  const handleDemoStepChange = (index) => {
    const boundedIndex = Math.max(0, Math.min(index, DEMO_STEPS.length - 1));
    const step = DEMO_STEPS[boundedIndex];
    const nextTab = normalizeMainTab(step.tab);
    setDemoStepIndex(boundedIndex);
    setActiveTab(nextTab);
    setActiveSubView(step.subView || null);
    setActiveTabParams(step.params || null);
    localStorage.setItem('activeTab', nextTab);
  };

  const handleLoadDemoForWalkthrough = () => {
    loadDemoData();
    handleDemoStepChange(0);
  };

  const handleHealthTeamContinue = () => {
    localStorage.setItem(HEALTH_TEAM_INTRO_KEY, 'true');
    setShowHealthTeamIntro(false);
    handleTabChange('home');
  };

  return (
    <main
      className="min-h-screen grid place-items-center p-[28px] max-sm:p-0"
      aria-label="VIN AI Health Companion"
    >
      <section
        className="relative overflow-hidden border-[8px] border-[#202725] rounded-[40px] bg-[#f7f8f5] shadow-[0_28px_80px_rgba(30,45,40,0.28)] max-sm:w-full max-sm:h-screen max-sm:min-h-screen max-sm:border-0 max-sm:rounded-none"
        style={{
          width: 'min(100%, 410px)',
          height: 'min(860px, calc(100vh - 56px))',
          minHeight: '740px',
          transform: 'translateZ(0)'
        }}
        aria-label="VIN AI app"
      >
        <StatusBar />

        <div className="h-[calc(100%-34px)] relative">
          {!hasOnboarded ? (
            <OnboardingForm onComplete={(nextTab = 'plan') => handleTabChange(nextTab)} />
          ) : showHealthTeamIntro ? (
            <HealthTeamIntro onContinue={handleHealthTeamContinue} />
          ) : (
            <>
              {/* ── Sub-Views ── */}
              {activeSubView === 'food-scanner'    && <FoodScannerView    onBack={handleBackFromSubView} />}
              {activeSubView === 'meal-planner'    && <MealPlannerView    onBack={handleBackFromSubView} onTabChange={handleTabChange} />}
              {activeSubView === 'fitness-routine' && <FitnessPlannerView onBack={handleBackFromSubView} onTabChange={handleTabChange} />}
              {activeSubView === 'sleep-tracker'   && <SleepTrackerView   onBack={handleBackFromSubView} />}
              {activeSubView === 'mood-tracker'    && <MoodTrackerView    onBack={handleBackFromSubView} />}
              {activeSubView === 'doctor-list'     && <DoctorListView     onBack={handleBackFromSubView} />}
              {activeSubView === 'weekly-insights' && <WeeklyInsightsView onBack={handleBackFromSubView} />}
              {activeSubView === 'health-memory'   && <HealthMemoryView   onBack={handleBackFromSubView} onTabChange={handleTabChange} />}
              {activeSubView === 'reviewed-playbooks' && <ReviewedPlaybooksView onBack={handleBackFromSubView} onTabChange={handleTabChange} />}
              {activeSubView === 'specialist-chat' && <SpecialistChatView onBack={handleBackFromSubView} onTabChange={handleTabChange} />}

              {/* ── Main Tabs (hidden when a sub-view is active) ── */}
              {!activeSubView && (
                <>
                  {activeTab === 'home'      && <HomeView      onTabChange={handleTabChange} onSubViewChange={handleSubViewChange} />}
                  {activeTab === 'plan'      && <PlanView      onTabChange={handleTabChange} onSubViewChange={handleSubViewChange} />}
                  {activeTab === 'lifestyle' && <LifestyleView onTabChange={handleTabChange} onSubViewChange={handleSubViewChange} />}
                  {activeTab === 'ai'        && <ConsultationAIView onTabChange={handleTabChange} onSubViewChange={handleSubViewChange} />}
                  {activeTab === 'clinic'    && <ExpertTeamView     onTabChange={handleTabChange} onSubViewChange={handleSubViewChange} params={activeTabParams} />}
                  {activeTab === 'profile'   && <ProfileView        onTabChange={handleTabChange} onSubViewChange={handleSubViewChange} onOpenDemo={() => setDemoGuideOpen(true)} />}
                </>
              )}

              {/* ── Bottom Nav (hidden in sub-views) ── */}
              {!activeSubView && (
                <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
              )}

              <DemoWalkthrough
                isOpen={demoGuideOpen}
                stepIndex={demoStepIndex}
                onClose={() => setDemoGuideOpen(false)}
                onStepChange={handleDemoStepChange}
                onLoadDemo={handleLoadDemoForWalkthrough}
                demoMode={Boolean(userProfile.demoMode)}
              />
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <HealthProvider>
      <AppContent />
    </HealthProvider>
  );
}
