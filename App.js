import React from 'react';
import { registerRootComponent } from 'expo';
import { AuthProvider } from './hooks/useAuth';
import AppNavigator from './navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
