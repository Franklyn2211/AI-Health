import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const HealthContext = createContext();

const AVAILABLE_GOALS = [
    { id: 'body-goals',          label: 'Body Goals', features: ['weight-tracking', 'meal-planner', 'fitness-routine'] },
    { id: 'sleep',               label: 'Perbaiki Kualitas Tidur', features: ['sleep-tracker', 'meditation'] },
    { id: 'stress',              label: 'Kurangi Stres', features: ['meditation'] },
    { id: 'pregnancy',           label: 'Kehamilan', features: ['nutrition-guide'] },
    { id: 'heart',               label: 'Kesehatan Jantung', features: ['health-monitor'] },
    { id: 'diabetes',            label: 'Manajemen Diabetes', features: ['blood-sugar-tracking', 'meal-planner'] },
];

export function HealthProvider({ children }) {
    const [userProfile, setUserProfile] = useState({
        fullName: '',
        contact: '',
        goals: [],
        healthConditions: [],
        allergies: [],
        age: null,
        gender: '',
        currentWeight: '',
        targetWeight: '',
        height: '',
        equipment: '',
        diet: ''
    });

    const [hasOnboarded, setHasOnboarded] = useState(false);
    const [consumedCalories, setConsumedCalories] = useState(0);

    const completeOnboarding = useCallback((fullName, contact, selectedGoals, extras = {}) => {
        const profile = {
            fullName,
            contact,
            goals: selectedGoals,
            healthConditions: extras.healthConditions || [],
            allergies: extras.allergies || [],
            ...extras
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

    const addConsumedCalories = useCallback((cals) => {
        setConsumedCalories(prev => prev + cals);
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

    const value = useMemo(
        () => ({
            userProfile,
            hasOnboarded,
            consumedCalories,
            completeOnboarding,
            updateProfile,
            updateGoals,
            addConsumedCalories,
            getActiveFeatures,
            getGoalLabel,
            isFeatureActive,
            AVAILABLE_GOALS,
        }),
        [userProfile, hasOnboarded, consumedCalories, completeOnboarding, updateProfile, updateGoals, addConsumedCalories, getActiveFeatures, getGoalLabel, isFeatureActive]
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
