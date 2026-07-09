import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const HealthContext = createContext();

const AVAILABLE_GOALS = [
    { id: 'lose-weight',         label: 'Turunkan Berat Badan', features: ['weight-tracking', 'meal-planner', 'fitness-routine'] },
    { id: 'build-muscle',        label: 'Build Muscle',          features: ['fitness-routine', 'meal-planner', 'weight-tracking'] },
    { id: 'heart-health',        label: 'Kesehatan Jantung',     features: ['fitness-routine', 'health-monitor', 'blood-pressure-tracking'] },
    { id: 'sleep-quality',       label: 'Perbaiki Kualitas Tidur', features: ['sleep-tracker', 'meditation', 'mood-tracker'] },
    { id: 'reduce-stress',       label: 'Kurangi Stres',         features: ['meditation', 'mood-tracker', 'sleep-tracker'] },
    { id: 'pregnancy',           label: 'Kehamilan',             features: ['health-monitor', 'nutrition-guide', 'mood-tracker'] },
    { id: 'diabetes-management', label: 'Manajemen Diabetes',    features: ['blood-sugar-tracking', 'meal-planner', 'health-monitor'] },
    { id: 'nutrition',           label: 'Nutrisi Seimbang',      features: ['meal-planner', 'nutrition-guide', 'weight-tracking'] },
];

export function HealthProvider({ children }) {
    const [userProfile, setUserProfile] = useState({
        fullName: '',
        nik: '',
        goals: [],
        healthConditions: [],
        allergies: [],
        age: null,
        gender: '',
        healthData: {},
    });

    const [hasOnboarded, setHasOnboarded] = useState(false);

    /* ── PRESERVED: original signature intact, extended with optional extras ── */
    const completeOnboarding = useCallback((fullName, nik, selectedGoals, extras = {}) => {
        const profile = {
            fullName,
            nik,
            goals: selectedGoals,
            healthConditions: extras.healthConditions || [],
            allergies: extras.allergies || [],
        };
        setUserProfile(prev => ({ ...prev, ...profile }));
        setHasOnboarded(true);
        localStorage.setItem('hasOnboarded', 'true');
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

    /* ── Memoize value object to prevent unnecessary re-renders of subscribers ── */
    const value = useMemo(
        () => ({
            userProfile,
            hasOnboarded,
            completeOnboarding,
            updateProfile,
            updateGoals,
            getActiveFeatures,
            getGoalLabel,
            isFeatureActive,
            AVAILABLE_GOALS,
        }),
        [userProfile, hasOnboarded, completeOnboarding, updateProfile, updateGoals, getActiveFeatures, getGoalLabel, isFeatureActive]
    );

    return (
        <HealthContext.Provider value={value}>
            {children}
        </HealthContext.Provider>
    );
}

export function useHealth() {
    const context = useContext(HealthContext);
    if (!context) throw new Error('useHealth must be used within HealthProvider');
    return context;
}
