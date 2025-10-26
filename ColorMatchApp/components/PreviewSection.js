import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PreviewSection = ({
  imageUri,
  dominantColors,
  onAnalyze,
  onBack,
  isAnalyzing,
}) => {
  return (
    <View style={styles.container}>
      {/* Image Preview */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Dominant Colors */}
      {dominantColors.length > 0 && (
        <View style={styles.colorsContainer}>
          <Text style={styles.colorsTitle}>Dominant Colors</Text>
          <View style={styles.colorChips}>
            {dominantColors.map((color, index) => (
              <View
                key={index}
                style={[
                  styles.colorChip,
                  { backgroundColor: color.hex },
                ]}
              />
            ))}
          </View>
        </View>
      )}

      {/* Analyze Button */}
      <TouchableOpacity
        style={[
          styles.analyzeButton,
          isAnalyzing && styles.analyzeButtonDisabled,
        ]}
        onPress={onAnalyze}
        disabled={isAnalyzing || dominantColors.length === 0}
        activeOpacity={0.8}
      >
        {isAnalyzing ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.analyzeButtonText}>Find Matching Colors</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 400,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorsContainer: {
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
  colorsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  colorChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorChip: {
    width: 60,
    height: 60,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  analyzeButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  analyzeButtonDisabled: {
    opacity: 0.6,
  },
  analyzeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PreviewSection;
