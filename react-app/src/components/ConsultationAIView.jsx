import { useState, useRef, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import { Send, Bot, Sparkles, User, Activity } from 'lucide-react';

export default function ConsultationAIView() {
    const { userProfile, getGoalLabel, AVAILABLE_GOALS } = useHealth();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const threadRef = useRef(null);

    useEffect(() => {
        if (threadRef.current) {
            threadRef.current.scrollTop = threadRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    useEffect(() => {
        if (messages.length === 0) {
            const goalLabels = userProfile.goals.map(goalId => {
                const g = AVAILABLE_GOALS.find(g => g.id === goalId);
                return g ? g.label : goalId;
            }).map(l => l.replace('undefined ', ''));

            const goalText = goalLabels.length > 0
                ? goalLabels.join(', ')
                : 'kesehatan umum Anda';

            setMessages([
                {
                    type: 'ai',
                    text: `Halo ${userProfile.fullName ? userProfile.fullName.split(' ')[0] : 'Anda'}! 👋 Saya TARA AI, pendamping kesehatan pribadi Anda.`
                },
                {
                    type: 'ai',
                    text: `Berdasarkan profil Anda, fokus kita saat ini adalah: **${goalText}**. Saya dapat membantu Anda dalam urusan gizi, rutinitas olahraga, analisis gejala ringan, hingga manajemen stres.`
                },
                {
                    type: 'ai',
                    text: 'Apa yang ingin Anda konsultasikan hari ini?'
                }
            ]);
        }
    }, [userProfile, AVAILABLE_GOALS]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        setMessages(prev => [...prev, { type: 'user', text: inputValue }]);
        const userMessage = inputValue.toLowerCase();
        setInputValue('');
        setIsTyping(true);

        let aiResponse = 'Terima kasih atas pertanyaannya. Berdasarkan panduan medis umum, hal ini wajar terjadi. Namun, selalu konsultasikan dengan dokter jika gejala memburuk.';

        if (userMessage.includes('berat') || userMessage.includes('diet') || userMessage.includes('makan')) {
            aiResponse = 'Untuk urusan nutrisi dan berat badan, saya rekomendasikan untuk tetap defisit kalori dan memperhatikan asupan protein harian. Coba gunakan fitur "Scan Kulkas" di tab Meal Plan untuk ide resep sehat!';
        } else if (userMessage.includes('tidur') || userMessage.includes('insomnia')) {
            aiResponse = 'Kualitas tidur sangat penting. Saya sarankan Anda mengurangi paparan cahaya biru (layar HP/TV) minimal 1 jam sebelum tidur dan mencoba teknik pernapasan 4-7-8.';
        } else if (userMessage.includes('olahraga') || userMessage.includes('workout')) {
            aiResponse = 'Aktivitas fisik sangat disarankan! Cobalah mulai dengan latihan intensitas sedang seperti jalan cepat 30 menit sehari atau senam ringan jika Anda merasa kaku.';
        } else if (userMessage.includes('stres') || userMessage.includes('cemas') || userMessage.includes('pusing')) {
            aiResponse = 'Manajemen stres penting untuk kesehatan holistik. Saya rekomendasikan Anda mengambil jeda 5 menit untuk meditasi pernapasan. Jika sering pusing, pastikan Anda juga cukup terhidrasi (minum air).';
        } else if (userMessage.includes('risiko') || userMessage.includes('sakit')) {
            aiResponse = 'Sebagai AI, saya tidak bisa memberikan diagnosis medis pasti. Jika Anda merasa sakit berkepanjangan, segera periksakan diri ke fasilitas kesehatan atau dokter terdekat demi keamanan Anda.';
        }

        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { type: 'ai', text: aiResponse }]);
        }, 1200);
    };

    return (
        <div className="h-full bg-slate-50 flex flex-col pt-4 pb-20">
            {/* Header */}
            <header className="px-5 mb-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/30">
                        <Bot size={22} />
                    </div>
                    <div>
                        <h1 className="text-[16px] font-[900] text-slate-800 leading-tight">TARA AI</h1>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[11px] font-[800] text-teal-600 uppercase tracking-widest">Online</p>
                        </div>
                    </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                    <Activity size={18} />
                </div>
            </header>

            {/* Chat Thread */}
            <div
                className="flex-1 overflow-y-auto px-5 pb-4 space-y-4"
                ref={threadRef}
            >
                <div className="text-center mb-6">
                    <p className="text-[10px] font-[800] text-slate-400 uppercase tracking-wider">Konsultasi Terenkripsi</p>
                    <p className="text-[10px] text-slate-400 mt-1">TARA AI bukan pengganti nasihat medis profesional.</p>
                </div>

                {messages.map((msg, i) => (
                    <div key={i} className={`flex w-full ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}>
                        {msg.type === 'ai' && (
                            <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mr-2 mt-auto">
                                <Sparkles size={12} className="text-teal-600" />
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] p-3.5 rounded-2xl text-[13.5px] leading-relaxed shadow-sm ${
                                msg.type === 'ai'
                                    ? 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm'
                                    : 'bg-teal-600 text-white rounded-br-sm'
                            }`}
                        >
                            {msg.text.split('**').map((part, index) => 
                                index % 2 === 1 ? <strong key={index} className="font-[900]">{part}</strong> : part
                            )}
                        </div>
                        {msg.type === 'user' && (
                            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0 ml-2 mt-auto">
                                <User size={12} className="text-slate-500" />
                            </div>
                        )}
                    </div>
                ))}

                {isTyping && (
                    <div className="flex w-full justify-start items-end">
                        <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mr-2">
                            <Sparkles size={12} className="text-teal-600" />
                        </div>
                        <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Box */}
            <div className="px-5 pb-5 pt-2 bg-slate-50 shrink-0">
                <form
                    className="flex items-center gap-2 relative"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                >
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Tanya tentang diet, tidur, olahraga..."
                        className="flex-1 pl-4 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-white text-[13.5px] text-slate-800 font-[600] outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
                        disabled={isTyping}
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isTyping}
                        className="absolute right-1.5 w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center disabled:opacity-50 disabled:bg-slate-300 transition-all active:scale-95"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}
