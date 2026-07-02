import { useState } from 'react';
import StatusBar from './components/StatusBar';
import BottomNav from './components/BottomNav';
import HomeView from './components/HomeView';
import ScanView from './components/ScanView';
import ChatView from './components/ChatView';
import PlanView from './components/PlanView';
import HealthView from './components/HealthView';
import MindView from './components/MindView';
import FitnessView from './components/FitnessView';
import SleepView from './components/SleepView';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <main
      className="min-h-screen grid place-items-center p-[28px] max-sm:p-0"
      aria-label="AI Lifestyle Health Companion prototype"
    >
      <section
        className="relative overflow-hidden border-[10px] border-[#1b2422] rounded-[48px] bg-[#f8faf7] shadow-[0_32px_96px_rgba(30,45,40,0.4)] max-sm:w-full max-sm:h-screen max-sm:min-h-screen max-sm:border-0 max-sm:rounded-none"
        style={{
          width: 'min(100%, 410px)',
          height: 'min(860px, calc(100vh - 56px))',
          minHeight: '740px',
        }}
        aria-label="Phone app mockup"
      >
        <StatusBar />

        <div className="h-[calc(100%-34px)] relative">
          {activeTab === 'home'   && <HomeView   onTabChange={setActiveTab} />}
          {activeTab === 'scan'   && <ScanView   onTabChange={setActiveTab} />}
          {activeTab === 'chat'   && <ChatView   onTabChange={setActiveTab} />}
          {activeTab === 'plan'   && <PlanView   onTabChange={setActiveTab} />}
          {activeTab === 'health' && <HealthView onTabChange={setActiveTab} />}
          {activeTab === 'mind'   && <MindView   onTabChange={setActiveTab} />}
          {activeTab === 'fitness' && <FitnessView onTabChange={setActiveTab} />}
          {activeTab === 'sleep' && <SleepView onTabChange={setActiveTab} />}

          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </section>
    </main>
  );
}
