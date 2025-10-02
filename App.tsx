import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ShoppingList from './src/components/ShoppingList';
import Settings from './src/components/Settings';
import { ThemeProvider, ThemeContext } from './src/ThemeContext';
import './src/i18n';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import React, { useContext } from 'react';

const Tab = createBottomTabNavigator();

const AppContent = () => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = useColorScheme() === 'dark';

  const paperTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.primary,
      background: theme.background,
      text: theme.text,
    },
  };

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: { backgroundColor: theme.background },
            headerStyle: { backgroundColor: theme.background },
            headerTitleStyle: { color: theme.text },
            tabBarActiveTintColor: theme.primary,
            tabBarInactiveTintColor: theme.text,
          }}>
          <Tab.Screen name="Shopping List" component={ShoppingList} />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
