import { useState, useRef, useEffect } from 'react';

function replyToPsychMessage(message) {
  const lower = message.toLowerCase();
  if (lower.includes("anxious") || lower.includes("racing")) {
    return "Let us slow it down. Name one thought, one body feeling, and one small action you can take in the next five minutes.";
  }
  if (lower.includes("overwhelmed") || lower.includes("start")) {
    return "That sounds heavy. Pick one tiny next step: drink water, write the top worry, or do two minutes of breathing. We can sort the rest after.";
  }
  if (lower.includes("tired") || lower.includes("guilty") || lower.includes("burn")) {
    return "Rest is not failure. Your body may be asking for recovery. Try choosing a small recovery action you can do without earning it first.";
  }
  if (lower.includes("ground")) {
    return "Try 5-4-3-2-1: notice 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 slow breath.";
  }
  return "Thank you for sharing that. What do you need most right now: to calm your body, understand the feeling, or decide one next step?";
}

export default function MindView({ onTabChange }) {
  const [psychMessages, setPsychMessages] = useState([
    { type: 'ai', text: "I can help you unpack what you are feeling, notice patterns, and suggest grounding steps. I am not a replacement for a licensed professional." },
    { type: 'ai', text: "What feels heaviest right now?" }
  ]);
  const [psychInput, setPsychInput] = useState("");
  const threadRef = useRef(null);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [psychMessages]);

  const handlePsychSend = (text) => {
    if (!text) return;
    setPsychMessages(prev => [...prev, { type: 'user', text }]);
    setTimeout(() => {
      setPsychMessages(prev => [...prev, { type: 'ai', text: replyToPsychMessage(text) }]);
    }, 180);
  };

  return (
    <div
      id="mind"
      className="screen-scroll h-full overflow-y-auto px-[24px] pt-[24px] pb-[100px]"
    >
      <header className="flex justify-between items-center gap-[16px] mb-[24px]">
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            Mood, sleep &amp; fitness
          </p>
          <h1 className="text-[24px] leading-[1.05] font-[800]">Your daily companion</h1>
        </div>
        <button
          onClick={() => onTabChange('home')}
          className="min-w-[48px] min-h-[48px] px-[16px] rounded-[24px] bg-[#eaf0ec] text-[#25453e] text-[13px] font-[800] border-0 transition-all duration-300 ease-in-out active:scale-95"
        >
          Home
        </button>
      </header>

      {/* Mood Card */}
      <section className="rounded-3xl p-6 flex items-start gap-4 bg-[#e8ebfa] shadow-lg shadow-[#586bb5]/10 transition-all duration-300 ease-in-out hover:scale-[1.01]">
        <div className="voice-orb" aria-hidden="true" />
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            Teman curhat
          </p>
          <h2 className="text-[18px] leading-[1.16] font-[800] mb-[6px]">Stress looks moderate</h2>
          <p className="text-[#5f6f69] text-[13px] leading-[1.38]">
            Your voice note mentions workload, and sleep quality dipped. Want a 2-minute reset?
          </p>
        </div>
      </section>

      {/* Psych Card */}
      <section className="psych-card mt-6 rounded-3xl p-6 bg-white shadow-xl shadow-[#586bb5]/5 border-0 transition-all duration-300 ease-in-out" aria-label="AI psychologist support chat">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-[18px] leading-[1.16] font-[800]">AI psychologist chat</h2>
          <span className="text-[#7a8a84] text-[12px] font-[800]">Support only</span>
        </div>
        
        <div className="psych-thread grid gap-3 max-h-[200px] overflow-y-auto pr-[4px] pb-[8px]" ref={threadRef} aria-live="polite">
          {psychMessages.map((msg, i) => (
            <div key={i} className={`psych-bubble max-w-[88%] py-3 px-4 rounded-2xl text-[13px] leading-[1.34] shadow-sm ${msg.type === 'ai' ? 'ai justify-self-start bg-[#eef0fb] text-[#27304f]' : 'user justify-self-end bg-[#586bb5] text-white'}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="psych-suggestions grid grid-cols-2 gap-2 my-4" aria-label="Psychology chat suggestions">
          <button onClick={() => handlePsychSend("I feel overwhelmed today and I do not know where to start.")} className="min-h-[48px] rounded-2xl bg-[#f8f9ff] text-[#3d4b86] text-[12px] font-[850] shadow-md shadow-black/5 border-0 transition-all duration-300 ease-in-out active:scale-95">Overwhelmed</button>
          <button onClick={() => handlePsychSend("I feel anxious and my thoughts keep racing.")} className="min-h-[48px] rounded-2xl bg-[#f8f9ff] text-[#3d4b86] text-[12px] font-[850] shadow-md shadow-black/5 border-0 transition-all duration-300 ease-in-out active:scale-95">Anxious</button>
          <button onClick={() => handlePsychSend("I am tired but I still feel guilty resting.")} className="min-h-[48px] rounded-2xl bg-[#f8f9ff] text-[#3d4b86] text-[12px] font-[850] shadow-md shadow-black/5 border-0 transition-all duration-300 ease-in-out active:scale-95">Burned out</button>
          <button onClick={() => handlePsychSend("Help me do a quick grounding exercise.")} className="min-h-[48px] rounded-2xl bg-[#f8f9ff] text-[#3d4b86] text-[12px] font-[850] shadow-md shadow-black/5 border-0 transition-all duration-300 ease-in-out active:scale-95">Grounding</button>
        </div>

        <form 
          className="psych-input grid grid-cols-[1fr_64px] gap-2" 
          onSubmit={e => {
            e.preventDefault();
            handlePsychSend(psychInput.trim());
            setPsychInput("");
          }}
        >
          <input 
            type="text" 
            value={psychInput}
            onChange={e => setPsychInput(e.target.value)}
            aria-label="Message AI psychologist support" 
            placeholder="Share what is on your mind..." 
            className="min-w-0 min-h-[48px] rounded-2xl bg-[#f8f9ff] text-[#17231f] px-4 outline-none border-0 shadow-md shadow-black/5 focus:shadow-[#586bb5]/20 transition-all duration-300"
          />
          <button type="submit" className="min-h-[48px] border-0 rounded-2xl bg-[#586bb5] text-white font-[900] text-[12px] shadow-lg shadow-[#586bb5]/30 transition-all duration-300 ease-in-out active:scale-95">Send</button>
        </form>
      </section>

      {/* Adaptive Fitness */}
      <section className="mt-8">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-[18px] leading-[1.16] font-[800]">Adaptive fitness</h2>
          <span className="text-[#7a8a84] text-[12px] font-[800]">Low strain</span>
        </div>
        <article className="bg-white rounded-3xl p-6 shadow-lg shadow-black/5 border-0 transition-all duration-300 ease-in-out hover:scale-[1.01]">
          <h3 className="text-[15px] leading-[1.2] font-[700]">Today: gentle strength</h3>
          <p className="text-[#5f6f69] text-[13px] leading-[1.38] mt-[4px]">
            8 squats, 6 wall pushups, 12-minute walk. Adjusted for lower sleep.
          </p>
          <button className="min-h-[48px] border-0 rounded-2xl bg-[#1f6e64] text-white font-[900] mt-4 px-5 shadow-lg shadow-[#1f6e64]/30 hover:bg-[#196059] transition-all duration-300 ease-in-out active:scale-95">
            Start session
          </button>
        </article>
      </section>
    </div>
  );
}
