const FOCUS_LABELS = {
  'gain-weight': 'naik berat badan sehat',
  'lose-weight': 'mengelola berat badan',
  'build-strength': 'lebih kuat dan bugar',
  'eat-better': 'pola makan lebih baik',
  'more-energy': 'lebih berenergi',
  stress: 'mengurangi stres',
  sleep: 'memperbaiki tidur',
  mood: 'menjaga suasana hati',
  burnout: 'mencegah burnout',
  'healthy-routine': 'rutinitas sehat',
  'preventive-care': 'perawatan preventif',
  'manage-condition': 'mengelola kondisi',
};

function getRecentRecords(dailyRecords) {
  return Object.entries(dailyRecords || {})
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 7)
    .map(([, record]) => record);
}

function getRoleQuestion(role, focusLabel) {
  if (role === 'Ahli Gizi' || role === 'Dokter Spesialis Gizi Klinik') {
    return `Apakah target makan untuk ${focusLabel} sudah realistis dengan pola makan lokal saya?`;
  }
  if (role === 'Psikolog') {
    return `Apa pola stres/mood yang paling perlu saya perhatikan untuk ${focusLabel}?`;
  }
  if (role === 'Pelatih Kebugaran') {
    return `Latihan apa yang paling aman dan realistis untuk ${focusLabel}?`;
  }
  return 'Apakah ada sinyal yang perlu saya pantau atau periksa lebih lanjut?';
}

export function buildSpecialistHandoff({ userProfile, todayRecord, dailyRecords, loggedMeals, role }) {
  const recentRecords = getRecentRecords(dailyRecords);
  const focusLabel = FOCUS_LABELS[userProfile.focus] || userProfile.focus || 'kesehatan umum';
  const checkInDays = recentRecords.filter((record) => record.checkIn).length;
  const lowRecoveryDays = recentRecords.filter((record) => (
    record.checkIn?.sleep === 1 || record.checkIn?.mood === 1 || record.checkIn?.energy === 1
  )).length;
  const mealDays = recentRecords.filter((record) => (record.meals || []).length > 0).length;
  const symptoms = recentRecords.flatMap((record) => (
    (record.logs || []).filter((log) => log.type === 'symptom').map((log) => log.label)
  ));
  const reviews = recentRecords.filter((record) => record.dailyReview).map((record) => record.dailyReview.reasonLabel);
  const todayCheckIn = todayRecord.checkIn
    ? `Energi ${todayRecord.checkIn.energy}/3, mood ${todayRecord.checkIn.mood}/3, tidur ${todayRecord.checkIn.sleep}/3`
    : 'Belum ada check-in hari ini';

  const keyConcern = symptoms.length
    ? `Gejala tercatat: ${symptoms.slice(0, 3).join(', ')}`
    : lowRecoveryDays >= 2
      ? `${lowRecoveryDays} hari recovery rendah minggu ini`
      : mealDays < 3
        ? 'Catatan makan masih kurang untuk membaca pola nutrisi'
        : 'Belum ada red flag besar dari catatan minggu ini';

  const questions = [
    getRoleQuestion(role, focusLabel),
    reviews.length
      ? `Saya sering terhambat karena ${reviews.slice(0, 2).join(' dan ')}. Apa langkah paling realistis?`
      : 'Data apa yang paling berguna untuk saya catat minggu depan?',
    symptoms.length
      ? 'Kapan gejala ini perlu diperiksa langsung?'
      : 'Apa satu kebiasaan kecil yang paling berdampak untuk minggu depan?',
  ];

  return {
    focusLabel,
    todayCheckIn,
    keyConcern,
    stats: [
      `${checkInDays}/7 hari check-in`,
      `${mealDays}/7 hari catat makan`,
      `${loggedMeals.length} makanan hari ini`,
      `${lowRecoveryDays} hari recovery rendah`,
    ],
    questions,
    shortSummary: `Fokus ${focusLabel}. ${todayCheckIn}. ${keyConcern}.`,
  };
}
