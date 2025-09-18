import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Tool {
  id: string;
  name: string;
  description: string;
  price: number;
  priceUnit: string;
  image: string;
  seller: {
    name: string;
    phone: string;
    location: string;
    rating: number;
  };
  availability: boolean;
  category: string;
}

const sampleTools: Tool[] = [
  {
    id: '1',
    name: 'Tractor - John Deere 5055D',
    description: '4WD tractor with 55 HP engine. Perfect for plowing, tilling, and hauling. Well maintained with recent service.',
    price: 2500,
    priceUnit: 'per day',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
    seller: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      location: 'Punjab, India',
      rating: 4.8,
    },
    availability: true,
    category: 'Heavy Machinery',
  },
  {
    id: '2',
    name: 'Rotavator - 5 Feet',
    description: 'Heavy duty rotavator for soil preparation. Excellent for breaking up soil and mixing in organic matter.',
    price: 800,
    priceUnit: 'per day',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    seller: {
      name: 'Priya Sharma',
      phone: '+91 87654 32109',
      location: 'Haryana, India',
      rating: 4.6,
    },
    availability: true,
    category: 'Soil Preparation',
  },
  {
    id: '3',
    name: 'Harvester - Combine',
    description: 'Self-propelled combine harvester for wheat and rice. High efficiency with low grain loss.',
    price: 5000,
    priceUnit: 'per day',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    seller: {
      name: 'Amit Singh',
      phone: '+91 76543 21098',
      location: 'Uttar Pradesh, India',
      rating: 4.9,
    },
    availability: false,
    category: 'Harvesting',
  },
  {
    id: '4',
    name: 'Sprayer - Boom Type',
    description: '12-meter boom sprayer for pesticide and fertilizer application. Precise and efficient spraying.',
    price: 600,
    priceUnit: 'per day',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
    seller: {
      name: 'Sunita Devi',
      phone: '+91 65432 10987',
      location: 'Bihar, India',
      rating: 4.7,
    },
    availability: true,
    category: 'Spraying',
  },
  {
    id: '5',
    name: 'Seeder - Multi Crop',
    description: 'Precision seeder for various crops. Adjustable row spacing and seed rate control.',
    price: 400,
    priceUnit: 'per day',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    seller: {
      name: 'Vikram Patel',
      phone: '+91 54321 09876',
      location: 'Gujarat, India',
      rating: 4.5,
    },
    availability: true,
    category: 'Planting',
  },
  {
    id: '6',
    name: 'Thresher - Multi Grain',
    description: 'Electric thresher for wheat, rice, and other grains. High capacity with low power consumption.',
    price: 300,
    priceUnit: 'per day',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
    seller: {
      name: 'Kavita Reddy',
      phone: '+91 43210 98765',
      location: 'Andhra Pradesh, India',
      rating: 4.4,
    },
    availability: true,
    category: 'Processing',
  },
  {
    id: '7',
    name: 'Drip Irrigation System',
    description: 'Complete drip irrigation setup for efficient water delivery. Includes pipes, emitters, and filters.',
    price: 500,
    priceUnit: 'per day',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    seller: {
      name: 'Ravi Patel',
      phone: '+91 32109 87654',
      location: 'Gujarat, India',
      rating: 4.6,
    },
    availability: true,
    category: 'Irrigation',
  },
  {
    id: '8',
    name: 'Fertilizer Spreader',
    description: 'Mechanical fertilizer spreader for even distribution. Adjustable rate and width settings.',
    price: 350,
    priceUnit: 'per day',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
    seller: {
      name: 'Sunil Kumar',
      phone: '+91 21098 76543',
      location: 'Haryana, India',
      rating: 4.3,
    },
    availability: true,
    category: 'Fertilizing',
  },
  {
    id: '9',
    name: 'Farm Truck - 2 Ton',
    description: 'Heavy-duty farm truck for transporting crops and equipment. Well maintained with good mileage.',
    price: 1200,
    priceUnit: 'per day',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    seller: {
      name: 'Amit Singh',
      phone: '+91 10987 65432',
      location: 'Uttar Pradesh, India',
      rating: 4.7,
    },
    availability: true,
    category: 'Transport',
  },
  {
    id: '10',
    name: 'Grain Storage Silo',
    description: 'Large capacity grain storage silo with moisture control. Perfect for long-term storage.',
    price: 800,
    priceUnit: 'per day',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
    seller: {
      name: 'Priya Sharma',
      phone: '+91 09876 54321',
      location: 'Punjab, India',
      rating: 4.5,
    },
    availability: false,
    category: 'Storage',
  },
  {
    id: '11',
    name: 'Tool Maintenance Kit',
    description: 'Complete maintenance kit for agricultural tools. Includes lubricants, cleaning supplies, and basic tools.',
    price: 200,
    priceUnit: 'per day',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    seller: {
      name: 'Vikram Reddy',
      phone: '+91 98765 43210',
      location: 'Karnataka, India',
      rating: 4.2,
    },
    availability: true,
    category: 'Maintenance',
  },
];

export default function RentalPage() {
  const colorScheme = useColorScheme();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCategories, setShowCategories] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const categoryAnimation = useRef(new Animated.Value(1)).current;

  const categories = [
    { name: 'All', icon: 'grid' },
    { name: 'Heavy Machinery', icon: 'tractor' },
    { name: 'Soil Preparation', icon: 'leaf.fill' },
    { name: 'Harvesting', icon: 'scissors' },
    { name: 'Spraying', icon: 'drop.fill' },
    { name: 'Planting', icon: 'seedling' },
    { name: 'Processing', icon: 'gearshape.fill' },
    { name: 'Irrigation', icon: 'drop.circle.fill' },
    { name: 'Fertilizing', icon: 'leaf.arrow.circlepath' },
    { name: 'Transport', icon: 'truck.box.fill' },
    { name: 'Storage', icon: 'building.2.fill' },
    { name: 'Maintenance', icon: 'wrench.and.screwdriver.fill' }
  ];

  const filteredTools = sampleTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSeller = (tool: Tool) => {
    setSelectedTool(tool);
    setContactModalVisible(true);
  };

  const handleCallSeller = (phone: string) => {
    Alert.alert(
      'Call Seller',
      `Do you want to call ${phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Calling:', phone) },
      ]
    );
  };

  const handleRentTool = (tool: Tool) => {
    Alert.alert(
      'Rent Tool',
      `Are you sure you want to rent ${tool.name} for ₹${tool.price} ${tool.priceUnit}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            Alert.alert('Success', 'Rental request sent to seller!');
            setContactModalVisible(false);
          }
        },
      ]
    );
  };

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    // Hide categories when scrolling down more than 50px
    if (scrollY > 50) {
      if (showCategories) {
        setShowCategories(false);
        Animated.timing(categoryAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    } else {
      if (!showCategories) {
        setShowCategories(true);
        Animated.timing(categoryAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    // Reset scroll position and show categories when selecting a new category
    setShowCategories(true);
    Animated.timing(categoryAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const renderToolCard = (tool: Tool) => (
    <View key={tool.id} style={[styles.toolCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <Image source={{ uri: tool.image }} style={styles.toolImage} />
      <View style={styles.toolInfo}>
        <View style={styles.toolHeader}>
          <ThemedText style={styles.toolName}>{tool.name}</ThemedText>
          <View style={[styles.availabilityBadge, { 
            backgroundColor: tool.availability ? '#4CAF50' : '#F44336' 
          }]}>
            <Text style={styles.availabilityText}>
              {tool.availability ? 'Available' : 'Unavailable'}
            </Text>
          </View>
        </View>
        
        <ThemedText style={styles.toolCategory}>{tool.category}</ThemedText>
        <ThemedText style={styles.toolDescription} numberOfLines={2}>
          {tool.description}
        </ThemedText>
        
        <View style={styles.priceContainer}>
          <ThemedText style={styles.price}>₹{tool.price}</ThemedText>
          <ThemedText style={styles.priceUnit}>/{tool.priceUnit}</ThemedText>
        </View>
        
        <View style={styles.sellerInfo}>
          <ThemedText style={styles.sellerName}>Seller: {tool.seller.name}</ThemedText>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {tool.seller.rating}</Text>
            <ThemedText style={styles.location}>{tool.seller.location}</ThemedText>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.contactButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={() => handleContactSeller(tool)}
            disabled={!tool.availability}
          >
            <Text style={styles.buttonText}>Contact Seller</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.rentButton, { 
              backgroundColor: tool.availability ? '#4CAF50' : '#CCCCCC' 
            }]}
            onPress={() => handleRentTool(tool)}
            disabled={!tool.availability}
          >
            <Text style={[styles.buttonText, { 
              color: tool.availability ? 'white' : '#666666' 
            }]}>Rent Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Agri Tools Rental</ThemedText>
        <ThemedText style={styles.subtitle}>Rent agricultural tools from local farmers</ThemedText>
      </ThemedView>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <TextInput
          style={[styles.searchInput, { 
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderColor: Colors[colorScheme ?? 'light'].text + '20',
            color: Colors[colorScheme ?? 'light'].text,
          }]}
          placeholder="Search tools..."
          placeholderTextColor={Colors[colorScheme ?? 'light'].text + '60'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filter */}
      <Animated.View 
        style={[
          styles.categoryWrapper,
          {
            opacity: categoryAnimation,
            transform: [{
              translateY: categoryAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              })
            }]
          }
        ]}
        pointerEvents={showCategories ? 'auto' : 'none'}
      >
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: selectedCategory === category.name 
                    ? Colors[colorScheme ?? 'light'].tint 
                    : Colors[colorScheme ?? 'light'].background,
                  borderColor: Colors[colorScheme ?? 'light'].tint,
                }
              ]}
              onPress={() => handleCategorySelect(category.name)}
            >
              <IconSymbol 
                name={category.icon as any} 
                size={6} 
                color={selectedCategory === category.name 
                  ? 'white' 
                  : Colors[colorScheme ?? 'light'].tint} 
              />
              <Text style={[
                styles.categoryText,
                {
                  color: selectedCategory === category.name 
                    ? 'white' 
                    : Colors[colorScheme ?? 'light'].tint,
                }
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Tools List */}
      <ScrollView 
        key={selectedCategory}
        ref={scrollViewRef}
        style={styles.toolsList} 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {filteredTools.map(renderToolCard)}
      </ScrollView>

      {/* Contact Modal */}
      <Modal
        visible={contactModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setContactModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            {selectedTool && (
              <>
                <ThemedText type="subtitle" style={styles.modalTitle}>Contact Seller</ThemedText>
                
                <View style={styles.sellerDetails}>
                  <ThemedText style={styles.sellerDetailName}>{selectedTool.seller.name}</ThemedText>
                  <ThemedText style={styles.sellerDetailPhone}>📞 {selectedTool.seller.phone}</ThemedText>
                  <ThemedText style={styles.sellerDetailLocation}>📍 {selectedTool.seller.location}</ThemedText>
                  <ThemedText style={styles.sellerDetailRating}>⭐ Rating: {selectedTool.seller.rating}/5</ThemedText>
                </View>

                <ThemedText style={styles.toolDetailTitle}>Tool Details:</ThemedText>
                <ThemedText style={styles.toolDetailName}>{selectedTool.name}</ThemedText>
                <ThemedText style={styles.toolDetailPrice}>₹{selectedTool.price} {selectedTool.priceUnit}</ThemedText>

                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.modalButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
                    onPress={() => handleCallSeller(selectedTool.seller.phone)}
                  >
                    <Text style={styles.modalButtonText}>📞 Call Now</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, { backgroundColor: '#4CAF50' }]}
                    onPress={() => handleRentTool(selectedTool)}
                  >
                    <Text style={styles.modalButtonText}>✅ Rent Tool</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={[styles.closeButton, { backgroundColor: '#F44336' }]}
                  onPress={() => setContactModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 7,
  },
  searchInput: {
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  categoryWrapper: {
    overflow: 'hidden',
  },
  categoryContainer: {
    marginBottom: 8,
    height: 'auto',
    minHeight: 20,
    opacity: 1,
  },
  categoryContent: {
    paddingHorizontal: 20,
    paddingVertical: 2,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    marginRight: 4,
    borderWidth: 1,
    gap: 1,
    height: 'auto',
    minHeight: 18,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '600',
  },
  toolsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  toolCard: {
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  toolImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  toolInfo: {
    padding: 15,
  },
  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  toolName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  toolCategory: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  toolDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  priceUnit: {
    fontSize: 14,
    marginLeft: 5,
    opacity: 0.7,
  },
  sellerInfo: {
    marginBottom: 15,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#FFA500',
  },
  location: {
    fontSize: 12,
    opacity: 0.7,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  rentButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
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
    marginBottom: 20,
    textAlign: 'center',
  },
  sellerDetails: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  sellerDetailName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sellerDetailPhone: {
    fontSize: 16,
    marginBottom: 5,
  },
  sellerDetailLocation: {
    fontSize: 16,
    marginBottom: 5,
  },
  sellerDetailRating: {
    fontSize: 16,
  },
  toolDetailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  toolDetailName: {
    fontSize: 16,
    marginBottom: 5,
  },
  toolDetailPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
