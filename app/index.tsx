// app/index.tsx
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { SplashScreen } from '../components/auth/SplashScreen';

export default function Index() {
  const router = useRouter();
  const { hasCompletedOnboarding, isAuthenticated } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
    if (!hasCompletedOnboarding) {
      router.replace('/(auth)/onboarding');
    } else if (!isAuthenticated) {
      router.replace('/(auth)/sign-in');
    } else {
      router.replace('/(tabs)');
    }
  };

  return <SplashScreen onFinish={handleSplashFinish} />;
}
