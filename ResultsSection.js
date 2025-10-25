import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ColorCard from './ColorCard';

const ResultsSection = ({ matchingColors, onNewSearch }) => {
  if (!matchingColors) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>✨ Matching Colors</Text>

      {/* Complementary Colors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Complementary Colors</Text>
        <Text style={styles.sectionDescription}>
          Colors opposite on the color wheel - creates vibrant contrast
        </Text>
        <View style={styles.colorGrid}>
          {matchingColors.complementary.map((color, index) => (
            <ColorCard key={index} color={color} />
          ))}
        </View>
      </View>

      {/* Analogous Colors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Analogous Colors</Text>
        <Text style={styles.sectionDescription}>
          Colors next to each other - creates harmony
        </Text>
        <View style={styles.colorGrid}>
          {matchingColors.analogous.map((color, index) => (
            <ColorCard key={index} color={color} />
          ))}
        </View>
      </View>

      {/* Triadic Colors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Triadic Colors</Text>
        <Text style={styles.sectionDescription}>
          Three evenly spaced colors - balanced and vibrant
        </Text>
        <View style={styles.colorGrid}>
          {matchingColors.triadic.map((color, index) => (
            <ColorCard key={index} color={color} />
          ))}
        </View>
      </View>

      {/* Neutral Colors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Neutral Pairings</Text>
        <Text style={styles.sectionDescription}>
          Classic neutrals that work with everything
        </Text>
        <View style={styles.colorGrid}>
          {matchingColors.neutral.map((color, index) => (
            <ColorCard key={index} color={color} />
          ))}
        </View>
      </View>

      {/* New Search Button */}
      <TouchableOpacity
        style={styles.newSearchButton}
        onPress={onNewSearch}
        activeOpacity={0.8}
      >
        <Text style={styles.newSearchButtonText}>Upload Another Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 32,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  newSearchButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  newSearchButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResultsSection;
