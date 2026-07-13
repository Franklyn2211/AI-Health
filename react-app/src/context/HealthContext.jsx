import { useState, useCallback, useMemo } from 'react';
import { HealthContext } from './healthContextCore';

const getDateKey = (date = new Date()) => date.toISOString().slice(0, 10);
const getYesterdayKey = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return getDateKey(yesterday);
};

const readStorage = (key, fallback) => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
};

const buildDemoDailyRecords = () => {
    const blueprints = [
        { energy: 2, mood: 2, sleep: 2, water: 5, meals: ['Nasi warteg ayam sayur', 'Buah potong'], actions: ['meal'], logs: ['Sedikit tegang setelah kerja'] },
        { energy: 1, mood: 1, sleep: 1, water: 3, meals: [], actions: [], logs: ['Sakit kepala ringan'] },
        { energy: 2, mood: 2, sleep: 2, water: 6, meals: ['Bubur ayam', 'Sup sayur'], actions: ['meal', 'walk'], logs: [] },
        { energy: 3, mood: 3, sleep: 3, water: 7, meals: ['Gado-gado telur', 'Ayam panggang'], actions: ['meal', 'movement'], logs: [] },
        { energy: 1, mood: 2, sleep: 1, water: 4, meals: ['Roti telur'], actions: ['reset'], logs: ['Stres meeting'] },
        { energy: 2, mood: 2, sleep: 2, water: 6, meals: ['Nasi Padang ayam pop', 'Buah'], actions: ['meal', 'walk'], logs: [] },
        { energy: 1, mood: 2, sleep: 1, water: 4, meals: ['Kopi', 'Roti bakar'], actions: [], logs: ['Lelah pagi'] },
        { energy: 2, mood: 2, sleep: 2, water: 5, meals: ['Telur dadar', 'Sayur bening'], actions: ['meal'], logs: [] },
        { energy: 3, mood: 2, sleep: 3, water: 8, meals: ['Nasi merah ayam', 'Yogurt'], actions: ['meal', 'movement'], logs: [] },
        { energy: 2, mood: 1, sleep: 2, water: 4, meals: ['Mie ayam'], actions: ['reset'], logs: ['Cemas sebelum presentasi'] },
        { energy: 2, mood: 3, sleep: 2, water: 7, meals: ['Gado-gado', 'Tempe'], actions: ['meal', 'walk'], logs: [] },
        { energy: 1, mood: 2, sleep: 1, water: 3, meals: ['Roti', 'Kopi'], actions: [], logs: ['Tidur larut'] },
        { energy: 2, mood: 2, sleep: 2, water: 6, meals: ['Soto ayam', 'Pisang'], actions: ['meal'], logs: [] },
        { energy: 2, mood: 2, sleep: 2, water: 5, meals: ['Bakso kuah', 'Sayur'], actions: ['meal', 'reset'], logs: [] },
    ];

    const today = new Date();
    return blueprints.reduce((records, day, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (blueprints.length - 1 - index));
        const key = getDateKey(date);
        const meals = day.meals.map((name, mealIndex) => ({
            name,
            cal: mealIndex === 0 ? 420 : 160,
            prot: mealIndex === 0 ? 24 : 5,
            carbs: mealIndex === 0 ? 46 : 18,
            fat: mealIndex === 0 ? 12 : 4,
            estimatedPrice: mealIndex === 0 ? 18000 : 8000,
            source: 'demo',
        }));
        const macros = meals.reduce((sum, meal) => ({
            protein: sum.protein + meal.prot,
            carbs: sum.carbs + meal.carbs,
            fat: sum.fat + meal.fat,
        }), { protein: 0, carbs: 0, fat: 0 });

        records[key] = {
            checkIn: { energy: day.energy, mood: day.mood, sleep: day.sleep },
            water: day.water,
            meals,
            consumedCalories: meals.reduce((sum, meal) => sum + meal.cal, 0),
            macros,
            completedActions: day.actions,
            planMode: day.energy === 1 || day.sleep === 1 ? 'minimum' : 'short',
            dailyReview: index > 8 ? {
                reasonId: day.energy === 1 ? 'tired' : day.mood === 1 ? 'mood' : 'busy',
                reasonLabel: day.energy === 1 ? 'Capek' : day.mood === 1 ? 'Mood berat' : 'Sibuk',
                missedTargets: day.meals.length ? ['Protein'] : ['Kalori', 'Protein'],
                incompleteActions: day.actions.length ? [] : ['Langkah utama'],
                completion: day.actions.length ? 70 : 25,
                impact: {
                    title: day.energy === 1 ? 'Besok mulai dari recovery' : 'Besok mulai dari protein',
                    detail: day.energy === 1
                        ? 'AI menurunkan mode plan agar target tetap realistis tanpa memaksa tubuh.'
                        : 'AI menjaga checklist pendek dan memulai dari makanan lokal yang mudah dicari.',
                },
                createdAt: new Date(date).toISOString(),
            } : null,
            logs: day.logs.map((label, logIndex) => ({
                id: `${key}-demo-${logIndex}`,
                type: label.toLowerCase().includes('sakit') ? 'symptom' : 'quick-log',
                label,
                createdAt: new Date(date).toISOString(),
            })),
            sleepDetails: {
                bedtime: day.sleep === 1 ? '00:45' : '22:45',
                wakeTime: day.sleep === 1 ? '06:10' : '06:30',
                durationMinutes: day.sleep === 1 ? 325 : 465,
                quality: day.sleep,
                awakenings: day.sleep === 1 ? 2 : 0,
                rested: day.energy,
                routine: day.sleep === 1 ? ['screen-late'] : ['wind-down'],
                source: 'demo',
                recordedAt: new Date(date).toISOString(),
            },
            summaryConfirmed: index > 9,
            tomorrowAdjustment: index === blueprints.length - 1 ? {
                reasonId: 'tired',
                reasonLabel: 'Capek',
                sourceDate: key,
                title: 'Hari ini dibuat lebih ringan',
                detail: 'Karena beberapa hari terakhir tidur dan energi naik turun, AI mulai dari protein mudah dan gerak ringan.',
                carryOver: ['Protein', 'Recovery'],
                createdAt: new Date(date).toISOString(),
            } : null,
            updatedAt: new Date(date).toISOString(),
        };
        return records;
    }, {});
};

const AVAILABLE_GOALS = [
    { id: 'body-goals',          label: 'Target Tubuh', features: ['weight-tracking', 'meal-planner', 'fitness-routine'] },
    { id: 'mental-health',       label: 'Kesehatan Mental', features: ['sleep-tracker', 'meditation'] },
    { id: 'immune-booster',      label: 'Rutinitas Sehat', features: ['health-monitor', 'nutrition-guide'] }
];

const DEFAULT_PROFILE = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    goals: [],
    primaryGoal: '',
    focus: '',
    healthConditions: [],
    allergies: [],
    age: null,
    gender: '',
    currentWeight: '',
    targetWeight: '',
    height: '',
    equipment: '',
    diet: 'Halal (default)',
    activityLevel: '',
    stressors: [],
    sleepQuality: '',
    availableTime: '15'
};

export function HealthProvider({ children }) {
    const [userProfile, setUserProfile] = useState(() => {
        try {
            const savedProfile = localStorage.getItem('userProfile');
            return savedProfile ? { ...DEFAULT_PROFILE, ...JSON.parse(savedProfile) } : DEFAULT_PROFILE;
        } catch {
            return DEFAULT_PROFILE;
        }
    });

    const [hasOnboarded, setHasOnboarded] = useState(() => localStorage.getItem('hasOnboarded') === 'true');
    
    const [dailyRecords, setDailyRecords] = useState(() => readStorage('dailyRecords', {}));
    const [careAppointments, setCareAppointments] = useState(() => readStorage('careAppointments', []));
    const [healthExperiment, setHealthExperiment] = useState(() => readStorage('healthExperiment', null));
    const todayKey = getDateKey();
    const todayRecord = useMemo(() => dailyRecords[todayKey] || {}, [dailyRecords, todayKey]);

    // Nutrition state
    const [consumedCalories, setConsumedCalories] = useState(() => todayRecord.consumedCalories || 0);
    const [macros, setMacros] = useState(() => todayRecord.macros || { protein: 0, carbs: 0, fat: 0 });
    const [loggedMeals, setLoggedMeals] = useState(() => todayRecord.meals || []);

    const updateDailyRecord = useCallback((updates, dateKey = getDateKey()) => {
        setDailyRecords(prev => {
            const current = prev[dateKey] || {};
            const nextUpdates = typeof updates === 'function' ? updates(current) : updates;
            const updated = {
                ...prev,
                [dateKey]: {
                    ...current,
                    ...nextUpdates,
                    updatedAt: new Date().toISOString(),
                },
            };
            localStorage.setItem('dailyRecords', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const setDailyCheckIn = useCallback((checkIn) => {
        updateDailyRecord({ checkIn });
    }, [updateDailyRecord]);

    const toggleDailyAction = useCallback((actionId) => {
        updateDailyRecord(current => {
            const completed = current.completedActions || [];
            return {
                completedActions: completed.includes(actionId)
                    ? completed.filter(id => id !== actionId)
                    : [...completed, actionId],
            };
        });
    }, [updateDailyRecord]);

    const incrementWater = useCallback(() => {
        updateDailyRecord(current => ({ water: Math.min((current.water || 0) + 1, 12) }));
    }, [updateDailyRecord]);

    const addDailyLog = useCallback((type, entry) => {
        updateDailyRecord(current => ({
            logs: [
                {
                    id: `${Date.now()}-${type}`,
                    type,
                    createdAt: new Date().toISOString(),
                    ...entry,
                },
                ...(current.logs || []),
            ],
        }));
    }, [updateDailyRecord]);

    const bookAppointment = useCallback((appointment) => {
        setCareAppointments(prev => {
            const updated = [
                {
                    id: `${Date.now()}-appointment`,
                    status: 'upcoming',
                    createdAt: new Date().toISOString(),
                    ...appointment,
                },
                ...prev,
            ];
            localStorage.setItem('careAppointments', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const repeatOnboarding = useCallback(() => {
        localStorage.removeItem('hasOnboarded');
        localStorage.removeItem('activeTab');
        localStorage.removeItem('healthTeamIntroSeen');
        localStorage.removeItem('healthTeamIntroV2Seen');
        localStorage.removeItem('healthTeamIntroV3Seen');
        setHasOnboarded(false);
    }, []);

    const resetAllData = useCallback(() => {
        localStorage.clear();
        window.location.reload();
    }, []);

    const loadDemoData = useCallback(() => {
        const demoRecords = buildDemoDailyRecords();
        const today = demoRecords[getDateKey()] || {};
        const demoProfile = {
            ...DEFAULT_PROFILE,
            fullName: 'Jason Demo',
            email: 'jason.demo@vin-ai.local',
            phone: '+62 812 0000 2026',
            goals: ['body-goals', 'mental-health', 'immune-booster'],
            primaryGoal: 'body-goals',
            focus: 'gain-weight',
            healthConditions: ['GERD'],
            allergies: ['Tidak ada'],
            age: 25,
            gender: 'Pria',
            currentWeight: '72',
            targetWeight: '76',
            height: '175',
            equipment: 'Tanpa alat',
            diet: 'Halal',
            activityLevel: 'Ringan',
            stressors: ['Kerja', 'Tidur tidak konsisten'],
            sleepQuality: 'Kadang kurang',
            availableTime: '15',
            demoMode: true,
        };
        const demoAppointments = [
            {
                id: 'demo-appointment-nutrition',
                professionalId: 'nadia',
                professionalName: 'Nadia Putri, S.Gz., RD',
                role: 'Ahli Gizi',
                slot: 'Hari ini, 16:30',
                price: 95000,
                duration: 40,
                consultationType: 'chat',
                sharedSummary: true,
                status: 'upcoming',
                createdAt: new Date().toISOString(),
            },
            {
                id: 'demo-appointment-psychologist',
                professionalId: 'maya',
                professionalName: 'Maya Putri, M.Psi., Psikolog',
                role: 'Psikolog',
                slot: 'Besok, 19:00',
                price: 120000,
                duration: 45,
                consultationType: 'chat',
                sharedSummary: true,
                status: 'scheduled',
                createdAt: new Date().toISOString(),
            },
            {
                id: 'demo-appointment-pt',
                professionalId: 'bima',
                professionalName: 'Bima Arya, CPT',
                role: 'Personal Trainer',
                slot: 'Jumat, 17:30',
                price: 85000,
                duration: 30,
                consultationType: 'chat',
                sharedSummary: true,
                status: 'scheduled',
                createdAt: new Date().toISOString(),
            },
        ];
        const demoExperiment = {
            id: 'protein-breakfast-gain',
            title: 'Protein pertama sebelum siang',
            description: 'Tambah protein lebih awal agar target naik berat badan lebih mudah dikejar.',
            days: 5,
            reviewedBy: 'Nadia Putri, S.Gz., RD',
            reviewerRole: 'Ahli Gizi',
            completedDays: Object.keys(demoRecords).slice(-3),
            startedAt: Object.keys(demoRecords).slice(-4)[0],
            active: true,
            source: 'smart-habit',
        };

        setUserProfile(demoProfile);
        setHasOnboarded(true);
        setDailyRecords(demoRecords);
        setCareAppointments(demoAppointments);
        setHealthExperiment(demoExperiment);
        setLoggedMeals(today.meals || []);
        setConsumedCalories(today.consumedCalories || 0);
        setMacros(today.macros || { protein: 0, carbs: 0, fat: 0 });

        localStorage.setItem('hasOnboarded', 'true');
        localStorage.setItem('activeTab', 'home');
        localStorage.setItem('userProfile', JSON.stringify(demoProfile));
        localStorage.setItem('dailyRecords', JSON.stringify(demoRecords));
        localStorage.setItem('careAppointments', JSON.stringify(demoAppointments));
        localStorage.setItem('healthExperiment', JSON.stringify(demoExperiment));
        return true;
    }, []);

    const startHealthExperiment = useCallback((experiment) => {
        const next = {
            ...experiment,
            startedAt: getDateKey(),
            completedDays: [],
            active: true,
        };
        setHealthExperiment(next);
        localStorage.setItem('healthExperiment', JSON.stringify(next));
    }, []);

    const toggleExperimentToday = useCallback(() => {
        setHealthExperiment(prev => {
            if (!prev) return prev;
            const dateKey = getDateKey();
            const completedDays = prev.completedDays || [];
            const updated = {
                ...prev,
                completedDays: completedDays.includes(dateKey)
                    ? completedDays.filter(day => day !== dateKey)
                    : [...completedDays, dateKey],
            };
            localStorage.setItem('healthExperiment', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const reuseYesterdayEntries = useCallback(() => {
        const yesterday = dailyRecords[getYesterdayKey()];
        if (!yesterday) return false;

        const reusedMeals = todayRecord.meals?.length ? todayRecord.meals : (yesterday.meals || []);
        const reusedSleep = todayRecord.sleepDetails || yesterday.sleepDetails || null;
        updateDailyRecord({
            meals: reusedMeals,
            sleepDetails: reusedSleep,
            reusedFromYesterday: true,
        });

        if (!loggedMeals.length && reusedMeals.length) {
            setLoggedMeals(reusedMeals);
            const calories = reusedMeals.reduce((sum, meal) => sum + (meal.cal || 0), 0);
            const nextMacros = reusedMeals.reduce((sum, meal) => ({
                protein: sum.protein + (meal.prot || 0),
                carbs: sum.carbs + (meal.carbs || 0),
                fat: sum.fat + (meal.fat || 0),
            }), { protein: 0, carbs: 0, fat: 0 });
            setConsumedCalories(calories);
            setMacros(nextMacros);
            updateDailyRecord({ consumedCalories: calories, macros: nextMacros });
        }
        return true;
    }, [dailyRecords, loggedMeals.length, todayRecord.meals, todayRecord.sleepDetails, updateDailyRecord]);

    const completeOnboarding = useCallback((fullName, email, phone, selectedGoals, extras = {}) => {
        const initialPlanMode = extras.initialPlanMode || (() => {
            const minutes = Number.parseInt(extras.availableTime, 10) || 15;
            if (minutes <= 5 || extras.sleepQuality === 'Kurang') return 'minimum';
            if (minutes >= 30 && (extras.healthConditions || []).includes('Tidak ada')) return 'full';
            return 'short';
        })();
        const profile = {
            fullName,
            email,
            phone,
            goals: selectedGoals,
            healthConditions: extras.healthConditions || [],
            allergies: extras.allergies || [],
            ...extras
        };
        setUserProfile(prev => ({ ...prev, ...profile }));
        setHasOnboarded(true);
        setDailyRecords(prev => {
            const dateKey = getDateKey();
            const current = prev[dateKey] || {};
            const updated = {
                ...prev,
                [dateKey]: {
                    ...current,
                    planMode: initialPlanMode,
                    onboardingSummary: {
                        primaryGoal: extras.primaryGoal || selectedGoals[0] || '',
                        focus: extras.onboardingFocusLabel || extras.focus || '',
                        availableTime: extras.availableTime || '15',
                    },
                    planGeneratedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            };
            localStorage.setItem('dailyRecords', JSON.stringify(updated));
            return updated;
        });
        localStorage.setItem('hasOnboarded', 'true');
        localStorage.setItem('activeTab', 'plan');
        localStorage.setItem('userProfile', JSON.stringify(profile));
    }, []);

    const updateProfile = useCallback((updates) => {
        setUserProfile(prev => {
            const updated = { ...prev, ...updates };
            localStorage.setItem('userProfile', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const updateGoals = useCallback((newGoals) => {
        setUserProfile(prev => {
            const updated = { ...prev, goals: newGoals };
            localStorage.setItem('userProfile', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const addLoggedMeal = useCallback((meal) => {
        const loggedMeal = {
            id: meal.id || `${Date.now()}-meal`,
            addedAt: meal.addedAt || new Date().toISOString(),
            source: meal.source || 'diary',
            ...meal,
        };
        const nextMeals = [loggedMeal, ...loggedMeals];
        const nextCalories = consumedCalories + (meal.cal || 0);
        const nextMacros = {
            protein: macros.protein + (meal.prot || 0),
            carbs: macros.carbs + (meal.carbs || 0),
            fat: macros.fat + (meal.fat || 0)
        };
        setLoggedMeals(nextMeals);
        setConsumedCalories(nextCalories);
        setMacros(nextMacros);
        updateDailyRecord({
            meals: nextMeals,
            consumedCalories: nextCalories,
            macros: nextMacros,
        });
    }, [consumedCalories, loggedMeals, macros, updateDailyRecord]);

    const removeLoggedMeal = useCallback((mealId) => {
        const nextMeals = loggedMeals.filter((meal, index) => (
            meal.id ? meal.id !== mealId : index !== mealId
        ));
        const nextCalories = nextMeals.reduce((sum, meal) => sum + (meal.cal || 0), 0);
        const nextMacros = nextMeals.reduce((sum, meal) => ({
            protein: sum.protein + (meal.prot || 0),
            carbs: sum.carbs + (meal.carbs || 0),
            fat: sum.fat + (meal.fat || 0),
        }), { protein: 0, carbs: 0, fat: 0 });

        setLoggedMeals(nextMeals);
        setConsumedCalories(nextCalories);
        setMacros(nextMacros);
        updateDailyRecord({
            meals: nextMeals,
            consumedCalories: nextCalories,
            macros: nextMacros,
        });
    }, [loggedMeals, updateDailyRecord]);

    const getActiveFeatures = useCallback(() => {
        const featuresSet = new Set();
        userProfile.goals.forEach(goalId => {
            const goal = AVAILABLE_GOALS.find(g => g.id === goalId);
            if (goal) goal.features.forEach(f => featuresSet.add(f));
        });
        return Array.from(featuresSet);
    }, [userProfile.goals]);

    const getGoalLabel = useCallback((goalId) => {
        const goal = AVAILABLE_GOALS.find(g => g.id === goalId);
        return goal ? goal.label : goalId;
    }, []);

    const isFeatureActive = useCallback((featureId) => {
        return getActiveFeatures().includes(featureId);
    }, [getActiveFeatures]);

    const value = useMemo(
        () => ({
            userProfile,
            hasOnboarded,
            consumedCalories,
            macros,
            loggedMeals,
            dailyRecords,
            todayRecord,
            careAppointments,
            healthExperiment,
            completeOnboarding,
            updateProfile,
            updateGoals,
            addLoggedMeal,
            removeLoggedMeal,
            updateDailyRecord,
            setDailyCheckIn,
            toggleDailyAction,
            incrementWater,
            addDailyLog,
            bookAppointment,
            repeatOnboarding,
            resetAllData,
            loadDemoData,
            startHealthExperiment,
            toggleExperimentToday,
            reuseYesterdayEntries,
            getActiveFeatures,
            getGoalLabel,
            isFeatureActive,
            AVAILABLE_GOALS,
        }),
        [userProfile, hasOnboarded, consumedCalories, macros, loggedMeals, dailyRecords, todayRecord, careAppointments, healthExperiment, completeOnboarding, updateProfile, updateGoals, addLoggedMeal, removeLoggedMeal, updateDailyRecord, setDailyCheckIn, toggleDailyAction, incrementWater, addDailyLog, bookAppointment, repeatOnboarding, resetAllData, loadDemoData, startHealthExperiment, toggleExperimentToday, reuseYesterdayEntries, getActiveFeatures, getGoalLabel, isFeatureActive]
    );

    return (
        <HealthContext.Provider value={value}>
            {children}
        </HealthContext.Provider>
    );
}

