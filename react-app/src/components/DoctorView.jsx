import { useState } from 'react';

export default function DoctorView({ onTabChange }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingStep, setBookingStep] = useState(null); // null, 'select-time', 'confirmed'
  const [selectedTime, setSelectedTime] = useState(null);

  const doctors = [
    { id: 1, name: 'Dr. Sarah Chen', specialty: 'Cardiologist', rating: 4.9, available: 'Today 14:00', avatar: '👩‍⚕️', experience: '12 years' },
    { id: 2, name: 'Dr. James Wilson', specialty: 'General Practitioner', rating: 4.8, available: 'Today 16:30', avatar: '👨‍⚕️', experience: '8 years' },
    { id: 3, name: 'Dr. Aisha Patel', specialty: 'Endocrinologist', rating: 4.9, available: 'Tomorrow 09:00', avatar: '👩‍⚕️', experience: '15 years' },
  ];

  const hospitals = [
    { name: 'City General Hospital', distance: '2.3 km', rating: 4.7, emoji: '🏥' },
    { name: 'Heart Care Clinic', distance: '4.1 km', rating: 4.9, emoji: '🏥' },
    { name: 'Wellness Medical Center', distance: '5.8 km', rating: 4.6, emoji: '🏥' },
  ];

  const timeSlots = ['09:00', '10:30', '14:00', '15:30', '16:30'];

  const handleBookDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingStep('select-time');
  };

  const handleConfirmBooking = () => {
    setBookingStep('confirmed');
  };

  return (
    <div
      id="doctor"
      className="screen-scroll h-full overflow-y-auto px-5 pt-5 pb-24"
    >
      <header className="flex justify-between items-center gap-4 mb-5">
        <div>
          <p className="m-0 mb-1 uppercase text-[11px] leading-tight text-[#61716c] font-[850]">
            Medical support
          </p>
          <h1 className="text-2xl leading-tight font-[800]">Doctor Consultation</h1>
        </div>
        <button
          onClick={() => onTabChange('health')}
          className="min-w-[44px] min-h-[44px] px-4 rounded-full bg-[#eaf0ec] text-[#25453e] text-[13px] font-[800] border-0 transition-all duration-300 active:scale-95"
        >
          Back
        </button>
      </header>

      {/* Risk Alert */}
      <section className="doctor-risk-alert mb-5">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">⚠️</span>
          <div>
            <h2 className="text-base font-[800] text-[#b91c1c]">High Risk Detected</h2>
            <p className="text-[13px] text-[#dc2626] mt-1">
              Blood pressure trend rising · Activity level critically low
            </p>
          </div>
        </div>
        <p className="text-[13px] text-[#7f1d1d] leading-relaxed">
          VIN AI recommends consulting a healthcare professional based on your recent health trends.
        </p>
      </section>

      {/* Booking confirmed state */}
      {bookingStep === 'confirmed' && (
        <section className="doctor-confirmed mb-5">
          <div className="text-center py-6">
            <span className="text-5xl block mb-3">✅</span>
            <h2 className="text-lg font-[800] text-[#166534] mb-1">Booking Confirmed!</h2>
            <p className="text-[13px] text-[#15803d]">
              {selectedDoctor.name} · {selectedTime} · Tomorrow
            </p>
          </div>
          <button
            className="w-full min-h-[48px] rounded-2xl bg-[#1f6e64] text-white font-[800] text-[13px] border-0 shadow-lg shadow-[#1f6e64]/30 transition-all active:scale-95"
            onClick={() => onTabChange('followup')}
          >
            Go to Follow-up
          </button>
        </section>
      )}

      {/* Time selection */}
      {bookingStep === 'select-time' && !bookingStep?.startsWith?.('confirmed') && bookingStep !== 'confirmed' && (
        <section className="mb-5">
          <div className="rounded-3xl bg-white p-5 shadow-lg shadow-black/5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{selectedDoctor.avatar}</span>
              <div>
                <h3 className="text-[15px] font-[700]">{selectedDoctor.name}</h3>
                <p className="text-[12px] text-[#61716c]">{selectedDoctor.specialty}</p>
              </div>
            </div>
            <p className="text-[13px] font-[800] text-[#1f6e64] mb-3">Select a time slot</p>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map(time => (
                <button
                  key={time}
                  className={`min-h-[42px] rounded-xl text-[13px] font-[700] border-0 transition-all active:scale-95 ${
                    selectedTime === time
                      ? 'bg-[#1f6e64] text-white shadow-lg shadow-[#1f6e64]/30'
                      : 'bg-[#f4f8f5] text-[#24534a]'
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                className="min-h-[44px] rounded-2xl bg-[#f4f8f5] text-[#25453e] font-[800] text-[13px] border-0 transition-all active:scale-95"
                onClick={() => { setBookingStep(null); setSelectedDoctor(null); }}
              >
                Cancel
              </button>
              <button
                className={`min-h-[44px] rounded-2xl font-[800] text-[13px] border-0 transition-all active:scale-95 ${
                  selectedTime
                    ? 'bg-[#1f6e64] text-white shadow-lg shadow-[#1f6e64]/30'
                    : 'bg-[#d1ddd8] text-[#8a9e97] cursor-not-allowed'
                }`}
                onClick={handleConfirmBooking}
                disabled={!selectedTime}
              >
                Confirm
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Doctor list */}
      {!bookingStep && (
        <>
          <section className="mb-6">
            <div className="flex justify-between items-baseline mb-3">
              <h2 className="text-lg font-[800]">👨‍⚕️ Available Doctors</h2>
              <span className="text-[12px] text-[#7a8a84] font-[800]">{doctors.length} nearby</span>
            </div>
            <div className="grid gap-3">
              {doctors.map(doc => (
                <article
                  key={doc.id}
                  className="rounded-2xl bg-white p-4 shadow-lg shadow-black/5 transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{doc.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-[700]">{doc.name}</h3>
                      <p className="text-[12px] text-[#61716c]">{doc.specialty} · {doc.experience}</p>
                    </div>
                    <span className="text-[12px] font-[800] text-[#e39b45]">⭐ {doc.rating}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] text-[#1f6e64] font-[700]">📅 {doc.available}</span>
                    <button
                      className="min-h-[36px] px-4 rounded-xl bg-[#1f6e64] text-white text-[12px] font-[800] border-0 shadow-md shadow-[#1f6e64]/20 transition-all active:scale-95"
                      onClick={() => handleBookDoctor(doc)}
                    >
                      Book Now
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-6">
            <div className="flex justify-between items-baseline mb-3">
              <h2 className="text-lg font-[800]">🏥 Nearby Hospitals</h2>
              <span className="text-[12px] text-[#7a8a84] font-[800]">{hospitals.length} found</span>
            </div>
            <div className="grid gap-3">
              {hospitals.map((h, i) => (
                <article
                  key={i}
                  className="rounded-2xl bg-white p-4 shadow-lg shadow-black/5 flex items-center gap-3 transition-all hover:scale-[1.01]"
                >
                  <span className="text-2xl">{h.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-[700]">{h.name}</h3>
                    <p className="text-[12px] text-[#61716c]">{h.distance} away · ⭐ {h.rating}</p>
                  </div>
                  <button className="min-h-[36px] px-3 rounded-xl bg-[#f4f8f5] text-[#1f6e64] text-[12px] font-[800] border-0 transition-all active:scale-95">
                    View
                  </button>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
