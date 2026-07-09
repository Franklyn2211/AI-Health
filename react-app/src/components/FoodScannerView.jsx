import { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import { ArrowLeft, Camera, Zap, CheckCircle2, RotateCcw, Utensils, Minus, Plus, PlusCircle, X, Flame, Clock } from 'lucide-react';

const SUGGESTED_FOODS = [
    { id: 1, name: 'Dada Ayam Rebus', calories: 165, protein: 31, carbs: 0, fat: 3.6, tag: 'High Protein', goal: 'build-muscle', time: '15 mnt', ingredients: ['200g Dada Ayam', 'Air untuk merebus', 'Garam secukupnya'], steps: ['Didihkan air dalam panci.', 'Masukkan dada ayam dan beri sedikit garam.', 'Rebus selama 12-15 menit hingga matang.', 'Tiriskan dan potong sesuai selera.'] },
    { id: 2, name: 'Telur Rebus', calories: 78, protein: 6, carbs: 0.6, fat: 5, tag: 'Keto Friendly', goal: 'default', time: '10 mnt', ingredients: ['2 butir Telur', 'Air'], steps: ['Rebus air hingga mendidih.', 'Masukkan telur secara perlahan.', 'Rebus selama 8-10 menit untuk tingkat kematangan pas.', 'Angkat dan rendam di air dingin sebelum dikupas.'] },
    { id: 3, name: 'Salad Bayam + Salmon', calories: 350, protein: 30, carbs: 10, fat: 20, tag: 'Asam Folat', goal: 'pregnancy', time: '20 mnt', ingredients: ['1 ikat Bayam segar', '150g Ikan Salmon', 'Minyak Zaitun', 'Perasan Lemon'], steps: ['Panggang salmon dengan sedikit minyak zaitun hingga matang.', 'Cuci bersih bayam dan tiriskan.', 'Campur bayam dengan salmon yang sudah disuwir atau dipotong.', 'Beri perasan lemon sebagai dressing.'] },
    { id: 4, name: 'Oatmeal Buah', calories: 250, protein: 7, carbs: 45, fat: 4, tag: 'Kaya Serat', goal: 'lose-weight', time: '10 mnt', ingredients: ['50g Rolled Oats', '150ml Susu Rendah Lemak', '1 buah Pisang', 'Buah Berries secukupnya'], steps: ['Campur oats dan susu di mangkuk.', 'Panaskan di microwave selama 2 menit (atau masak di panci kecil).', 'Potong-potong pisang dan tambahkan berries di atasnya.', 'Sajikan selagi hangat.'] }
];

function MacroBar({ label, value, max, color }) {
    const percent = Math.min((value / max) * 100, 100);
    return (
        <div>
            <div className="flex justify-between items-end mb-1">
                <span className="text-[11px] font-[800] text-[#253532]">{label}</span>
                <span className="text-[10px] font-[850]" style={{ color }}>{value.toFixed(1)}g / {max}g</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#f0f4f2] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, backgroundColor: color }} />
            </div>
        </div>
    );
}

export default function FoodScannerView({ onBack }) {
    const { userProfile, addLoggedMeal } = useHealth();
    const goals = userProfile.goals || [];
    const isPregnancy = goals.includes('pregnancy');
    const goals_cal = goals.includes('lose-weight') ? 1500 : goals.includes('build-muscle') ? 2800 : 2000;

    const [scanning, setScanning] = useState(false);
    const [scanned, setScanned] = useState([]);
    const [lastAdded, setLastAdded] = useState(null);
    const [selectedFood, setSelectedFood] = useState(null);

    const simulateScan = () => {
        setScanning(true);
        setTimeout(() => {
            const mockDetect = { name: 'Nasi Goreng Spesial', calories: 450, protein: 15, carbs: 55, fat: 18, qty: 1 };
            setScanned(prev => [mockDetect, ...prev]);
            setScanning(false);
            setLastAdded(mockDetect.name);
            setTimeout(() => setLastAdded(null), 3000);
        }, 2000);
    };

    const addFood = (food) => {
        const item = { ...food, qty: 1 };
        setScanned(prev => [item, ...prev]);
        setLastAdded(food.name);
        setTimeout(() => setLastAdded(null), 3000);
    };

    const totals = scanned.reduce((acc, f) => {
        return {
            cal: acc.cal + (f.calories * f.qty),
            prot: acc.prot + (f.protein * f.qty),
            carbs: acc.carbs + (f.carbs * f.qty),
            fat: acc.fat + (f.fat * f.qty),
        };
    }, { cal: 0, prot: 0, carbs: 0, fat: 0 });

    const handleAddToDiary = () => {
        addLoggedMeal({ 
            name: "Pindaian Kamera", 
            cal: Math.round(totals.cal),
            prot: Math.round(totals.prot),
            carbs: Math.round(totals.carbs),
            fat: Math.round(totals.fat)
        });
        setScanned([]);
        setLastAdded('Total kalori ke Diary');
        setTimeout(() => setLastAdded(null), 3000);
    };

    const suggestedFoods = SUGGESTED_FOODS.filter(f => f.goal === 'default' || goals.includes(f.goal));

    return (
        <div className="screen-scroll h-full overflow-y-auto px-5 pt-4 pb-24 bg-slate-50 relative">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <button onClick={onBack} className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 transition-all active:scale-95 shadow-sm">
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Scan</p>
                    <h1 className="text-xl font-extrabold text-slate-900">Pemindai Makanan</h1>
                </div>
            </div>

            {/* Camera Mockup */}
            <div className="relative rounded-3xl overflow-hidden mb-5 shadow-sm" style={{ height: '220px', background: 'linear-gradient(135deg, #0f2a26 0%, #1f6e64 60%, #2c9e8e 100%)' }}>
                {/* Corner guides */}
                {['top-5 left-5', 'top-5 right-5', 'bottom-5 left-5', 'bottom-5 right-5'].map((pos, i) => (
                    <div key={i} className={`absolute ${pos} w-8 h-8`}>
                        <div className="w-full h-full border-white/60"
                            style={{ borderTopWidth: i < 2 ? '3px' : 0, borderBottomWidth: i >= 2 ? '3px' : 0, borderLeftWidth: i % 2 === 0 ? '3px' : 0, borderRightWidth: i % 2 === 1 ? '3px' : 0, borderRadius: '4px' }} />
                    </div>
                ))}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    {scanning ? (
                        <>
                            <div className="w-16 h-16 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                            <p className="text-white text-sm font-bold tracking-wide">Memindai...</p>
                        </>
                    ) : (
                        <>
                            <Camera size={48} className="text-white/80 drop-shadow-md mb-2" />
                            <p className="text-white text-xs font-bold">Arahkan kamera ke makanan</p>
                        </>
                    )}
                </div>
                {/* Red scan line animation */}
                {scanning && (
                    <div className="absolute left-6 right-6 h-0.5 bg-red-400/80 animate-pulse top-1/2 shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
                )}
                <button
                    onClick={simulateScan}
                    disabled={scanning}
                    className="absolute bottom-5 right-5 flex items-center gap-2 bg-white text-teal-700 text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                    <Zap size={16} fill="currentColor" /> Pindai
                </button>
            </div>

            {/* Success toast */}
            {lastAdded && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-5 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                    <p className="text-sm font-bold text-emerald-800">{lastAdded} ditambahkan!</p>
                </div>
            )}

            {/* Macro Summary Card */}
            <section className="rounded-3xl bg-white shadow-sm border border-slate-100 p-6 mb-6">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Nutrisi Dideteksi</h2>
                    {totals.cal > 0 && (
                        <button onClick={handleAddToDiary} className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm">
                            <PlusCircle size={16} /> Add to Diary
                        </button>
                    )}
                </div>

                {/* Calorie ring */}
                <div className="flex items-center gap-5 mb-6">
                    <div className="relative w-24 h-24 shrink-0">
                        <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90 drop-shadow-sm">
                            <circle cx="36" cy="36" r="30" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                            <circle cx="36" cy="36" r="30" fill="none" stroke="#0d9488" strokeWidth="8" strokeLinecap="round"
                                strokeDasharray={`${Math.min((totals.cal / goals_cal) * 188.5, 188.5)} 188.5`} />
                        </svg>
                        <span className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-extrabold text-teal-700 leading-tight">{Math.round(totals.cal)}</span>
                            <span className="text-[10px] font-bold text-slate-400">kcal</span>
                        </span>
                    </div>
                    <div className="flex-1 space-y-3">
                        <MacroBar label="Protein" value={totals.prot} max={goals.includes('build-muscle') ? 180 : 60} color="#f97316" />
                        <MacroBar label="Karbo" value={totals.carbs} max={goals.includes('lose-weight') ? 150 : 250} color="#eab308" />
                        <MacroBar label="Lemak" value={totals.fat} max={65} color="#8b5cf6" />
                    </div>
                </div>

                {/* 4-macro grid */}
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { label: 'Kalori', val: Math.round(totals.cal), unit: 'kcal', color: '#0d9488' },
                        { label: 'Protein', val: totals.prot.toFixed(1), unit: 'g', color: '#f97316' },
                        { label: 'Karbo', val: totals.carbs.toFixed(1), unit: 'g', color: '#eab308' },
                        { label: 'Lemak', val: totals.fat.toFixed(1), unit: 'g', color: '#8b5cf6' },
                    ].map(m => (
                        <div key={m.label} className="rounded-2xl bg-slate-50 border border-slate-100 p-3 text-center">
                            <p className="text-base font-extrabold mb-0.5" style={{ color: m.color }}>{m.val}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">{m.unit}</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-0.5">{m.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Scanned Items */}
            {scanned.length > 0 && (
                <section className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Makanan Dicatat</h2>
                        <button onClick={() => setScanned([])} className="flex items-center gap-1.5 text-xs text-red-500 font-bold px-2 py-1 hover:bg-red-50 rounded-lg transition-colors">
                            <RotateCcw size={14} /> Reset
                        </button>
                    </div>
                    <div className="space-y-3">
                        {scanned.map((f, i) => (
                            <div key={i} className="flex items-center gap-4 rounded-3xl bg-white border border-slate-100 p-4 shadow-sm transition-all">
                                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                                    <Utensils size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate mb-1">{f.name}</p>
                                    <p className="text-[11px] font-semibold text-slate-500">{f.calories * f.qty} kcal · P:{(f.protein * f.qty).toFixed(0)}g · K:{(f.carbs * f.qty).toFixed(0)}g</p>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                                    <button onClick={() => setScanned(p => p.map((s, j) => j === i ? { ...s, qty: Math.max(1, s.qty - 1) } : s))}
                                        className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center active:scale-95 text-slate-600">
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-xs font-bold w-4 text-center">{f.qty}</span>
                                    <button onClick={() => setScanned(p => p.map((s, j) => j === i ? { ...s, qty: s.qty + 1 } : s))}
                                        className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center active:scale-95 text-slate-600">
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Suggested Foods for Goal */}
            <section>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    Rekomendasi Makanan
                    {isPregnancy && <span className="text-[10px] bg-pink-100 text-pink-600 px-2.5 py-1 rounded-xl normal-case font-bold">Kehamilan</span>}
                </h2>
                <div className="space-y-3">
                    {suggestedFoods.map(food => (
                        <div key={food.id} onClick={() => setSelectedFood(food)} className="flex items-center gap-4 rounded-3xl bg-white border border-slate-100 p-4 shadow-sm cursor-pointer transition-all active:scale-[0.98] hover:border-teal-100">
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                <Utensils size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-bold text-slate-900 truncate">{food.name}</p>
                                    <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded-lg shrink-0 border border-teal-100">{food.tag}</span>
                                </div>
                                <p className="text-[11px] font-medium text-slate-500">{food.calories} kcal · P:{food.protein}g · K:{food.carbs}g · L:{food.fat}g</p>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); addFood(food); }}
                                className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center transition-all active:scale-90 shrink-0 hover:bg-teal-600 hover:text-white">
                                <Plus size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Detail View Modal */}
            {selectedFood && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] w-full max-w-md p-6 shadow-2xl animate-in slide-in-from-bottom-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-5">
                            <h2 className="text-xl font-extrabold text-slate-900 pr-4 leading-tight">{selectedFood.name}</h2>
                            <button onClick={() => setSelectedFood(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 transition-all active:scale-95"><X size={20}/></button>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 mb-4">
                            <span className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-sm font-bold flex items-center gap-1.5"><Flame size={16}/> {selectedFood.calories} kcal</span>
                            <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold flex items-center gap-1.5"><Clock size={16}/> {selectedFood.time || '15 mnt'}</span>
                        </div>

                        {selectedFood.ingredients && (
                            <div className="mb-4">
                                <h3 className="text-xs font-bold text-slate-900 uppercase mb-2">Bahan-Bahan</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    {selectedFood.ingredients.map((ing, idx) => (
                                        <li key={idx} className="text-sm text-slate-600 font-medium">{ing}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {selectedFood.steps && (
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-slate-900 uppercase mb-2">Cara Membuat</h3>
                                <div className="space-y-3">
                                    {selectedFood.steps.map((step, idx) => (
                                        <div key={idx} className="flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center shrink-0">
                                                {idx + 1}
                                            </div>
                                            <p className="text-sm text-slate-600 font-medium leading-relaxed">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <button onClick={() => { addFood(selectedFood); setSelectedFood(null); }} className="w-full h-14 bg-teal-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm">
                            <PlusCircle size={20}/> Add to Scanned
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
