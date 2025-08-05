import React from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';

const BACKGROUND_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
};
const LOGO_IMAGE = {
  uri: 'https://img.icons8.com/ios-filled/100/4caf50/tractor.png',
};

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const handleGetStarted = () => {
    Alert.alert('Welcome to Agri360!', "Let's get started!");
  };

  return (
    <ImageBackground
      source={BACKGROUND_IMAGE}
      style={styles.background}
      resizeMode="cover"
      blurRadius={2}
    >
      <View
        style={[
          styles.overlay,
          { backgroundColor: isDarkMode ? 'rgba(26,26,26,0.7)' : 'rgba(255,255,255,0.7)' },
        ]}
      />
      <View style={styles.content}>
        <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#222' }]}>
          Welcome to Agri360
        </Text>
        <Text style={[styles.subtitle, { color: isDarkMode ? '#ddd' : '#333' }]}>
          Empowering Farmers. Growing Futures.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    width: '100%',
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 28,
    marginTop: -40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 36,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.9,
  },
  button: {
    backgroundColor: '#4caf50',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 32,
    elevation: 3,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
});