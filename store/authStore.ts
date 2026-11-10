// store/authStore.ts
import { create } from 'zustand';
import { RateTable, UserProfile } from '../types/models';
import { appStorage } from './storage';
import rawProfile from '../data/seed/profile.json';
import rawRates from '../data/seed/rates.json';

const PROFILE_KEY = '@stack_profile_v1';
const PIN_KEY = '@stack_pin_v1';
const ONBOARDING_KEY = '@stack_onboarding_v1';
const AUTH_KEY = '@stack_auth_v1';

function loadOnboardingStatus(): boolean {
  return appStorage.getString(ONBOARDING_KEY) === 'true';
}

function loadAuthStatus(): boolean {
  return appStorage.getString(AUTH_KEY) === 'true';
}

function loadProfile(): UserProfile {
  const stored = appStorage.getString(PROFILE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.name && parsed.name !== 'Olympicson' && parsed.name !== 'Alex Stack') {
        return parsed;
      }
    } catch {}
  }
  const p = rawProfile as any;
  const initial: UserProfile = {
    name: 'FrontendGeek',
    email: 'frontendgeek@stack.app',
    handle: '@frontendgeek',
    avatar: null,
    preferredCurrency: 'USD',
    themeMode: 'light',
    showDemoHints: true,
  };
  appStorage.set(PROFILE_KEY, JSON.stringify(initial));
  return initial;
}

interface AuthState {
  profile: UserProfile;
  rateTable: RateTable;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  pin: string;
  setAuthenticated: (val: boolean) => void;
  setOnboardingCompleted: (val: boolean) => void;
  setPin: (pin: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setThemeMode: (mode: 'system' | 'light' | 'dark') => void;
  toggleDemoHints: () => void;
  restartOnboarding: () => void;
  resetAll: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  profile: loadProfile(),
  rateTable: rawRates as RateTable,
  isAuthenticated: loadAuthStatus(),
  hasCompletedOnboarding: loadOnboardingStatus(),
  pin: appStorage.getString(PIN_KEY) || '4821',

  setAuthenticated: (isAuthenticated) => {
    appStorage.set(AUTH_KEY, String(isAuthenticated));
    set({ isAuthenticated });
  },

  setOnboardingCompleted: (hasCompletedOnboarding) => {
    appStorage.set(ONBOARDING_KEY, String(hasCompletedOnboarding));
    set({ hasCompletedOnboarding });
  },

  setPin: (pin) => {
    appStorage.set(PIN_KEY, pin);
    set({ pin });
  },

  updateProfile: (updates) => {
    const next = { ...get().profile, ...updates };
    appStorage.set(PROFILE_KEY, JSON.stringify(next));
    set({ profile: next });
  },

  setThemeMode: (themeMode) => {
    const next = { ...get().profile, themeMode };
    appStorage.set(PROFILE_KEY, JSON.stringify(next));
    set({ profile: next });
  },

  toggleDemoHints: () => {
    const nextHints = !get().profile.showDemoHints;
    get().updateProfile({ showDemoHints: nextHints });
  },

  restartOnboarding: () => {
    appStorage.delete(ONBOARDING_KEY);
    set({ hasCompletedOnboarding: false });
  },

  resetAll: () => {
    appStorage.delete(PROFILE_KEY);
    appStorage.delete(PIN_KEY);
    appStorage.delete(ONBOARDING_KEY);
    appStorage.delete(AUTH_KEY);
    set({
      profile: loadProfile(),
      pin: '4821',
      hasCompletedOnboarding: false,
      isAuthenticated: false,
    });
  },
}));

