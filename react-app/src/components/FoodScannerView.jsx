import { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { Camera, Zap, ArrowLeft, Plus, Minus, CheckCircle2, RotateCcw, Utensils } from 'lucide-react';

/* ── Goal-adaptive food db ── */
const FOOD_DB = {
    'lose-weight': [
        { id: 'lw1', name: 'Salad Sayuran Segar', calories: 120, protein: 8, carbs: 15, fat: 3, tag: 'Rendah Kalori' },
        { id: 'lw2', name: 'Ayam Rebus (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, tag: 'Tinggi Protein' },
        { id: 'lw3', name: 'Beras Merah (50g)', calories: 172, protein: 3.6, carbs: 36, fat: 1, tag: 'Serat Tinggi' },
        { id: 'lw4', name: 'Telur Rebus', calories: 78, protein: 6, carbs: 0.6, fat: 5.5, tag: 'Padat Gizi' },
    ],
    'build-muscle': [
        { id: 'bm1', name: 'Dada Ayam (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, tag: 'Anabolik' },
        { id: 'bm2', name: 'Putih Telur (3 pcs)', calories: 52, protein: 11, carbs: 0.7, fat: 0.2, tag: 'Lean Protein' },
        { id: 'bm3', name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13, tag: 'Omega-3' },
        { id: 'bm4', name: 'Nasi Putih (100g)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, tag: 'Energi' },
    ],
    'heart-health': [
        { id: 'hh1', name: 'Alpukat (½ buah)', calories: 160, protein: 2, carbs: 9, fat: 15, tag: 'Lemak Baik' },
        { id: 'hh2', name: 'Ikan Makarel (100g)', calories: 205, protein: 22, carbs: 0, fat: 12.4, tag: 'Omega-3' },
        { id: 'hh3', name: 'Oatmeal (40g)', calories: 150, protein: 5, carbs: 27, fat: 3, tag: 'Kolesterol' },
        { id: 'hh4', name: 'Brokoli (100g)', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, tag: 'Antioksidan' },
    ],
    'pregnancy': [
        { id: 'pg1', name: 'Bayam (100g)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, tag: 'Asam Folat' },
        { id: 'pg2', name: 'Ikan Salmon (80g)', calories: 166, protein: 16, carbs: 0, fat: 10.4, tag: 'DHA/EPA' },
        { id: 'pg3', name: 'Susu Kehamilan', calories: 140, protein: 9, carbs: 19, fat: 3.5, tag: 'Kalsium' },
        { id: 'pg4', name: 'Alpukat (½ buah)', calories: 160, protein: 2, carbs: 9, fat: 15, tag: 'Folat' },
    ],
    'diabetes-management': [
        { id: 'dm1', name: 'Beras Merah (50g)', calories: 172, protein: 3.6, carbs: 36, fat: 1, tag: 'IG Rendah' },
        { id: 'dm2', name: 'Tempe Goreng (50g)', calories: 150, protein: 8, carbs: 9, fat: 8, tag: 'Protein' },
        { id: 'dm3', name: 'Sayur Bayam', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, tag: 'Serat' },
    ],
    'default': [
        { id: 'df1', name: 'Nasi + Ayam + Sayur', calories: 450, protein: 28, carbs: 55, fat: 12, tag: 'Seimbang' },
        { id: 'df2', name: 'Buah Pisang', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, tag: 'Energi' },
        { id: 'df3', name: 'Tahu Goreng (100g)', calories: 144, protein: 9.4, carbs: 4.4, fat: 11, tag: 'Protein Nabati' },
    ],
};

function MacroBar({ label, value, max, color, unit = 'g' }) {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-[11px] font-[850] text-[#253532]">{label}</span>
                <span className="text-[11px] font-[800]" style={{ color }}>{value.toFixed(0)}{unit} / {max}{unit}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#eef2f0] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
        </div>
    );
}

export default function FoodScannerView({ onBack }) {
    const { userProfile } = useHealth();
    const goals = userProfile.goals || [];

    const getFoods = () => {
        let list = [];
        const prio = ['pregnancy', 'diabetes-management', 'heart-health', 'build-muscle', 'lose-weight'];
        for (const g of prio) {
            if (goals.includes(g)) list = [...list, ...FOOD_DB[g]];
        }
        return list.length > 0 ? list : FOOD_DB['default'];
    };

    const suggestedFoods = getFoods();
    const [scanned, setScanned] = useState([]);
    const [scanning, setScanning] = useState(false);
    const [lastAdded, setLastAdded] = useState(null);

    const simulateScan = () => {
        setScanning(true);
        setTimeout(() => {
            const rand = suggestedFoods[Math.floor(Math.random() * suggestedFoods.length)];
            setScanned(p => [...p, { ...rand, qty: 1 }]);
            setLastAdded(rand.name);
            setScanning(false);
            setTimeout(() => setLastAdded(null), 2000);
        }, 1200);
    };

    const addFood = (food) => {
        const existing = scanned.findIndex(s => s.id === food.id);
        if (existing >= 0) {
            setScanned(p => p.map((s, i) => i === existing ? { ...s, qty: s.qty + 1 } : s));
        } else {
            setScanned(p => [...p, { ...food, qty: 1 }]);
        }
    };

    const totals = scanned.reduce(
        (acc, f) => ({
            cal: acc.cal + f.calories * f.qty,
            prot: acc.prot + f.protein * f.qty,
            carbs: acc.carbs + f.carbs * f.qty,
            fat: acc.fat + f.fat * f.qty,
        }),
        { cal: 0, prot: 0, carbs: 0, fat: 0 }
    );

    const isPregnancy = goals.includes('pregnancy');
    const goals_cal = isPregnancy ? 2300 : goals.includes('build-muscle') ? 2800 : goals.includes('lose-weight') ? 1600 : 2000;

    return (
        <div className="screen-scroll h-full overflow-y-auto px-5 pt-4 pb-24">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <button onClick={onBack} className="w-9 h-9 rounded-xl bg-[#f0f9f7] border border-[#d4e8e4] flex items-center justify-center text-[#1f6e64] transition-all active:scale-95">
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <p className="text-[10px] font-[850] text-[#61716c] uppercase tracking-widest">MyFitnessPal Style</p>
                    <h1 className="text-[20px] font-[800] text-[#253532]">Pemindai Makanan</h1>
                </div>
            </div>

            {/* Camera Mockup */}
            <div className="relative rounded-3xl overflow-hidden mb-4" style={{ height: '200px', background: 'linear-gradient(135deg, #0f2a26 0%, #1f6e64 60%, #2c9e8e 100%)' }}>
                {/* Corner guides */}
                {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
                    <div key={i} className={`absolute ${pos} w-8 h-8`}>
                        <div className="w-full h-full border-white/60"
                            style={{ borderTopWidth: i < 2 ? '3px' : 0, borderBottomWidth: i >= 2 ? '3px' : 0, borderLeftWidth: i % 2 === 0 ? '3px' : 0, borderRightWidth: i % 2 === 1 ? '3px' : 0 }} />
                    </div>
                ))}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    {scanning ? (
                        <>
                            <div className="w-16 h-16 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                            <p className="text-white/80 text-[13px] font-[800]">Memindai...</p>
                        </>
                    ) : (
                        <>
                            <Camera size={44} className="text-white/50" />
                            <p className="text-white/60 text-[12px] font-[700]">Arahkan kamera ke makanan / barcode</p>
                        </>
                    )}
                </div>
                {/* Red scan line animation */}
                {scanning && (
                    <div className="absolute left-6 right-6 h-0.5 bg-red-400/70 animate-pulse top-1/2" />
                )}
                <button
                    onClick={simulateScan}
                    disabled={scanning}
                    className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-[#1f6e64] text-white text-[12px] font-[800] px-3 py-2 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                    <Zap size={14} /> Pindai
                </button>
            </div>

            {/* Success toast */}
            {lastAdded && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl p-3 mb-4">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <p className="text-[12px] font-[800] text-emerald-700">{lastAdded} ditambahkan!</p>
                </div>
            )}

            {/* Macro Summary Card */}
            <section className="rounded-3xl bg-white shadow-sm border border-[#e6f2ec] p-5 mb-5">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[13px] font-[850] text-[#253532] uppercase">Nutrisi Hari Ini</h2>
                    <div className="text-center">
                        <span className="text-[20px] font-[900] text-[#1f6e64]">{Math.round(totals.cal)}</span>
                        <span className="text-[10px] text-[#61716c] ml-1">/ {goals_cal} kcal</span>
                    </div>
                </div>

                {/* Calorie ring */}
                <div className="flex items-center gap-4 mb-5">
                    <div className="relative w-20 h-20 shrink-0">
                        <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
                            <circle cx="36" cy="36" r="30" fill="none" stroke="#e6f2ec" strokeWidth="7" />
                            <circle cx="36" cy="36" r="30" fill="none" stroke="#1f6e64" strokeWidth="7" strokeLinecap="round"
                                strokeDasharray={`${Math.min((totals.cal / goals_cal) * 188.5, 188.5)} 188.5`} />
                        </svg>
                        <span className="absolute inset-0 grid place-items-center text-[13px] font-[900] text-[#1f6e64]">
                            {Math.round((totals.cal / goals_cal) * 100)}%
                        </span>
                    </div>
                    <div className="flex-1 space-y-2.5">
                        <MacroBar label="Protein" value={totals.prot} max={goals.includes('build-muscle') ? 180 : 60} color="#ff6b35" />
                        <MacroBar label="Karbo" value={totals.carbs} max={goals.includes('lose-weight') ? 150 : 250} color="#f59e0b" />
                        <MacroBar label="Lemak" value={totals.fat} max={65} color="#8b5cf6" />
                    </div>
                </div>

                {/* 4-macro grid */}
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { label: 'Kalori', val: Math.round(totals.cal), unit: 'kcal', color: '#1f6e64' },
                        { label: 'Protein', val: totals.prot.toFixed(1), unit: 'g', color: '#ff6b35' },
                        { label: 'Karbo', val: totals.carbs.toFixed(1), unit: 'g', color: '#f59e0b' },
                        { label: 'Lemak', val: totals.fat.toFixed(1), unit: 'g', color: '#8b5cf6' },
                    ].map(m => (
                        <div key={m.label} className="rounded-2xl bg-[#f7fbf9] p-2.5 text-center">
                            <p className="text-[15px] font-[900]" style={{ color: m.color }}>{m.val}</p>
                            <p className="text-[9px] font-[700] text-[#61716c]">{m.unit}</p>
                            <p className="text-[9px] text-[#61716c]">{m.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Scanned Items */}
            {scanned.length > 0 && (
                <section className="mb-5">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-[13px] font-[850] text-[#253532] uppercase">Makanan Dicatat</h2>
                        <button onClick={() => setScanned([])} className="flex items-center gap-1 text-[11px] text-red-500 font-[800]">
                            <RotateCcw size={12} /> Reset
                        </button>
                    </div>
                    <div className="space-y-2">
                        {scanned.map((f, i) => (
                            <div key={i} className="flex items-center gap-3 rounded-2xl bg-white border border-[#e6f2ec] p-3 shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-[#f0f9f7] text-[#1f6e64] flex items-center justify-center shrink-0">
                                    <Utensils size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-[800] text-[#253532] truncate">{f.name}</p>
                                    <p className="text-[10px] text-[#5f6f69]">{f.calories * f.qty} kcal · P:{(f.protein * f.qty).toFixed(0)}g · K:{(f.carbs * f.qty).toFixed(0)}g</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setScanned(p => p.map((s, j) => j === i ? { ...s, qty: Math.max(1, s.qty - 1) } : s))}
                                        className="w-6 h-6 rounded-lg bg-[#f0f9f7] flex items-center justify-center active:scale-95">
                                        <Minus size={12} className="text-[#1f6e64]" />
                                    </button>
                                    <span className="text-[13px] font-[800] w-5 text-center">{f.qty}</span>
                                    <button onClick={() => setScanned(p => p.map((s, j) => j === i ? { ...s, qty: s.qty + 1 } : s))}
                                        className="w-6 h-6 rounded-lg bg-[#f0f9f7] flex items-center justify-center active:scale-95">
                                        <Plus size={12} className="text-[#1f6e64]" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Suggested Foods for Goal */}
            <section>
                <h2 className="text-[13px] font-[850] text-[#253532] uppercase mb-3">
                    Rekomendasi Makanan Sehat
                    {isPregnancy && <span className="ml-2 text-[10px] bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full normal-case">Kehamilan</span>}
                </h2>
                <div className="space-y-2">
                    {suggestedFoods.map(food => (
                        <div key={food.id} className="flex items-center gap-3 rounded-2xl bg-white border border-[#e6f2ec] p-3 shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-[#f0f9f7] text-[#1f6e64] flex items-center justify-center shrink-0">
                                <Utensils size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <p className="text-[13px] font-[800] text-[#253532]">{food.name}</p>
                                    <span className="text-[9px] bg-[#e6f9f5] text-[#1f6e64] font-[800] px-1.5 py-0.5 rounded-lg shrink-0">{food.tag}</span>
                                </div>
                                <p className="text-[10px] text-[#5f6f69]">{food.calories} kcal · P:{food.protein}g · K:{food.carbs}g · L:{food.fat}g</p>
                            </div>
                            <button onClick={() => addFood(food)}
                                className="w-8 h-8 rounded-xl bg-[#1f6e64] flex items-center justify-center transition-all active:scale-90 shrink-0">
                                <Plus size={15} className="text-white" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
