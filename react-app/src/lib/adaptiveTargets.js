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

const ACTIVITY_MULTIPLIER = {
  Rendah: 1.25,
  Ringan: 1.35,
  Sedang: 1.5,
  Aktif: 1.7,
};

function toNumber(value, fallback) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function roundTo(value, step) {
  return Math.round(value / step) * step;
}

function getLatestRecordedWeight(userProfile) {
  return toNumber(userProfile.currentWeight, 68);
}

function getGoalDirection(userProfile) {
  const currentWeight = getLatestRecordedWeight(userProfile);
  const targetWeight = toNumber(userProfile.targetWeight, currentWeight);
  if (userProfile.focus === 'gain-weight' || targetWeight >= currentWeight + 1) return 'gain';
  if (userProfile.focus === 'lose-weight' || targetWeight <= currentWeight - 1) return 'lose';
  if (userProfile.focus === 'build-strength') return 'strength';
  return 'maintain';
}

function estimateMaintenanceCalories(userProfile) {
  const weight = getLatestRecordedWeight(userProfile);
  const height = toNumber(userProfile.height, 170);
  const age = toNumber(userProfile.age, 28);
  const isFemale = String(userProfile.gender || '').toLowerCase().includes('wanita');
  const bmr = (10 * weight) + (6.25 * height) - (5 * age) + (isFemale ? -161 : 5);
  const multiplier = ACTIVITY_MULTIPLIER[userProfile.activityLevel] || 1.35;
  return roundTo(bmr * multiplier, 25);
}

function estimateConsumed(todayRecord) {
  const meals = todayRecord.meals || [];
  if (todayRecord.consumedCalories) return todayRecord.consumedCalories;
  return meals.reduce((sum, meal) => sum + (meal.cal || meal.calories || 0), 0);
}

function estimateMacros(todayRecord) {
  const meals = todayRecord.meals || [];
  if (todayRecord.macros) return todayRecord.macros;
  return meals.reduce((sum, meal) => ({
    protein: sum.protein + (meal.prot || meal.protein || 0),
    carbs: sum.carbs + (meal.carbs || 0),
    fat: sum.fat + (meal.fat || 0),
  }), { protein: 0, carbs: 0, fat: 0 });
}

function estimateBurned(todayRecord) {
  const actions = todayRecord.completedActions || [];
  const actionBurn = actions.reduce((sum, action) => {
    if (['movement', 'walk'].includes(action)) return sum + 90;
    if (action === 'reset' || action === 'wind-down') return sum + 15;
    return sum;
  }, 0);
  return todayRecord.burnedCalories || actionBurn;
}

function estimateSleepHours(todayRecord) {
  if (todayRecord.sleepDetails?.durationMinutes) return todayRecord.sleepDetails.durationMinutes / 60;
  const score = todayRecord.checkIn?.sleep;
  if (score === 3) return 7.5;
  if (score === 2) return 6.5;
  if (score === 1) return 5.25;
  return 0;
}

function getRecentRecords(dailyRecords) {
  return Object.entries(dailyRecords || {})
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 7)
    .map(([, record]) => record);
}

function buildNutritionTargets(userProfile, todayRecord) {
  const weight = getLatestRecordedWeight(userProfile);
  const direction = getGoalDirection(userProfile);
  const maintenance = estimateMaintenanceCalories(userProfile);
  const checkIn = todayRecord.checkIn;
  const lowReadiness = checkIn?.energy === 1 || checkIn?.sleep === 1 || checkIn?.mood === 1;

  const calorieAdjustment = {
    gain: lowReadiness ? 200 : 300,
    lose: lowReadiness ? -200 : -350,
    strength: 150,
    maintain: 0,
  }[direction];

  const proteinMultiplier = {
    gain: 1.8,
    lose: 1.7,
    strength: 1.9,
    maintain: 1.4,
  }[direction];

  const calorieTarget = clamp(roundTo(maintenance + calorieAdjustment, 50), 1400, 3400);
  const proteinTarget = roundTo(weight * proteinMultiplier, 5);
  const carbTarget = roundTo((calorieTarget * (direction === 'gain' ? 0.48 : 0.43)) / 4, 5);
  const fatTarget = roundTo((calorieTarget * 0.28) / 9, 5);

  return {
    direction,
    maintenance,
    calorieTarget,
    proteinTarget,
    carbTarget,
    fatTarget,
    lowReadiness,
  };
}

function buildChecklist(userProfile, todayRecord, nutrition, dailyBasics = {}) {
  const direction = nutrition.direction;
  const focus = userProfile.focus;
  const checklist = [];

  if (direction === 'gain') {
    checklist.push({
      id: 'surplus-meal',
      title: 'Tambah surplus sehat',
      detail: `Kejar ${nutrition.calorieTarget} kcal dengan porsi ekstra nasi, tempe, telur, atau susu.`,
      icon: 'utensils',
      tone: 'bg-orange-50 text-orange-700',
      subView: 'meal-planner',
      methodId: 'meal',
    });
    checklist.push({
      id: 'protein-target',
      title: `Protein ${nutrition.proteinTarget}g`,
      detail: 'Bagi ke 3 makan agar naik berat badan lebih banyak jadi massa otot.',
      icon: 'target',
      tone: 'bg-emerald-50 text-emerald-700',
      subView: 'food-scanner',
      methodId: 'meal',
    });
    checklist.push({
      id: 'strength-stimulus',
      title: 'Latihan kekuatan singkat',
      detail: 'Fokus squat, push, pull, atau dumbbell 12-20 menit sesuai alat yang ada.',
      icon: 'dumbbell',
      tone: 'bg-sky-50 text-sky-700',
      subView: 'fitness-routine',
      methodId: 'movement',
    });
  } else if (direction === 'lose') {
    checklist.push({
      id: 'protein-first',
      title: `Protein dulu ${nutrition.proteinTarget}g`,
      detail: 'Pilih lauk utama sebelum karbo agar kenyang tanpa kalori berlebih.',
      icon: 'utensils',
      tone: 'bg-orange-50 text-orange-700',
      subView: 'meal-planner',
      methodId: 'meal',
    });
    checklist.push({
      id: 'calorie-gap',
      title: `Jaga batas ${nutrition.calorieTarget} kcal`,
      detail: 'Kurangi minuman manis, gorengan ekstra, atau kuah santan berlebih.',
      icon: 'flame',
      tone: 'bg-rose-50 text-rose-700',
      subView: 'food-scanner',
      methodId: 'meal',
    });
    checklist.push({
      id: 'easy-burn',
      title: 'Gerak ringan setelah makan',
      detail: '10-20 menit jalan santai cukup untuk bantu gula darah dan defisit harian.',
      icon: 'activity',
      tone: 'bg-teal-50 text-teal-700',
      subView: 'fitness-routine',
      methodId: 'walk',
    });
  } else if (focus === 'stress' || focus === 'mood' || focus === 'burnout' || focus === 'sleep') {
    checklist.push({
      id: 'mood-reset',
      title: 'Reset 2 menit',
      detail: 'Napas pelan atau tulis satu pemicu agar AI tahu pola stresmu.',
      icon: 'brain',
      tone: 'bg-violet-50 text-violet-700',
      subView: 'mood-tracker',
      methodId: 'reset',
    });
    checklist.push({
      id: 'steady-meal',
      title: 'Makan stabil',
      detail: `Target ${nutrition.proteinTarget}g protein untuk menjaga energi dan mood.`,
      icon: 'utensils',
      tone: 'bg-orange-50 text-orange-700',
      subView: 'meal-planner',
      methodId: 'meal',
    });
    checklist.push({
      id: 'sleep-protect',
      title: 'Lindungi tidur',
      detail: 'Mulai wind-down 30 menit sebelum tidur agar besok tidak turun energi.',
      icon: 'moon',
      tone: 'bg-sky-50 text-sky-700',
      subView: 'sleep-tracker',
      methodId: 'wind-down',
    });
  } else {
    checklist.push({
      id: 'balanced-target',
      title: `Makan sesuai target`,
      detail: `${nutrition.calorieTarget} kcal dan ${nutrition.proteinTarget}g protein untuk fokus hari ini.`,
      icon: 'utensils',
      tone: 'bg-orange-50 text-orange-700',
      subView: 'meal-planner',
      methodId: 'meal',
    });
    checklist.push({
      id: 'movement-dose',
      title: 'Dosis gerak harian',
      detail: nutrition.lowReadiness ? 'Cukup 5-10 menit supaya ritme tetap hidup.' : '10-20 menit gerak ringan atau latihan pendek.',
      icon: 'activity',
      tone: 'bg-teal-50 text-teal-700',
      subView: 'fitness-routine',
      methodId: 'movement',
    });
    checklist.push({
      id: 'recovery-check',
      title: 'Cek recovery',
      detail: 'Catat mood atau tidur agar AI bisa menurunkan target saat tubuh sedang berat.',
      icon: 'moon',
      tone: 'bg-sky-50 text-sky-700',
      subView: 'sleep-tracker',
      methodId: 'wind-down',
    });
  }

  const dailyChecklist = [
    ...checklist,
    {
      id: 'hydration-target',
      title: `Air ${dailyBasics.waterTarget || 8} gelas`,
      detail: 'Target kecil yang membantu energi, lapar palsu, dan fokus sepanjang hari.',
      icon: 'droplets',
      tone: 'bg-cyan-50 text-cyan-700',
      methodId: 'nutrition',
    },
    {
      id: 'daily-review',
      title: 'Review malam 1 tap',
      detail: 'Tutup hari dengan alasan singkat supaya AI bisa mengatur plan besok.',
      icon: 'sparkles',
      tone: 'bg-teal-50 text-teal-700',
      methodId: 'ai-coordination',
    },
  ];

  if (todayRecord.planMode === 'minimum') return dailyChecklist.slice(0, 2);
  if (todayRecord.planMode === 'full') return dailyChecklist;
  return dailyChecklist.slice(0, 4);
}

export function getChecklistTargetId(actionId) {
  const targetByAction = {
    'surplus-meal': 'calories',
    'protein-target': 'protein',
    'protein-first': 'protein',
    'calorie-gap': 'calories',
    'steady-meal': 'protein',
    'balanced-target': 'calories',
    'strength-stimulus': 'burn',
    'easy-burn': 'burn',
    'movement-dose': 'burn',
    'hydration-target': 'water',
    'sleep-protect': 'sleep',
    'recovery-check': 'sleep',
  };

  return targetByAction[actionId] || null;
}

export function getChecklistAutoComplete(action, adaptivePlan, todayRecord = {}) {
  const targetId = getChecklistTargetId(action.id);
  const target = targetId ? adaptivePlan.targets.find((item) => item.id === targetId) : null;
  const value = target?.value || 0;
  const targetValue = target?.target || 0;
  const hasMealData = Boolean(todayRecord.meals?.length);

  if (['protein-target', 'protein-first', 'steady-meal'].includes(action.id)) {
    return targetValue > 0 && value >= targetValue;
  }

  if (['surplus-meal', 'balanced-target'].includes(action.id)) {
    return targetValue > 0 && value >= targetValue;
  }

  if (action.id === 'calorie-gap') {
    return hasMealData && targetValue > 0 && value > 0 && value <= targetValue;
  }

  if (['strength-stimulus', 'easy-burn', 'movement-dose'].includes(action.id)) {
    return targetValue > 0 && value >= targetValue;
  }

  if (action.id === 'hydration-target') {
    return targetValue > 0 && value >= targetValue;
  }

  if (['sleep-protect', 'recovery-check'].includes(action.id)) {
    return targetValue > 0 && value >= targetValue;
  }

  if (action.id === 'daily-review') {
    return Boolean(todayRecord.summaryConfirmed || todayRecord.dailyReview);
  }

  if (action.id === 'mood-reset') {
    return Boolean(todayRecord.checkIn?.mood || todayRecord.logs?.some((log) => log.type === 'mood' || log.type === 'quick-log'));
  }

  return false;
}

export function buildAdaptiveTargets(userProfile, todayRecord = {}, dailyRecords = {}) {
  const nutrition = buildNutritionTargets(userProfile, todayRecord);
  const consumedCalories = estimateConsumed(todayRecord);
  const macros = estimateMacros(todayRecord);
  const burnedCalories = estimateBurned(todayRecord);
  const sleepHours = estimateSleepHours(todayRecord);
  const recentRecords = getRecentRecords(dailyRecords);
  const recordedDays = recentRecords.filter((record) => record.checkIn || record.meals?.length || record.summaryConfirmed).length;
  const waterTarget = nutrition.lowReadiness ? 7 : 8;
  const burnTarget = nutrition.lowReadiness ? 80 : nutrition.direction === 'gain' ? 120 : nutrition.direction === 'lose' ? 220 : 160;
  const sleepTarget = userProfile.focus === 'sleep' || userProfile.focus === 'burnout' ? 8 : 7.5;
  const focusLabel = FOCUS_LABELS[userProfile.focus] || 'rutinitas sehat';

  const targets = [
    {
      id: 'calories',
      label: 'Kalori',
      value: Math.round(consumedCalories),
      target: nutrition.calorieTarget,
      unit: 'kcal',
      icon: 'flame',
      tone: 'bg-orange-50 text-orange-700',
    },
    {
      id: 'protein',
      label: 'Protein',
      value: Math.round(macros.protein || 0),
      target: nutrition.proteinTarget,
      unit: 'g',
      icon: 'target',
      tone: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'water',
      label: 'Air',
      value: todayRecord.water || 0,
      target: waterTarget,
      unit: 'gelas',
      icon: 'droplets',
      tone: 'bg-cyan-50 text-cyan-700',
    },
    {
      id: 'burn',
      label: 'Gerak',
      value: burnedCalories,
      target: burnTarget,
      unit: 'kcal',
      icon: 'activity',
      tone: 'bg-teal-50 text-teal-700',
    },
    {
      id: 'sleep',
      label: 'Tidur',
      value: Number(sleepHours.toFixed(1)),
      target: sleepTarget,
      unit: 'jam',
      icon: 'moon',
      tone: 'bg-sky-50 text-sky-700',
    },
  ];

  const directionCopy = {
    gain: `AI menaikkan target makan dari estimasi maintenance ${nutrition.maintenance} kcal karena fokusmu ${focusLabel}.`,
    lose: `AI membuat defisit ringan dari estimasi maintenance ${nutrition.maintenance} kcal agar target tetap realistis.`,
    strength: `AI menjaga kalori sedikit lebih tinggi dan protein kuat untuk mendukung latihan.`,
    maintain: `AI menjaga target stabil sambil membaca pola energi, tidur, dan makanan.`,
  };

  return {
    focusLabel,
    direction: nutrition.direction,
    summary: directionCopy[nutrition.direction],
    adjustment: nutrition.lowReadiness
      ? 'Hari ini dibuat lebih ringan karena check-in energi, mood, atau tidur sedang rendah.'
      : 'Target hari ini mengikuti profil dan goal utama user.',
    nutrition,
    targets,
    checklist: buildChecklist(userProfile, todayRecord, nutrition, { waterTarget }),
    confidence: recordedDays >= 7 ? 'Tinggi' : recordedDays >= 3 ? 'Sedang' : 'Awal',
  };
}
