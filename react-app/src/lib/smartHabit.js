import { buildAdaptiveTargets } from './adaptiveTargets';

function getRecentRecords(dailyRecords) {
  return Object.entries(dailyRecords || {})
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 7)
    .map(([, record]) => record);
}

function hasRecentReason(records, reasonId) {
  return records.some((record) => record.dailyReview?.reasonId === reasonId);
}

function countLowRecovery(records) {
  return records.filter((record) => {
    const checkIn = record.checkIn || {};
    return checkIn.sleep === 1 || checkIn.energy === 1 || checkIn.mood === 1;
  }).length;
}

function countMealDays(records) {
  return records.filter((record) => record.meals?.length || record.consumedCalories > 0).length;
}

function countProteinDays(records, proteinTarget) {
  const usefulTarget = Math.max(proteinTarget * 0.65, 35);
  return records.filter((record) => (record.macros?.protein || 0) >= usefulTarget).length;
}

function buildHabit({
  id,
  title,
  description,
  category,
  reason,
  steps,
  reviewer,
  reviewerRole,
  days = 5,
  safety = 'Ini panduan wellness ringan, bukan diagnosis atau pengganti konsultasi profesional.',
}) {
  return {
    id,
    title,
    description,
    category,
    reason,
    steps,
    days,
    reviewedBy: reviewer,
    reviewerRole,
    safety,
    source: 'smart-habit',
  };
}

export function buildSmartHabitRecommendation({ userProfile = {}, todayRecord = {}, dailyRecords = {} } = {}) {
  const adaptivePlan = buildAdaptiveTargets(userProfile, todayRecord, dailyRecords);
  const recentRecords = getRecentRecords(dailyRecords);
  const direction = adaptivePlan.direction;
  const focus = userProfile.focus;
  const proteinDays = countProteinDays(recentRecords, adaptivePlan.nutrition.proteinTarget);
  const mealDays = countMealDays(recentRecords);
  const lowRecoveryDays = countLowRecovery(recentRecords);
  const tiredPattern = hasRecentReason(recentRecords, 'tired') || lowRecoveryDays >= 2;
  const moodPattern = hasRecentReason(recentRecords, 'mood') || ['stress', 'mood', 'burnout'].includes(focus);
  const sleepPattern = hasRecentReason(recentRecords, 'sleep') || focus === 'sleep';

  if (direction === 'lose') {
    return buildHabit({
      id: 'protein-walk-cut',
      title: 'Protein dulu, jalan setelah makan',
      category: 'Diet sehat',
      description: 'Satu kebiasaan kecil untuk bantu defisit tanpa bikin hari terasa seperti diet ketat.',
      reason: `Goal kamu butuh defisit ringan. AI memilih habit ini agar target ${adaptivePlan.nutrition.calorieTarget} kcal lebih mudah dijaga.`,
      steps: [
        'Mulai makan besar dengan lauk protein.',
        'Kurangi minuman manis atau gorengan ekstra hari ini.',
        'Jalan santai 10 menit setelah salah satu makan besar.',
      ],
      reviewer: 'Nadia Putri, S.Gz., RD',
      reviewerRole: 'Ahli Gizi',
    });
  }

  if (direction === 'gain' || direction === 'strength') {
    return buildHabit({
      id: proteinDays < 4 ? 'protein-breakfast-gain' : 'strength-anchor',
      title: proteinDays < 4 ? 'Protein pertama sebelum siang' : 'Latihan fondasi singkat',
      category: direction === 'gain' ? 'Naik berat badan' : 'Fitness',
      description: proteinDays < 4
        ? 'Tambah protein lebih awal agar surplus lebih sering jadi massa otot, bukan sekadar kalori.'
        : 'Satu sesi pendek untuk menjaga stimulus latihan walau hari sedang padat.',
      reason: proteinDays < 4
        ? `Protein beberapa hari terakhir belum stabil. AI menargetkan ${adaptivePlan.nutrition.proteinTarget}g protein dengan langkah yang mudah.`
        : 'Protein mulai terlihat cukup, jadi habit berikutnya adalah menjaga stimulus latihan.',
      steps: proteinDays < 4
        ? ['Pilih telur, tempe, ayam, tahu, ikan, atau susu saat makan pertama.', 'Tambahkan karbo lokal seperti nasi atau roti sesuai lapar.', 'Catat makanan dengan satu kalimat.']
        : ['Pilih squat, push-up, row, atau plank.', 'Lakukan 8-15 menit dengan teknik rapi.', 'Turunkan intensitas jika tidur atau energi rendah.'],
      reviewer: proteinDays < 4 ? 'Nadia Putri, S.Gz., RD' : 'Bima Arya, CPT',
      reviewerRole: proteinDays < 4 ? 'Ahli Gizi' : 'Personal Trainer',
    });
  }

  if (sleepPattern || tiredPattern) {
    return buildHabit({
      id: 'recovery-anchor',
      title: 'Wind-down 20 menit',
      category: 'Recovery',
      description: 'Lindungi energi besok dengan rutinitas malam yang realistis.',
      reason: 'AI melihat sinyal tidur atau energi rendah, jadi target hari ini dibuat lebih ringan dan fokus pada recovery.',
      steps: ['Pilih jam mulai wind-down.', 'Kurangi layar atau kerja berat 20 menit.', 'Catat energi pagi besok.'],
      reviewer: 'Maya Putri, M.Psi., Psikolog',
      reviewerRole: 'Psikolog',
    });
  }

  if (moodPattern) {
    return buildHabit({
      id: 'two-minute-reset',
      title: 'Reset 2 menit',
      category: 'Mental health',
      description: 'Jeda pendek untuk menurunkan beban mental tanpa membuat user harus journaling panjang.',
      reason: 'AI memilih habit mental ringan karena mood, stres, atau burnout muncul sebagai pola utama.',
      steps: ['Tarik napas pelan 5 kali.', 'Tulis satu pemicu atau satu hal yang terasa berat.', 'Pilih satu aksi kecil yang bisa selesai hari ini.'],
      reviewer: 'Maya Putri, M.Psi., Psikolog',
      reviewerRole: 'Psikolog',
      safety: 'Jika muncul pikiran menyakiti diri atau rasa tidak aman, cari bantuan manusia segera.',
    });
  }

  if (mealDays < 4) {
    return buildHabit({
      id: 'one-line-food-log',
      title: 'Catat makan satu kalimat',
      category: 'Food diary',
      description: 'Bikin AI lebih pintar tanpa meminta user input panjang.',
      reason: 'Data makan masih sedikit. Habit ini mempercepat personalisasi target dan meal plan.',
      steps: ['Tulis makan utama dengan bahasa biasa.', 'Tambahkan rasa lapar atau kenyang jika ingat.', 'Biarkan AI merapikan log ke diary.'],
      reviewer: 'Nadia Putri, S.Gz., RD',
      reviewerRole: 'Ahli Gizi',
    });
  }

  return buildHabit({
    id: 'daily-anchor',
    title: 'Satu check-in, satu aksi',
    category: 'Rutinitas sehat',
    description: 'Jaga app tetap berguna walau user sedang malas input.',
    reason: `AI belum melihat pola kuat, jadi habit awal dibuat netral untuk goal ${adaptivePlan.focusLabel}.`,
    steps: ['Isi check-in singkat.', 'Selesaikan satu langkah utama.', 'Review malam dengan satu tap.'],
    reviewer: 'dr. Andi Pratama',
    reviewerRole: 'Dokter Umum',
  });
}
