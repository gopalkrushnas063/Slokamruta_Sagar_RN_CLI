import React, { JSX, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import HomeScreen from './src/screen/HomeScreen';
import OnboardingScreen from './src/screen/OnboardingScreen';

const App = (): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {showOnboarding ? (
        <OnboardingScreen onFinish={() => setShowOnboarding(false)} />
      ) : (
        <HomeScreen />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
