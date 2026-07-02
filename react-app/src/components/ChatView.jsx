import { useState, useRef, useEffect } from 'react';

const companionReplies = {
  health: "Opening health monitor. I'll check your risk factors and provide prevention recommendations.",
  doctor: "Opening doctor consultation. I'll help you find the right specialist based on your health data.",
  plan: "Let me review your personalized health plan and suggest adjustments based on your recent progress.",
  tracking: "I'll help you log your daily health data. What would you like to track?"
};

function replyToMessage(message) {
  const lower = message.toLowerCase();

  if (lower.includes("blood pressure") || lower.includes("bp") || lower.includes("hypertension")) {
    return "I've been monitoring your blood pressure trend. It's been rising over the past 2 weeks. I recommend reducing sodium intake and adding 15-minute walks after meals. Would you like me to adjust your plan?";
  }
  if (lower.includes("sleep") || lower.includes("tired") || lower.includes("fatigue")) {
    return "Your sleep quality has dropped to 68% this week. I suggest a 22:00 wind-down routine: dim lights, no screens, and deep breathing for 5 minutes. Should I set reminders?";
  }
  if (lower.includes("workout") || lower.includes("exercise") || lower.includes("gym")) {
    return "Based on your goal and progress, I recommend today's workout: Upper body strength — 3 sets of push-ups, rows, and shoulder press. 45 minutes total. Ready to start?";
  }
  if (lower.includes("food") || lower.includes("meal") || lower.includes("eat") || lower.includes("diet")) {
    return "Today's meal plan: Breakfast — Egg toast + banana (410 kcal). Lunch — Chicken rice bowl (612 kcal). Dinner — Tofu veggie stir fry (520 kcal). Total: 1,542 kcal, well within your 1,800 kcal target.";
  }
  if (lower.includes("progress") || lower.includes("how am i doing") || lower.includes("status")) {
    return "Great progress! 🎉 You've completed 85% of your weekly target. Your weight is down 0.3 kg this week, sleep quality improved 12%, and you've been consistent with hydration. Keep it up!";
  }
  if (lower.includes("risk") || lower.includes("warning") || lower.includes("alert")) {
    return "I've detected 1 high-risk alert (blood pressure rising) and 2 warnings (sleep quality declining, activity level low). Would you like me to show detailed analysis or recommend a doctor consultation?";
  }
  return "I'm TARA AI, your preventive healthcare companion. I can help with health tracking, meal planning, workout guidance, risk detection, and doctor recommendations. What would you like to know?";
}

export default function ChatView({ onTabChange }) {
  const [messages, setMessages] = useState([
    { type: 'ai', text: "Hi! I'm TARA AI, your preventive healthcare companion. 🛡️" },
    { type: 'ai', text: "I can help you track health, plan meals & workouts, detect risks early, and connect you with doctors when needed. Try a suggestion below!" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const threadRef = useRef(null);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text) => {
    if (!text) return;
    setMessages(prev => [...prev, { type: 'user', text }]);

    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'ai', text: replyToMessage(text) }]);
    }, 180);
  };

  const handleAction = (action, tab) => {
    setMessages(prev => [...prev, { type: 'ai', text: companionReplies[action] }]);
    setTimeout(() => onTabChange(tab), 400);
  };

  return (
    <div
      id="chat"
      className="screen-scroll h-full overflow-y-auto px-5 pt-5 pb-24 flex flex-col"
    >
      <header className="chat-hero shrink-0 grid justify-items-center text-center px-2 py-1.5 pb-3">
        <div className="companion-mark large" aria-hidden="true">
          <span />
        </div>
        <p className="m-0 mb-1 uppercase text-[11px] leading-tight text-[#61716c] font-[850]">
          TARA AI assistant
        </p>
        <h1 className="text-2xl leading-tight font-[800] max-w-[300px] mb-2">
          How can I help you today?
        </h1>
        <p className="text-[#5f6f69] text-[13px] leading-relaxed max-w-[330px]">
          Your AI-powered preventive healthcare companion for tracking, coaching, and early detection.
        </p>
      </header>

      <section className="chat-panel flex-1 flex flex-col min-h-0 bg-white rounded-3xl p-5 shadow-xl shadow-black/5 border-0">
        <div className="chat-thread tall flex-1 overflow-y-auto content-start pb-3 pr-1 grid gap-3" ref={threadRef} aria-live="polite">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble max-w-[88%] py-3 px-4 rounded-2xl text-[13px] leading-snug shadow-sm ${msg.type === 'ai' ? 'ai justify-self-start bg-[#eef5f1] text-[#253532]' : 'user justify-self-end bg-[#1f6e64] text-white'}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-suggestions expanded grid grid-cols-2 gap-2 my-4" aria-label="Suggested AI actions">
          <button onClick={() => handleAction('health', 'health')} className="min-h-[44px] text-[12px] rounded-2xl bg-white shadow-md shadow-black/5 text-[#28514a] font-[800] px-2 border-0 transition-all active:scale-95">🛡️ Health Monitor</button>
          <button onClick={() => handleSend("How am I doing with my health goals?")} className="min-h-[44px] text-[12px] rounded-2xl bg-white shadow-md shadow-black/5 text-[#28514a] font-[800] px-2 border-0 transition-all active:scale-95">📊 My Progress</button>
          <button onClick={() => handleSend("What should I eat today?")} className="min-h-[44px] text-[12px] rounded-2xl bg-white shadow-md shadow-black/5 text-[#28514a] font-[800] px-2 border-0 transition-all active:scale-95">🥗 Meal Plan</button>
          <button onClick={() => handleSend("Are there any health risks I should know about?")} className="min-h-[44px] text-[12px] rounded-2xl bg-white shadow-md shadow-black/5 text-[#28514a] font-[800] px-2 border-0 transition-all active:scale-95">⚠️ Risk Check</button>
        </div>

        <form
          className="chat-input sticky grid grid-cols-[1fr_64px] gap-2"
          onSubmit={e => {
            e.preventDefault();
            handleSend(inputValue.trim());
            setInputValue("");
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            aria-label="Message TARA AI"
            placeholder="Ask TARA AI..."
            className="min-w-0 min-h-[48px] rounded-2xl bg-white shadow-md shadow-black/5 text-[#17231f] px-4 outline-none border-0 focus:shadow-[#2c7a70]/20 transition-all duration-300"
          />
          <button type="submit" aria-label="Send message" className="min-h-[48px] border-0 rounded-2xl bg-[#e39b45] text-white font-[900] text-[12px] shadow-lg shadow-[#e39b45]/30 transition-all active:scale-95">Send</button>
        </form>
      </section>
    </div>
  );
}
