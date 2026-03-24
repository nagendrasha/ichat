import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>iChat</Text>
        <Text style={styles.tagline}>chat with old style</Text>
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 40,
    borderWidth: 10,
    borderColor: '#000',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 4,
    marginBottom: 10,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: '#333',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  },
});
