import { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import { User, Star, MapPin, Calendar, Clock, Stethoscope, Dumbbell, Apple, Heart, X, CheckCircle2 } from 'lucide-react';

const MOCK_EXPERTS = [
  { id: 1, name: 'Siti Aminah, S.Gz', category: 'Ahli Gizi', specialty: 'Clinical Nutritionist', rating: 4.9, reviews: 124, available: 'Hari Ini 14:00', price: 'Rp 150.000', experience: '8 tahun', image: 'SA', about: 'Siti Aminah adalah ahli gizi klinis yang berpengalaman dalam merancang pola makan khusus untuk penurunan berat badan dan manajemen diabetes.' },
  { id: 2, name: 'Budi Santoso', category: 'Personal Trainer', specialty: 'Strength & Conditioning', rating: 4.8, reviews: 89, available: 'Besok 09:00', price: 'Rp 200.000', experience: '5 tahun', image: 'BS', about: 'Budi berspesialisasi dalam pembentukan otot dan peningkatan kebugaran fisik secara menyeluruh dengan metode fungsional.' },
  { id: 3, name: 'Dr. Sarah Chen, Sp.PD', category: 'Dokter Spesialis', specialty: 'Penyakit Dalam', rating: 5.0, reviews: 312, available: 'Hari Ini 16:30', price: 'Rp 250.000', experience: '12 tahun', image: 'SC', about: 'Dr. Sarah berfokus pada pencegahan dan pengobatan penyakit dalam, dengan keahlian khusus di bidang imunologi.' },
  { id: 4, name: 'Dr. Ryan Pratama, Sp.KJ', category: 'Psikolog/Psikiater', specialty: 'Kesehatan Mental', rating: 4.9, reviews: 205, available: 'Jumat 10:00', price: 'Rp 300.000', experience: '10 tahun', image: 'RP', about: 'Membantu pasien mengatasi stres, kecemasan, dan depresi melalui pendekatan terapi kognitif perilaku (CBT).' },
  { id: 5, name: 'Nadia Putri, S.Gz', category: 'Ahli Gizi', specialty: 'Sports Nutritionist', rating: 4.7, reviews: 67, available: 'Hari Ini 19:00', price: 'Rp 120.000', experience: '4 tahun', image: 'NP', about: 'Ahli gizi olahraga yang fokus pada peningkatan performa atletik melalui pola makan optimal.' },
  { id: 6, name: 'Dr. James Wilson, Sp.KO', category: 'Dokter Spesialis', specialty: 'Kedokteran Olahraga', rating: 4.8, reviews: 156, available: 'Besok 11:00', price: 'Rp 250.000', experience: '9 tahun', image: 'JW', about: 'Berpengalaman dalam menangani cedera olahraga dan rehabilitasi fisik.' }
];

const CATEGORIES = ['Semua', 'Ahli Gizi', 'Personal Trainer', 'Dokter Spesialis', 'Psikolog/Psikiater'];

export default function ExpertTeamView({ onTabChange, params }) {
  const { userProfile } = useHealth();
  const goals = userProfile?.goals || [];
  
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Initial category from params (FAB routing)
  useEffect(() => {
    if (params?.category && CATEGORIES.includes(params.category)) {
      setSelectedCategory(params.category);
    } else {
      // Dynamic filtering based on goals if no direct param
      if (goals.includes('mental-health')) setSelectedCategory('Psikolog/Psikiater');
      else if (goals.includes('body-goals')) setSelectedCategory('Personal Trainer');
      else setSelectedCategory('Semua');
    }
  }, [params, goals]);

  const filteredExperts = MOCK_EXPERTS.filter(exp => 
    selectedCategory === 'Semua' ? true : exp.category === selectedCategory
  );

  const handleBooking = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedExpert(null);
    }, 2500);
  };

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Ahli Gizi': return <Apple size={16} />;
      case 'Personal Trainer': return <Dumbbell size={16} />;
      case 'Dokter Spesialis': return <Stethoscope size={16} />;
      case 'Psikolog/Psikiater': return <Heart size={16} />;
      default: return <User size={16} />;
    }
  };

  return (
    <div className="screen-scroll h-full overflow-y-auto px-5 pt-5 pb-24 bg-slate-50 relative">
      <header className="mb-6">
        <p className="m-0 mb-1 uppercase text-[11px] leading-tight text-slate-500 font-[850]">
          Konsultasi & Pendampingan
        </p>
        <h1 className="text-2xl leading-tight font-[800] text-slate-900">Tim Ahli</h1>
      </header>

      {/* Categories Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-2xl text-xs font-bold transition-all active:scale-95 shadow-sm ${selectedCategory === cat ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'}`}
          >
            {cat !== 'Semua' && getCategoryIcon(cat)}
            {cat}
          </button>
        ))}
      </div>

      {/* Expert List */}
      <div className="space-y-4">
        {filteredExperts.length > 0 ? filteredExperts.map(expert => (
          <button
            key={expert.id}
            onClick={() => setSelectedExpert(expert)}
            className="w-full text-left bg-white rounded-3xl p-4 shadow-sm border border-slate-100 transition-all active:scale-[0.98] hover:border-teal-100"
          >
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-extrabold text-xl shrink-0">
                {expert.image}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-extrabold text-slate-900 truncate pr-2">{expert.name}</h3>
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-lg shrink-0">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[10px] font-bold">{expert.rating}</span>
                  </div>
                </div>
                <p className="text-[11px] font-bold text-teal-600 mb-2">{expert.specialty}</p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                    <Calendar size={12} /> {expert.available}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                    <Clock size={12} /> {expert.experience}
                  </span>
                </div>
              </div>
            </div>
          </button>
        )) : (
          <div className="text-center py-12">
            <p className="text-sm font-bold text-slate-500">Belum ada ahli untuk kategori ini.</p>
          </div>
        )}
      </div>

      {/* Expert Detail Modal */}
      {selectedExpert && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-8 flex flex-col max-h-[90vh]">
            
            <div className="relative h-32 bg-gradient-to-br from-teal-500 to-teal-700 rounded-t-[32px] shrink-0">
              <button onClick={() => setSelectedExpert(null)} className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white transition-all active:scale-95 hover:bg-white/30">
                <X size={20}/>
              </button>
              <div className="absolute -bottom-10 left-6">
                <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-lg">
                   <div className="w-full h-full bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 font-extrabold text-3xl">
                     {selectedExpert.image}
                   </div>
                </div>
              </div>
            </div>

            <div className="px-6 pt-14 pb-6 overflow-y-auto">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{selectedExpert.name}</h2>
                  <p className="text-sm font-bold text-teal-600">{selectedExpert.category} · {selectedExpert.specialty}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-amber-500 mb-1">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-extrabold">{selectedExpert.rating}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">{selectedExpert.reviews} ulasan</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 my-6">
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Pengalaman</p>
                  <p className="text-sm font-extrabold text-slate-900">{selectedExpert.experience}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Jadwal Terdekat</p>
                  <p className="text-sm font-extrabold text-slate-900">{selectedExpert.available}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">Tentang</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{selectedExpert.about}</p>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-100 rounded-b-[32px] shrink-0">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Biaya Sesi</p>
                  <p className="text-lg font-extrabold text-teal-700">{selectedExpert.price}</p>
                </div>
                <p className="text-xs font-bold text-slate-500">/ 45 Menit</p>
              </div>
              
              <button 
                onClick={handleBooking}
                disabled={bookingSuccess}
                className="w-full h-14 bg-teal-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-teal-600/20 disabled:bg-emerald-500 disabled:shadow-none"
              >
                {bookingSuccess ? (
                  <><CheckCircle2 size={20}/> Berhasil Booking</>
                ) : (
                  'Booking Sesi Sekarang'
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
