import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { analyzeCropDisease, DiseaseAnalysisResponse } from '@/services/aiService';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Using DiseaseAnalysisResponse from aiService


export default function AgriDoctorPage() {
  const colorScheme = useColorScheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DiseaseAnalysisResponse | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        setCapturedImage(photo.uri);
        setShowCamera(false);
        await analyzeImage(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        await analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const analyzeImage = async (imageUri: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeCropDisease({ imageUri });
      setAnalysisResult(result);
      setShowResult(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const resetAnalysis = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setShowResult(false);
    setIsAnalyzing(false);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <ThemedView style={styles.permissionContainer}>
          <IconSymbol name="camera.fill" size={80} color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText type="title" style={styles.permissionTitle}>Camera Permission Required</ThemedText>
          <ThemedText style={styles.permissionText}>
            Agri Doctor needs camera access to scan crop leaves for disease detection.
          </ThemedText>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={() => setShowCamera(false)}
              >
                <IconSymbol name="xmark" size={24} color="white" />
              </TouchableOpacity>
              <ThemedText style={styles.cameraTitle}>Scan Crop Leaf</ThemedText>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={toggleCameraFacing}
              >
                <IconSymbol name="arrow.triangle.2.circlepath.camera" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.cameraFrame}>
              <View style={styles.frameOverlay} />
            </View>
            
            <View style={styles.cameraFooter}>
              <TouchableOpacity
                style={styles.galleryButton}
                onPress={pickImageFromGallery}
              >
                <IconSymbol name="photo.on.rectangle" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              
              <View style={styles.placeholder} />
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Agri Doctor</ThemedText>
        <ThemedText style={styles.subtitle}>AI-powered crop disease detection and treatment</ThemedText>
      </ThemedView>

      {isAnalyzing ? (
        <View style={styles.analyzingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText style={styles.analyzingText}>Analyzing crop image...</ThemedText>
          <ThemedText style={styles.analyzingSubtext}>Detecting diseases and preparing treatment recommendations</ThemedText>
        </View>
      ) : !capturedImage ? (
        <View style={styles.initialContainer}>
          <View style={styles.iconContainer}>
            <IconSymbol name="camera.viewfinder" size={120} color={Colors[colorScheme ?? 'light'].tint} />
          </View>
          
          <ThemedText style={styles.instructionTitle}>How to Use Agri Doctor</ThemedText>
          <ThemedText style={styles.instructionText}>
            1. Take a clear photo of the affected crop leaf{'\n'}
            2. Ensure good lighting and focus{'\n'}
            3. Include the entire affected area{'\n'}
            4. Our AI will analyze and provide treatment recommendations
          </ThemedText>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={() => setShowCamera(true)}
            >
              <IconSymbol name="camera.fill" size={24} color="white" />
              <Text style={styles.primaryButtonText}>Scan Crop Leaf</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={pickImageFromGallery}
            >
              <IconSymbol name="photo.on.rectangle" size={24} color={Colors[colorScheme ?? 'light'].tint} />
              <ThemedText style={[styles.secondaryButtonText, { color: Colors[colorScheme ?? 'light'].tint }]}>
                Choose from Gallery
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={resetAnalysis}
            >
              <IconSymbol name="arrow.clockwise" size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          {analysisResult && (
            <TouchableOpacity
              style={[styles.resultButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={() => setShowResult(true)}
            >
              <Text style={styles.resultButtonText}>View Analysis Results</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Analysis Result Modal */}
      <Modal
        visible={showResult}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowResult(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {analysisResult && (
                <>
                  <View style={styles.modalHeader}>
                    <ThemedText type="subtitle" style={styles.modalTitle}>
                      Disease Analysis Result
                    </ThemedText>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setShowResult(false)}
                    >
                      <IconSymbol name="xmark" size={24} color={Colors[colorScheme ?? 'light'].text} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.diseaseInfo}>
                    <View style={styles.diseaseHeader}>
                      <ThemedText style={styles.diseaseName}>{analysisResult.diseaseName}</ThemedText>
                      <View style={[styles.confidenceBadge, { 
                        backgroundColor: analysisResult.confidence > 80 ? '#4CAF50' : 
                                        analysisResult.confidence > 60 ? '#FF9800' : '#F44336' 
                      }]}>
                        <Text style={styles.confidenceText}>{analysisResult.confidence}% Confidence</Text>
                      </View>
                    </View>
                    
                    <View style={[styles.severityBadge, { 
                      backgroundColor: analysisResult.severity === 'High' ? '#F44336' : 
                                      analysisResult.severity === 'Medium' ? '#FF9800' : '#4CAF50' 
                    }]}>
                      <Text style={styles.severityText}>
                        {analysisResult.severity} Severity
                      </Text>
                    </View>
                  </View>

                  <ThemedText style={styles.sectionTitle}>Description</ThemedText>
                  <ThemedText style={styles.description}>{analysisResult.description}</ThemedText>

                  <ThemedText style={styles.sectionTitle}>Symptoms</ThemedText>
                  {analysisResult.symptoms.map((symptom, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <ThemedText style={styles.listText}>{symptom}</ThemedText>
                    </View>
                  ))}

                  <ThemedText style={styles.sectionTitle}>Affected Crops</ThemedText>
                  <View style={styles.cropsContainer}>
                    {analysisResult.affectedCrops.map((crop, index) => (
                      <View key={index} style={[styles.cropTag, { backgroundColor: Colors[colorScheme ?? 'light'].tint + '20' }]}>
                        <ThemedText style={[styles.cropText, { color: Colors[colorScheme ?? 'light'].tint }]}>
                          {crop}
                        </ThemedText>
                      </View>
                    ))}
                  </View>

                  <ThemedText style={styles.sectionTitle}>Organic Treatments</ThemedText>
                  {analysisResult.treatments.organic.map((treatment, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.bulletPoint}>🌱</Text>
                      <ThemedText style={styles.listText}>{treatment}</ThemedText>
                    </View>
                  ))}

                  <ThemedText style={styles.sectionTitle}>Chemical Treatments</ThemedText>
                  {analysisResult.treatments.chemical.map((treatment, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.bulletPoint}>🧪</Text>
                      <ThemedText style={styles.listText}>{treatment}</ThemedText>
                    </View>
                  ))}

                  <ThemedText style={styles.sectionTitle}>Prevention Measures</ThemedText>
                  {analysisResult.treatments.preventive.map((prevention, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.bulletPoint}>🛡️</Text>
                      <ThemedText style={styles.listText}>{prevention}</ThemedText>
                    </View>
                  ))}

                  {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                    <>
                      <ThemedText style={styles.sectionTitle}>Recommendations</ThemedText>
                      {analysisResult.recommendations.map((recommendation, index) => (
                        <View key={index} style={styles.listItem}>
                          <Text style={styles.bulletPoint}>💡</Text>
                          <ThemedText style={styles.listText}>{recommendation}</ThemedText>
                        </View>
                      ))}
                    </>
                  )}

                  {analysisResult.alternativeDiagnoses && analysisResult.alternativeDiagnoses.length > 0 && (
                    <>
                      <ThemedText style={styles.sectionTitle}>Alternative Diagnoses</ThemedText>
                      {analysisResult.alternativeDiagnoses.map((alt, index) => (
                        <View key={index} style={styles.listItem}>
                          <Text style={styles.bulletPoint}>🔍</Text>
                          <ThemedText style={styles.listText}>
                            {alt.diseaseName} ({alt.confidence}% confidence)
                          </ThemedText>
                        </View>
                      ))}
                    </>
                  )}

                  <View style={styles.urgencyContainer}>
                    <ThemedText style={styles.sectionTitle}>Urgency Level</ThemedText>
                    <View style={[styles.urgencyBadge, { 
                      backgroundColor: analysisResult.urgency === 'High' ? '#F44336' : 
                                      analysisResult.urgency === 'Medium' ? '#FF9800' : '#4CAF50' 
                    }]}>
                      <Text style={styles.urgencyText}>
                        {analysisResult.urgency} Priority
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
  },
  permissionButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  cameraButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  cameraFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameOverlay: {
    width: width * 0.8,
    height: width * 0.8,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  cameraFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
  },
  placeholder: {
    width: 50,
  },
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  analyzingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  analyzingSubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  initialContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  instructionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.7,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    gap: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 2,
    gap: 10,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  capturedImage: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  retakeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  resultButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    borderRadius: 15,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diseaseInfo: {
    marginBottom: 20,
  },
  diseaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  diseaseName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  confidenceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  confidenceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  severityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  cropsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  cropTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  cropText: {
    fontSize: 12,
    fontWeight: '600',
  },
  urgencyContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  urgencyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 5,
  },
  urgencyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
