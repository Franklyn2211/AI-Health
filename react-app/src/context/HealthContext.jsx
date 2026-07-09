import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const HealthContext = createContext();

const AVAILABLE_GOALS = [
    { id: 'body-goals',          label: 'Body Goals', features: ['weight-tracking', 'meal-planner', 'fitness-routine'] },
    { id: 'mental-health',       label: 'Mental Health', features: ['sleep-tracker', 'meditation'] },
    { id: 'immune-booster',      label: 'Immune Booster', features: ['health-monitor', 'nutrition-guide'] }
];

export function HealthProvider({ children }) {
    const [userProfile, setUserProfile] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
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
    
    // Nutrition state
    const [consumedCalories, setConsumedCalories] = useState(0);
    const [macros, setMacros] = useState({ protein: 0, carbs: 0, fat: 0 });
    const [loggedMeals, setLoggedMeals] = useState([]);

    const completeOnboarding = useCallback((fullName, email, phone, selectedGoals, extras = {}) => {
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

    const addLoggedMeal = useCallback((meal) => {
        setLoggedMeals(prev => [meal, ...prev]);
        setConsumedCalories(prev => prev + (meal.cal || 0));
        setMacros(prev => ({
            protein: prev.protein + (meal.prot || 0),
            carbs: prev.carbs + (meal.carbs || 0),
            fat: prev.fat + (meal.fat || 0)
        }));
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
            macros,
            loggedMeals,
            completeOnboarding,
            updateProfile,
            updateGoals,
            addLoggedMeal,
            getActiveFeatures,
            getGoalLabel,
            isFeatureActive,
            AVAILABLE_GOALS,
        }),
        [userProfile, hasOnboarded, consumedCalories, macros, loggedMeals, completeOnboarding, updateProfile, updateGoals, addLoggedMeal, getActiveFeatures, getGoalLabel, isFeatureActive]
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
