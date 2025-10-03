/**
 * ListFlow - Premium Shopping List App
 * Main App Entry Point
 */

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/onboarding/OnboardingScreen';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useSettingsStore } from './src/stores';
import './src/i18n';

type AppState = 'splash' | 'onboarding' | 'app';

function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const hasCompletedOnboarding = useSettingsStore(
    (state) => state.hasCompletedOnboarding
  );

  const handleSplashComplete = () => {
    if (hasCompletedOnboarding) {
      setAppState('app');
    } else {
      setAppState('onboarding');
    }
  };

  const handleOnboardingComplete = () => {
    setAppState('app');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {appState === 'splash' && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}

        {appState === 'onboarding' && (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        )}

        {appState === 'app' && (
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
