import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

// Screens (I'll create these next)
import LoginScreen from '../screens/LoginScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    if (user) {
      setProfileLoading(true);
      unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
        if (docSnap.exists() && docSnap.data().name) {
          setIsProfileComplete(true);
        } else {
          setIsProfileComplete(false);
        }
        setProfileLoading(false);
      });
    } else {
      setIsProfileComplete(false);
      setProfileLoading(false);
    }
    return () => unsubscribe && unsubscribe();
  }, [user]);

  if (loading || (user && profileLoading)) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#f0f0f0' }, headerTitleStyle: { color: '#000' } }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : !isProfileComplete ? (
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} options={{ title: 'Profile Setup' }} />
        ) : (
          <>
            <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Messages' }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={({ route }) => ({ title: route.params.name })} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
