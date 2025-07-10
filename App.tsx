// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import { ThemeProvider } from './src/context/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';
import OnboardingScreen from './src/screen/OnboardingScreen';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './src/store';
import { completeOnboarding } from './src/store/slices/onboardingSlice';
import { Text, View, ActivityIndicator } from 'react-native';
import './src/i18n'; // Import i18n configuration

const AppContent = () => {
  const hasCompletedOnboarding = useSelector(
    (state: RootState) => state.onboarding.hasCompletedOnboarding
  );
  const dispatch = useDispatch();

  const handleOnboardingFinish = () => {
    dispatch(completeOnboarding());
  };

  if (!hasCompletedOnboarding) {
    return <OnboardingScreen onFinish={handleOnboardingFinish} />;
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#941b1b" />
    <Text style={{ marginTop: 10, color: '#941b1b' }}>Loading...</Text>
  </View>
);

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;