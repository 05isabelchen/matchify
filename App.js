import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';

// Import components
import Header from './ColorMatchApp/components/Header';
import UploadSection from './ColorMatchApp/components/UploadSection';
import PreviewSection from './ColorMatchApp/components/PreviewSection';
import ResultsSection from './ColorMatchApp/components/ResultsSection';

// Import utilities
import { extractDominantColors } from './utils/colorExtractor';
import { generateMatchingColors } from './utils/colorMatcher';

export default function App() {
  // State management
  const [currentView, setCurrentView] = useState('upload'); // 'upload', 'preview', 'results'
  const [selectedImage, setSelectedImage] = useState(null);
  const [dominantColors, setDominantColors] = useState([]);
  const [matchingColors, setMatchingColors] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Request camera permissions
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Please grant camera and photo library permissions to use this app.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  // Take photo with camera
  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setCurrentView('preview');
      // Extract colors after a short delay to ensure image is loaded
      setTimeout(() => {
        handleExtractColors(result.assets[0].uri);
      }, 100);
    }
  };

  // Pick photo from gallery
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setCurrentView('preview');
      // Extract colors after a short delay to ensure image is loaded
      setTimeout(() => {
        handleExtractColors(result.assets[0].uri);
      }, 100);
    }
  };

  // Show image source options
  const showImageSourceOptions = () => {
    Alert.alert(
      'Choose Image Source',
      'Select how you want to add your clothing photo',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: pickImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  // Extract dominant colors from image
  const handleExtractColors = async (imageUri) => {
    try {
      const colors = await extractDominantColors(imageUri);
      setDominantColors(colors);
    } catch (error) {
      console.error('Error extracting colors:', error);
      Alert.alert('Error', 'Failed to extract colors from image');
    }
  };

  // Analyze colors and find matches
  const analyzeColors = async () => {
    if (dominantColors.length === 0) {
      Alert.alert('Error', 'No colors extracted from image');
      return;
    }

    setIsAnalyzing(true);

    // Simulate processing time for better UX
    setTimeout(() => {
      const matches = generateMatchingColors(dominantColors[0]);
      setMatchingColors(matches);
      setIsAnalyzing(false);
      setCurrentView('results');
    }, 1500);
  };

  // Reset app to initial state
  const resetApp = () => {
    setCurrentView('upload');
    setSelectedImage(null);
    setDominantColors([]);
    setMatchingColors(null);
    setIsAnalyzing(false);
  };

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'upload':
        return <UploadSection onUpload={showImageSourceOptions} />;
      
      case 'preview':
        return (
          <PreviewSection
            imageUri={selectedImage}
            dominantColors={dominantColors}
            onAnalyze={analyzeColors}
            onBack={resetApp}
            isAnalyzing={isAnalyzing}
          />
        );
      
      case 'results':
        return (
          <ResultsSection
            matchingColors={matchingColors}
            onNewSearch={resetApp}
          />
        );
      
      default:
        return <UploadSection onUpload={showImageSourceOptions} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#6366f1" />
      
      <Header />
      
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderView()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
});
