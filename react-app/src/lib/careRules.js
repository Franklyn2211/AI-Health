export const URGENT_TERMS = [
  'sesak napas',
  'nyeri dada',
  'pingsan',
  'perdarahan',
  'perdarahan hebat',
  'bunuh diri',
  'menyakiti diri',
  'tidak ingin hidup',
];

export function getRecentRecords(dailyRecords, limit = 7) {
  return Object.entries(dailyRecords || {})
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, limit)
    .map(([date, record]) => ({ date, ...record }));
}

export function analyzeCareEscalation(dailyRecords) {
  const recentRecords = getRecentRecords(dailyRecords);
  const recentLowDays = recentRecords.filter((record) => (
    record.checkIn?.mood === 1 || record.checkIn?.sleep === 1 || record.checkIn?.energy === 1
  )).length;
  const recentSymptoms = recentRecords.flatMap((record) => (
    (record.logs || []).filter((log) => log.type === 'symptom').map((log) => log.label)
  ));
  const skippedDays = recentRecords.filter((record) => record.skippedToday).length;
  const urgentSignal = recentRecords.some((record) => (
    (record.logs || []).some((log) => URGENT_TERMS.some((term) => String(log.label || '').toLowerCase().includes(term)))
  ));
  const mentalSignal = recentRecords.filter((record) => record.checkIn?.mood === 1).length;
  const sleepSignal = recentRecords.filter((record) => record.checkIn?.sleep === 1).length;

  if (urgentSignal) {
    return {
      level: 'urgent',
      title: 'Cari bantuan langsung',
      label: 'Urgent',
      detail: 'Ada sinyal yang sebaiknya tidak ditangani oleh AI saja.',
      action: 'Lihat bantuan',
      target: 'clinic',
      recommendedExpert: 'Dokter umum atau layanan darurat',
      reasons: ['Urgent keyword appeared in recent logs'],
    };
  }

  if (recentSymptoms.length >= 2 || recentLowDays >= 3 || skippedDays >= 3) {
    const reasons = [
      recentSymptoms.length >= 2 ? `${recentSymptoms.length} gejala tercatat minggu ini` : null,
      recentLowDays >= 3 ? `${recentLowDays} hari readiness rendah` : null,
      skippedDays >= 3 ? `${skippedDays} hari dilewati` : null,
    ].filter(Boolean);
    const recommendedExpert = mentalSignal >= 2
      ? 'Psikolog'
      : sleepSignal >= 2
        ? 'Psikolog atau dokter umum'
        : recentSymptoms.length >= 2
          ? 'Dokter umum'
          : 'Health coach';

    return {
      level: 'review',
      title: 'Chat ahli disarankan',
      label: 'Perlu ditinjau',
      detail: reasons[0] || 'Ada pola berulang yang sebaiknya ditinjau manusia.',
      action: 'Booking chat',
      target: 'clinic',
      recommendedExpert,
      reasons,
    };
  }

  return {
    level: 'self-care',
    title: 'AI cukup untuk hari ini',
    label: 'Self-care',
    detail: 'Belum ada pola yang perlu dieskalasi. Kamu bisa lanjut langkah kecil dulu.',
    action: 'Tanya AI',
    target: 'ai',
    recommendedExpert: null,
    reasons: ['Belum ada pola risiko berulang dalam 7 hari terakhir'],
  };
}
