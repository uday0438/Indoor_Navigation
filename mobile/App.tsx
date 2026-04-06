// ═══════════════════════════════════════════
// App Root — With Language Provider & Splash
// ═══════════════════════════════════════════
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, StatusBar, Image } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import NavBot from './src/components/NavBot';
import { LanguageProvider } from './src/i18n/LanguageContext';

const { width, height } = Dimensions.get('window');

function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const logoScale = useRef(new Animated.Value(0.2)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const bgScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Logo entrance with subtle rotation
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 10,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Text fade-in
    setTimeout(() => {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 600);

    // 3. Subtle background pulse or logo pulse
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoScale, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
          Animated.timing(logoScale, { toValue: 1, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
    }, 1200);

    // 4. Final zoom-out transition
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(textOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(bgScale, { toValue: 1.2, duration: 800, useNativeDriver: true }),
      ]).start(() => onFinish());
    }, 3200);
  }, []);

  const spin = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-45deg', '0deg']
  });

  return (
    <Animated.View style={[styles.splashContainer, { transform: [{ scale: bgScale }] }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1024" />
      
      <Animated.View style={[styles.logoContainer, {
        opacity: logoOpacity,
        transform: [
          { scale: logoScale },
          { rotate: spin }
        ],
      }]}>
        <View style={styles.logoBadge}>
          <Image 
            source={require('./assets/nav_logo.png')} 
            style={styles.logoImage} 
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
        <Text style={styles.splashTitle}>KEC NAVIGATOR</Text>
        <Text style={styles.splashSub}>AI-Powered Indoor Portal</Text>
        
        <View style={styles.accentBar} />
        
        <View style={styles.collegeInfo}>
          <Text style={styles.splashDept}>ELECTRONICS & COMMUNICATION ENGINEERING</Text>
          <Text style={styles.splashCollege}>KUPPAM ENGINEERING COLLEGE</Text>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.versionText}>v2.0 Beta — Professional Suite</Text>
      </View>
    </Animated.View>
  );
}

import { useNavStore } from './src/store/navigationStore';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { navState } = useNavStore();

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <LanguageProvider>
      <View style={{ flex: 1 }}>
        <AppNavigator />
        {navState === 'idle' && <NavBot />}
      </View>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#0A1024',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
    marginBottom: 40,
  },
  logoBadge: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFFFFF',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#3B82F6',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  splashTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 4,
    textAlign: 'center',
  },
  splashSub: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  accentBar: {
    width: 60,
    height: 4,
    backgroundColor: '#3B82F6',
    marginVertical: 24,
    borderRadius: 2,
  },
  collegeInfo: {
    alignItems: 'center',
  },
  splashDept: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
  },
  splashCollege: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  versionText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

