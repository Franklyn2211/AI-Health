import { useState, useEffect } from 'react';
import { HealthProvider, useHealth } from './context/HealthContext';
import StatusBar from './components/StatusBar';
import BottomNav from './components/BottomNav';
import OnboardingForm from './components/OnboardingForm';
import HomeView from './components/HomeView';
import LifestyleView from './components/LifestyleView';
import ConsultationAIView from './components/ConsultationAIView';
import DoctorClinicView from './components/DoctorClinicView';
import ProfileView from './components/ProfileView';
import FoodScannerView from './components/FoodScannerView';
import MealPlannerView from './components/MealPlannerView';
import FitnessPlannerView from './components/FitnessPlannerView';
import SleepTrackerView from './components/SleepTrackerView';
import MoodTrackerView from './components/MoodTrackerView';
import DoctorListView from './components/DoctorListView';

function AppContent() {
  const { hasOnboarded } = useHealth();
  const [activeTab, setActiveTab] = useState('home');
  const [activeSubView, setActiveSubView] = useState(null);

  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) setActiveTab(savedTab);
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setActiveSubView(null);
    localStorage.setItem('activeTab', tabId);
  };

  const handleSubViewChange = (subViewId) => setActiveSubView(subViewId);
  const handleBackFromSubView = () => setActiveSubView(null);

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
          {!hasOnboarded ? (
            <OnboardingForm onComplete={() => {}} />
          ) : (
            <>
              {/* ── Sub-Views ── */}
              {activeSubView === 'food-scanner'    && <FoodScannerView    onBack={handleBackFromSubView} />}
              {activeSubView === 'meal-planner'    && <MealPlannerView    onBack={handleBackFromSubView} />}
              {activeSubView === 'fitness-routine' && <FitnessPlannerView onBack={handleBackFromSubView} />}
              {activeSubView === 'sleep-tracker'   && <SleepTrackerView   onBack={handleBackFromSubView} />}
              {activeSubView === 'mood-tracker'    && <MoodTrackerView    onBack={handleBackFromSubView} />}
              {activeSubView === 'doctor-list'     && <DoctorListView     onBack={handleBackFromSubView} />}

              {/* ── Main Tabs (hidden when a sub-view is active) ── */}
              {!activeSubView && (
                <>
                  {activeTab === 'home'      && <HomeView      onTabChange={handleTabChange} onSubViewChange={handleSubViewChange} />}
                  {activeTab === 'lifestyle' && <LifestyleView onTabChange={handleTabChange} onSubViewChange={handleSubViewChange} />}
                  {activeTab === 'ai'        && <ConsultationAIView onTabChange={handleTabChange} />}
                  {activeTab === 'clinic'    && <DoctorClinicView   onTabChange={handleTabChange} onSubViewChange={handleSubViewChange} />}
                  {activeTab === 'profile'   && <ProfileView        onTabChange={handleTabChange} />}
                </>
              )}

              {/* ── Bottom Nav (hidden in sub-views) ── */}
              {!activeSubView && (
                <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
              )}
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
