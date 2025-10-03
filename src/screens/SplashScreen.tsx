/**
 * Splash Screen
 * Entry point with animation
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SplashAnimation } from '../animations/splash/SplashAnimation';
import { database, initializeDefaultCategories } from '../database';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Initialize database and default data
    const initialize = async () => {
      try {
        await initializeDefaultCategories();
        setIsInitialized(true);
      } catch (error) {
        console.error('Initialization error:', error);
        setIsInitialized(true); // Continue anyway
      }
    };

    initialize();
  }, []);

  // Call onComplete when both initialization and animation are done
  useEffect(() => {
    if (isInitialized && animationComplete) {
      onComplete();
    }
  }, [isInitialized, animationComplete, onComplete]);

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
  };

  return (
    <View style={styles.container}>
      <SplashAnimation onComplete={handleAnimationComplete} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
