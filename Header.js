import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>🎨 Color Match</Text>
      <Text style={styles.tagline}>Find Perfect Color Pairings</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#6366f1',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
});

export default Header;
