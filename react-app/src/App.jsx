import { useState } from 'react';
import StatusBar from './components/StatusBar';
import BottomNav from './components/BottomNav';
import HomeView from './components/HomeView';
import ScanView from './components/ScanView';
import PlanView from './components/PlanView';
import HealthView from './components/HealthView';
import MindView from './components/MindView';

/**
 * App — Main container.
 * Manages the active tab state and renders the phone mockup shell
 * plus the correct screen based on the active tab.
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    /* Stage: full-page centering wrapper */
    <main
      className="min-h-screen grid place-items-center p-[28px] max-sm:p-0"
      aria-label="AI Lifestyle Health Companion prototype"
    >
      {/* Phone mockup shell */}
      <section
        className="relative overflow-hidden border-[10px] border-[#1b2422] rounded-[38px] bg-[#f8faf7] shadow-[0_28px_80px_rgba(30,45,40,0.32)] max-sm:w-full max-sm:h-screen max-sm:min-h-screen max-sm:border-0 max-sm:rounded-none"
        style={{
          width: 'min(100%, 410px)',
          height: 'min(860px, calc(100vh - 56px))',
          minHeight: '740px',
        }}
        aria-label="Phone app mockup"
      >
        {/* Status bar (always visible) */}
        <StatusBar />

        {/* Screens — only the active tab is rendered */}
        <div className="h-[calc(100%-34px)] relative">
          {activeTab === 'home'   && <HomeView   onTabChange={setActiveTab} />}
          {activeTab === 'scan'   && <ScanView   onTabChange={setActiveTab} />}
          {activeTab === 'plan'   && <PlanView   onTabChange={setActiveTab} />}
          {activeTab === 'health' && <HealthView onTabChange={setActiveTab} />}
          {activeTab === 'mind'   && <MindView   onTabChange={setActiveTab} />}

          {/* Bottom navigation (always visible, positioned absolute) */}
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </section>
    </main>
  );
}
