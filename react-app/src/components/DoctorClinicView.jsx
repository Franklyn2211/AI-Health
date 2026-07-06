import { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { MessageSquare, Phone, Calendar, AlertCircle } from 'lucide-react';

export default function DoctorClinicView({ onTabChange, onSubViewChange }) {
    const { userProfile, isFeatureActive } = useHealth();
    const [activeTab, setActiveTab] = useState('consult');

    const mockDoctors = [
        { id: 1, name: 'Dr. Sarah Chen', specialty: 'Kardiolog', rating: 4.9, available: 'Hari Ini 14:00', avatar: '👩‍⚕️', experience: '12 tahun' },
        { id: 2, name: 'Dr. James Wilson', specialty: 'Dokter Umum', rating: 4.8, available: 'Hari Ini 16:30', avatar: '👨‍⚕️', experience: '8 tahun' },
        { id: 3, name: 'Dr. Aisha Patel', specialty: 'Endokrinolog', rating: 4.9, available: 'Besok 09:00', avatar: '👩‍⚕️', experience: '15 tahun' },
    ];

    return (
        <div className="screen-scroll h-full overflow-y-auto px-5 pt-5 pb-24">
            <header className="mb-6">
                <p className="m-0 mb-1 uppercase text-[11px] leading-tight text-[#61716c] font-[850]">
                    Klinik & Rumah Sakit
                </p>
                <h1 className="text-2xl leading-tight font-[800]">Telemedis</h1>
            </header>

            {/* Tab Navigation */}
            <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('consult')}
                    className={`py-3 px-4 rounded-xl font-[800] text-[13px] border-2 transition-all ${activeTab === 'consult'
                        ? 'bg-[#1f6e64] text-white border-[#1f6e64]'
                        : 'bg-white text-[#253532] border-[#e6f2ec]'
                        }`}
                >
                    💬 Konsultasi
                </button>
                <button
                    onClick={() => setActiveTab('emr')}
                    className={`py-3 px-4 rounded-xl font-[800] text-[13px] border-2 transition-all ${activeTab === 'emr'
                        ? 'bg-[#1f6e64] text-white border-[#1f6e64]'
                        : 'bg-white text-[#253532] border-[#e6f2ec]'
                        }`}
                >
                    🏥 EMR Sync
                </button>
            </div>

            {/* Consultation Tab */}
            {activeTab === 'consult' && (
                <div className="space-y-4">

                    {/* ── Find a Specialist ── */}
                    <button
                        onClick={() => onSubViewChange?.('doctor-list')}
                        className="w-full p-5 rounded-3xl bg-gradient-to-br from-[#1f6e64] to-[#2c7a70] text-white shadow-lg shadow-[#1f6e64]/20 transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-3 justify-between">
                            <div className="text-left">
                                <p className="text-[11px] font-[850] text-white/60 uppercase tracking-wider mb-1"></p>
                                <p className="text-[16px] font-[900] mb-0.5">Cari Dokter Spesialis</p>
                                <p className="text-[12px] text-white/70">6 dokter tersedia · Berbasis tujuan Anda</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                                <Phone size={22} />
                            </div>
                        </div>
                    </button>

                    {/* Quick Consult Button */}
                    <button className="w-full p-4 rounded-2xl bg-white border border-[#e6f2ec] shadow-sm transition-all active:scale-[0.98]">
                        <div className="flex items-center gap-3 justify-between">
                            <div className="text-left">
                                <p className="text-[11px] font-[850] text-[#61716c] uppercase tracking-wider mb-1">Konsultasi Cepat</p>
                                <p className="text-[14px] font-[800] text-[#253532]">Chat dengan Dokter Sekarang</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-[#f0f9f7] flex items-center justify-center">
                                <MessageSquare size={18} className="text-[#1f6e64]" />
                            </div>
                        </div>
                    </button>

                    {/* Book Doctor Button */}
                    <button className="w-full p-4 rounded-2xl bg-white border border-[#e6f2ec] shadow-sm transition-all active:scale-[0.98]">
                        <div className="flex items-center gap-3 justify-between">
                            <div className="text-left">
                                <p className="text-[11px] font-[850] text-[#61716c] uppercase tracking-wider mb-1">Jadwalkan</p>
                                <p className="text-[14px] font-[800] text-[#253532]">Booking Sesi Dokter</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-[#f0f9f7] flex items-center justify-center">
                                <Calendar size={18} className="text-[#1f6e64]" />
                            </div>
                        </div>
                    </button>

                    {/* Available Doctors */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-[13px] font-[850] text-[#253532] uppercase">Dokter Tersedia</h2>
                            <button
                                onClick={() => onSubViewChange?.('doctor-list')}
                                className="text-[12px] font-[800] text-[#1f6e64]"
                            >
                                Lihat Semua
                            </button>
                        </div>
                        <div className="space-y-2">
                            {mockDoctors.map(doctor => (
                                <div key={doctor.id} className="p-4 rounded-2xl bg-white shadow-sm border border-[#e6f2ec]">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#1f6e64] flex items-center justify-center text-white text-[11px] font-[900] shrink-0">
                                            {doctor.avatar === '👩‍⚕️' ? 'DR' : 'DR'}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-[13px] font-[800] text-[#253532]">{doctor.name}</h3>
                                            <p className="text-[11px] text-[#5f6f69]">{doctor.specialty} · {doctor.experience}</p>
                                            <p className="text-[11px] font-[700] text-[#1f6e64] mt-0.5">{doctor.rating} bintang · {doctor.available}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onSubViewChange?.('doctor-list')}
                                        className="mt-3 w-full text-[12px] font-[800] py-2.5 rounded-xl bg-[#1f6e64] text-white transition-all active:scale-95"
                                    >
                                        Booking
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* EMR Sync Tab */}
            {activeTab === 'emr' && (
                <div className="space-y-4">
                    {/* EMR Info Card */}
                    <div className="p-5 rounded-2xl bg-[#f0f9f7] border-2 border-[#1f6e64]">
                        <div className="flex items-start gap-3 mb-3">
                            <span className="text-2xl">🏥</span>
                            <div>
                                <h3 className="text-[14px] font-[800] text-[#1f6e64] mb-1">Integrasi Rumah Sakit (EMR Sync)</h3>
                                <p className="text-[13px] text-[#253532] leading-relaxed">
                                    Sistem kami menggunakan NIK Anda untuk membagikan laporan kesehatan AI secara aman ke dokter di rumah sakit terdaftar.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 p-3 rounded-lg bg-white/50 border border-[#d4e8e4]">
                            <p className="text-[11px] font-[700] text-[#1f6e64] uppercase mb-2">Data Anda Terlindungi dengan:</p>
                            <ul className="space-y-1 text-[12px] text-[#253532]">
                                <li>✓ Enkripsi End-to-End</li>
                                <li>✓ Standar HIPAA/Privacy</li>
                                <li>✓ Kontrol Akses Penuh</li>
                            </ul>
                        </div>
                    </div>

                    {/* Connected Hospitals */}
                    <div>
                        <h2 className="text-[13px] font-[850] text-[#253532] uppercase mb-3">Rumah Sakit Terhubung</h2>
                        <div className="space-y-2">
                            {['City General Hospital', 'Heart Care Clinic', 'Wellness Medical Center'].map((hospital, idx) => (
                                <div key={idx} className="p-4 rounded-2xl bg-white shadow-sm shadow-black/5 border border-[#e6f2ec]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">🏥</span>
                                            <div>
                                                <p className="text-[14px] font-[800] text-[#253532]">{hospital}</p>
                                                <p className="text-[12px] text-[#5f6f69]">Verifikasi status...</p>
                                            </div>
                                        </div>
                                        <span className="text-[12px] font-[800] text-[#10b981]">✓ Aktif</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Your NIK Info */}
                    <div className="p-4 rounded-2xl bg-[#ffe0e6] border border-[#ffb3cc]">
                        <div className="flex items-start gap-2">
                            <AlertCircle size={18} color="#dc2626" />
                            <div>
                                <p className="text-[12px] font-[800] text-[#dc2626] mb-1">NIK Terdaftar</p>
                                <p className="text-[13px] text-[#953735]">{userProfile.nik || 'Belum diisi'}</p>
                                <p className="text-[11px] text-[#7f1d1d] mt-1">Gunakan untuk sinkronisasi rekam medis elektronik</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
