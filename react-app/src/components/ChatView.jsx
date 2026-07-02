import { useState, useRef, useEffect } from 'react';

const companionReplies = {
  scan: "Opening the scanner. I will identify food items, estimate weight, and turn the result into nutrition.",
  plan: "Opening your meal plan. I will balance calories, protein, budget, iron intake, and what you already have.",
  health: "Opening preventive health. I will connect fatigue, meals, and camera checks without making a diagnosis.",
  mind: "Opening mood support. I can connect stress, sleep, fitness, and reminders for a lighter day."
};

function replyToMessage(message) {
  const lower = message.toLowerCase();

  if (lower.includes("food") || lower.includes("scan") || lower.includes("calorie")) {
    return "I can scan your meal, estimate grams for each item, calculate nutrition, and use it to update today's plan.";
  }
  if (lower.includes("meal") || lower.includes("plan") || lower.includes("diet")) {
    return "I can make a meal plan from your goal, budget, scanned ingredients, and nutrition gaps.";
  }
  if (lower.includes("anemia") || lower.includes("iron") || lower.includes("tired") || lower.includes("fatigue")) {
    return "I can check your iron intake trend, fatigue notes, and camera screening results, then suggest food steps or a clinician check.";
  }
  if (lower.includes("stress") || lower.includes("mood") || lower.includes("sleep")) {
    return "I can connect mood, sleep, reminders, and fitness so today's plan feels realistic instead of overwhelming.";
  }
  return "I can help with food scanning, meal planning, anemia risk, mood, sleep, fitness, and reminders. Tell me what you want to improve today.";
}

export default function ChatView({ onTabChange }) {
  const [messages, setMessages] = useState([
    { type: 'ai', text: "Hi, I am your AI lifestyle companion. I can help you scan meals, plan food from ingredients, check iron risk, improve sleep, or make today feel easier." },
    { type: 'ai', text: "Try one of the suggestions below, or type what you need." }
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
      className="screen-scroll h-full overflow-y-auto px-[24px] pt-[24px] pb-[100px] flex flex-col"
    >
      <header className="chat-hero shrink-0 grid justify-items-center text-center px-[8px] py-[6px] pb-[12px]">
        <div className="companion-mark large" aria-hidden="true">
          <span />
        </div>
        <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850]">
          INaAI assistant
        </p>
        <h1 className="text-[24px] leading-[1.05] font-[800] max-w-[300px] mb-[8px]">
          What can I help you with today?
        </h1>
        <p className="text-[#5f6f69] text-[13px] leading-[1.38] max-w-[330px]">
          Chat with your companion to connect food, meal planning, sleep, mood, fitness, reminders, and preventive health.
        </p>
      </header>

      <section className="chat-panel flex-1 flex flex-col min-h-0 bg-white rounded-3xl p-6 shadow-xl shadow-black/5 border-0">
        <div className="chat-thread tall flex-1 overflow-y-auto content-start pb-[12px] pr-[4px] grid gap-[12px]" ref={threadRef} aria-live="polite">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble max-w-[88%] py-[12px] px-[16px] rounded-2xl text-[13px] leading-[1.34] shadow-sm ${msg.type === 'ai' ? 'ai justify-self-start bg-[#eef5f1] text-[#253532]' : 'user justify-self-end bg-[#1f6e64] text-white'}`}>
              {msg.text}
            </div>
          ))}
        </div>
        
        <div className="chat-suggestions expanded grid grid-cols-2 gap-[8px] my-[16px]" aria-label="Suggested AI actions">
          <button onClick={() => handleAction('scan', 'scan')} className="min-h-[48px] text-[12px] rounded-2xl bg-white shadow-md shadow-black/5 text-[#28514a] font-[850] px-[8px] border-0 transition-all duration-300 ease-in-out active:scale-95">Scan my food</button>
          <button onClick={() => handleAction('plan', 'plan')} className="min-h-[48px] text-[12px] rounded-2xl bg-white shadow-md shadow-black/5 text-[#28514a] font-[850] px-[8px] border-0 transition-all duration-300 ease-in-out active:scale-95">Make meal plan</button>
          <button onClick={() => handleAction('health', 'health')} className="min-h-[48px] text-[12px] rounded-2xl bg-white shadow-md shadow-black/5 text-[#28514a] font-[850] px-[8px] border-0 transition-all duration-300 ease-in-out active:scale-95">Check anemia risk</button>
          <button onClick={() => handleAction('mind', 'mind')} className="min-h-[48px] text-[12px] rounded-2xl bg-white shadow-md shadow-black/5 text-[#28514a] font-[850] px-[8px] border-0 transition-all duration-300 ease-in-out active:scale-95">Help my mood</button>
          <button onClick={() => handleSend("I feel tired today. Can you connect my sleep, food, hydration, and iron intake?")} className="min-h-[48px] text-[12px] rounded-2xl bg-white shadow-md shadow-black/5 text-[#28514a] font-[850] px-[8px] border-0 transition-all duration-300 ease-in-out active:scale-95">Why am I tired?</button>
          <button onClick={() => handleSend("Create a simple healthy schedule for meals, water, exercise, and sleep today.")} className="min-h-[48px] text-[12px] rounded-2xl bg-white shadow-md shadow-black/5 text-[#28514a] font-[850] px-[8px] border-0 transition-all duration-300 ease-in-out active:scale-95">Plan my day</button>
        </div>

        <form 
          className="chat-input sticky grid grid-cols-[1fr_64px] gap-[8px]" 
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
            aria-label="Message AI companion" 
            placeholder="Ask INaAI to help..." 
            className="min-w-0 min-h-[48px] rounded-2xl bg-white shadow-md shadow-black/5 text-[#17231f] px-[16px] outline-none border-0 focus:shadow-[#2c7a70]/20 transition-all duration-300"
          />
          <button type="submit" aria-label="Send message" className="min-h-[48px] border-0 rounded-2xl bg-[#e39b45] text-white font-[900] text-[12px] shadow-lg shadow-[#e39b45]/30 transition-all duration-300 ease-in-out active:scale-95">Send</button>
        </form>
      </section>
    </div>
  );
}
