import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import {
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

const { width } = Dimensions.get('window');

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  image: string;
  tips: string[];
}

interface DiseaseInfo {
  id: string;
  name: string;
  symptoms: string[];
  prevention: string[];
  treatment: string[];
  image: string;
  affectedCrops: string[];
}

interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
}

const agriculturalProcesses: ProcessStep[] = [
  {
    id: '1',
    title: 'Soil Preparation',
    description: 'The foundation of successful farming starts with proper soil preparation.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    tips: [
      'Test soil pH and nutrient levels',
      'Remove weeds and debris',
      'Add organic matter (compost, manure)',
      'Ensure proper drainage',
      'Plow or till to aerate soil'
    ]
  },
  {
    id: '2',
    title: 'Seed Selection & Planting',
    description: 'Choose quality seeds and plant them at the right time and depth.',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
    tips: [
      'Select disease-resistant varieties',
      'Check seed germination rate',
      'Plant at optimal depth (2-3x seed size)',
      'Maintain proper spacing',
      'Water immediately after planting'
    ]
  },
  {
    id: '3',
    title: 'Irrigation Management',
    description: 'Proper watering is crucial for healthy crop growth and yield.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    tips: [
      'Water early morning or evening',
      'Use drip irrigation for efficiency',
      'Monitor soil moisture levels',
      'Avoid overwatering',
      'Adjust based on weather conditions'
    ]
  },
  {
    id: '4',
    title: 'Fertilization',
    description: 'Provide essential nutrients for optimal plant growth and productivity.',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
    tips: [
      'Test soil before fertilizing',
      'Use balanced NPK fertilizers',
      'Apply at right growth stages',
      'Consider organic alternatives',
      'Avoid over-fertilization'
    ]
  },
  {
    id: '5',
    title: 'Pest & Disease Control',
    description: 'Protect crops from harmful pests and diseases using integrated approaches.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    tips: [
      'Monitor crops regularly',
      'Use biological controls first',
      'Apply pesticides as last resort',
      'Rotate crops to break pest cycles',
      'Maintain field hygiene'
    ]
  },
  {
    id: '6',
    title: 'Harvesting',
    description: 'Harvest crops at the right time for maximum quality and yield.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    tips: [
      'Harvest at optimal maturity',
      'Use proper harvesting tools',
      'Handle crops gently',
      'Store immediately after harvest',
      'Clean and grade produce'
    ]
  }
];

const cropDiseases: DiseaseInfo[] = [
  {
    id: '1',
    name: 'Bacterial Blight',
    symptoms: ['Water-soaked lesions on leaves', 'Yellowing and wilting', 'Brown spots on stems'],
    prevention: ['Use disease-free seeds', 'Practice crop rotation', 'Avoid overhead irrigation', 'Maintain field hygiene'],
    treatment: ['Apply copper-based fungicides', 'Remove infected plants', 'Improve air circulation'],
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    affectedCrops: ['Rice', 'Cotton', 'Tomato', 'Pepper']
  },
  {
    id: '2',
    name: 'Powdery Mildew',
    symptoms: ['White powdery coating on leaves', 'Stunted growth', 'Leaf curling and distortion'],
    prevention: ['Plant resistant varieties', 'Ensure good air circulation', 'Avoid overcrowding', 'Water at soil level'],
    treatment: ['Apply sulfur-based fungicides', 'Remove infected plant parts', 'Improve ventilation'],
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    affectedCrops: ['Wheat', 'Cucumber', 'Squash', 'Grape']
  },
  {
    id: '3',
    name: 'Root Rot',
    symptoms: ['Yellowing leaves', 'Wilting despite adequate water', 'Dark, mushy roots'],
    prevention: ['Improve soil drainage', 'Avoid overwatering', 'Use well-draining soil', 'Practice crop rotation'],
    treatment: ['Apply fungicides to soil', 'Improve drainage', 'Remove infected plants'],
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    affectedCrops: ['Tomato', 'Pepper', 'Bean', 'Corn']
  },
  {
    id: '4',
    name: 'Leaf Spot',
    symptoms: ['Circular brown spots on leaves', 'Yellow halos around spots', 'Premature leaf drop'],
    prevention: ['Water at soil level', 'Remove plant debris', 'Ensure good air circulation', 'Use resistant varieties'],
    treatment: ['Apply fungicides', 'Remove infected leaves', 'Improve plant spacing'],
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    affectedCrops: ['Tomato', 'Pepper', 'Lettuce', 'Spinach']
  }
];

const farmingBenefits: Benefit[] = [
  {
    id: '1',
    title: 'Increased Yield',
    description: 'Proper farming practices lead to higher crop production.',
    icon: 'chart.line.uptrend.xyaxis',
    details: [
      'Better soil health increases productivity',
      'Proper irrigation maximizes water efficiency',
      'Timely pest control prevents yield loss',
      'Quality seeds ensure better germination',
      'Optimal fertilization boosts growth'
    ]
  },
  {
    id: '2',
    title: 'Cost Reduction',
    description: 'Efficient farming methods reduce operational costs.',
    icon: 'indianrupeesign.circle',
    details: [
      'Integrated pest management reduces pesticide costs',
      'Water-efficient irrigation saves on water bills',
      'Proper soil preparation reduces fertilizer needs',
      'Crop rotation minimizes disease treatment costs',
      'Organic methods reduce chemical inputs'
    ]
  },
  {
    id: '3',
    title: 'Environmental Protection',
    description: 'Sustainable farming practices protect the environment.',
    icon: 'leaf.fill',
    details: [
      'Reduced chemical use protects soil and water',
      'Crop rotation maintains soil fertility',
      'Organic farming promotes biodiversity',
      'Water conservation protects water resources',
      'Carbon sequestration helps climate change'
    ]
  },
  {
    id: '4',
    title: 'Food Safety',
    description: 'Proper farming ensures safe, healthy food production.',
    icon: 'checkmark.shield.fill',
    details: [
      'Reduced pesticide residues in food',
      'Better hygiene practices prevent contamination',
      'Proper storage maintains food quality',
      'Organic methods produce chemical-free food',
      'Traceability ensures food safety standards'
    ]
  },
  {
    id: '5',
    title: 'Long-term Sustainability',
    description: 'Sustainable practices ensure farming for future generations.',
    icon: 'infinity.circle.fill',
    details: [
      'Soil conservation maintains land productivity',
      'Water management ensures future availability',
      'Biodiversity preservation supports ecosystem health',
      'Knowledge transfer to next generation',
      'Economic stability for farming communities'
    ]
  }
];

export default function ExplorePage() {
  const colorScheme = useColorScheme();
  const [selectedTab, setSelectedTab] = useState<'processes' | 'diseases' | 'benefits'>('processes');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleItemPress = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderProcessCard = (process: ProcessStep) => (
    <TouchableOpacity
      key={process.id}
      style={[styles.card, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      onPress={() => handleItemPress(process)}
    >
      <Image source={{ uri: process.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <ThemedText style={styles.cardTitle}>{process.title}</ThemedText>
        <ThemedText style={styles.cardDescription} numberOfLines={2}>
          {process.description}
        </ThemedText>
        <View style={styles.tipsPreview}>
          <ThemedText style={styles.tipsText}>
            💡 {process.tips.length} tips available
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDiseaseCard = (disease: DiseaseInfo) => (
    <TouchableOpacity
      key={disease.id}
      style={[styles.card, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      onPress={() => handleItemPress(disease)}
    >
      <Image source={{ uri: disease.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <ThemedText style={styles.cardTitle}>{disease.name}</ThemedText>
        <ThemedText style={styles.cardDescription} numberOfLines={2}>
          Affects: {disease.affectedCrops.join(', ')}
        </ThemedText>
        <View style={styles.diseaseInfo}>
          <ThemedText style={styles.diseaseText}>
            🚨 {disease.symptoms.length} symptoms
          </ThemedText>
          <ThemedText style={styles.diseaseText}>
            🛡️ {disease.prevention.length} prevention methods
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderBenefitCard = (benefit: Benefit) => (
    <TouchableOpacity
      key={benefit.id}
      style={[styles.card, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      onPress={() => handleItemPress(benefit)}
    >
      <View style={styles.benefitIcon}>
        <IconSymbol name={benefit.icon as any} size={40} color={Colors[colorScheme ?? 'light'].tint} />
      </View>
      <View style={styles.cardContent}>
        <ThemedText style={styles.cardTitle}>{benefit.title}</ThemedText>
        <ThemedText style={styles.cardDescription} numberOfLines={2}>
          {benefit.description}
        </ThemedText>
        <View style={styles.benefitPreview}>
          <ThemedText style={styles.benefitText}>
            ✅ {benefit.details.length} key benefits
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderModalContent = () => {
    if (!selectedItem) return null;

    if (selectedTab === 'processes') {
      const process = selectedItem as ProcessStep;
      return (
        <View>
          <ThemedText type="subtitle" style={styles.modalTitle}>{process.title}</ThemedText>
          <ThemedText style={styles.modalDescription}>{process.description}</ThemedText>
          <ThemedText style={styles.sectionTitle}>Key Tips:</ThemedText>
          {process.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.tipNumber}>{index + 1}</Text>
              <ThemedText style={styles.tipText}>{tip}</ThemedText>
            </View>
          ))}
        </View>
      );
    }

    if (selectedTab === 'diseases') {
      const disease = selectedItem as DiseaseInfo;
      return (
        <View>
          <ThemedText type="subtitle" style={styles.modalTitle}>{disease.name}</ThemedText>
          <ThemedText style={styles.modalDescription}>
            Affects: {disease.affectedCrops.join(', ')}
          </ThemedText>
          
          <ThemedText style={styles.sectionTitle}>Symptoms:</ThemedText>
          {disease.symptoms.map((symptom, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <ThemedText style={styles.listText}>{symptom}</ThemedText>
            </View>
          ))}

          <ThemedText style={styles.sectionTitle}>Prevention:</ThemedText>
          {disease.prevention.map((prevention, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <ThemedText style={styles.listText}>{prevention}</ThemedText>
            </View>
          ))}

          <ThemedText style={styles.sectionTitle}>Treatment:</ThemedText>
          {disease.treatment.map((treatment, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <ThemedText style={styles.listText}>{treatment}</ThemedText>
            </View>
          ))}
        </View>
      );
    }

    if (selectedTab === 'benefits') {
      const benefit = selectedItem as Benefit;
      return (
        <View>
          <View style={styles.benefitModalHeader}>
            <IconSymbol name={benefit.icon as any} size={30} color={Colors[colorScheme ?? 'light'].tint} />
            <ThemedText type="subtitle" style={styles.modalTitle}>{benefit.title}</ThemedText>
          </View>
          <ThemedText style={styles.modalDescription}>{benefit.description}</ThemedText>
          <ThemedText style={styles.sectionTitle}>Key Benefits:</ThemedText>
          {benefit.details.map((detail, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <ThemedText style={styles.listText}>{detail}</ThemedText>
            </View>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Agricultural Knowledge</ThemedText>
        <ThemedText style={styles.subtitle}>Learn farming processes, disease prevention, and benefits</ThemedText>
      </ThemedView>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'processes' && { backgroundColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={() => setSelectedTab('processes')}
        >
          <ThemedText style={[
            styles.tabText,
            selectedTab === 'processes' && { color: 'white' }
          ]}>
            Processes
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'diseases' && { backgroundColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={() => setSelectedTab('diseases')}
        >
          <ThemedText style={[
            styles.tabText,
            selectedTab === 'diseases' && { color: 'white' }
          ]}>
            Disease Prevention
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'benefits' && { backgroundColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={() => setSelectedTab('benefits')}
        >
          <ThemedText style={[
            styles.tabText,
            selectedTab === 'benefits' && { color: 'white' }
          ]}>
            Benefits
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'processes' && (
          <View style={styles.grid}>
            {agriculturalProcesses.map(renderProcessCard)}
          </View>
        )}
        
        {selectedTab === 'diseases' && (
          <View style={styles.grid}>
            {cropDiseases.map(renderDiseaseCard)}
          </View>
        )}
        
        {selectedTab === 'benefits' && (
          <View style={styles.grid}>
            {farmingBenefits.map(renderBenefitCard)}
          </View>
        )}
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {renderModalContent()}
            </ScrollView>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 60) / 2,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
    lineHeight: 16,
  },
  tipsPreview: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 6,
    borderRadius: 6,
  },
  tipsText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
  },
  diseaseInfo: {
    gap: 4,
  },
  diseaseText: {
    fontSize: 11,
    color: '#FF9800',
    fontWeight: '600',
  },
  benefitIcon: {
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 10,
  },
  benefitPreview: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    padding: 6,
    borderRadius: 6,
  },
  benefitText: {
    fontSize: 11,
    color: '#2196F3',
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
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
  benefitModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});