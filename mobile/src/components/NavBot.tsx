// ═══════════════════════════════════════════
// NavBot — Upgraded AI Assistant for KEC Navigator
// ═══════════════════════════════════════════
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Animated, Dimensions, KeyboardAvoidingView, Platform,
  ActivityIndicator,
} from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { useNavStore } from '../store/navigationStore';
import { COLORS } from '../utils/constants';
import { TRANSLATE } from '../utils/translation';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  from: 'user' | 'bot';
  timestamp: Date;
}

const PRE_QUESTIONS = [
  "How do I find a lab?",
  "Where is the nearest exit?",
  "How to use NavBot?",
  "What is KEC Navigator?",
];

const BOT_ANSWERS: Record<string, string> = {
  "default": "I'm NavBot, your guide for KEC. Ask me anything about the building!",
  "hi": "Hello! I am NavBot. How can I help you navigate today?",
  "how do i find a lab?": "Search for any lab name (like 'Physics Lab') in the search bar on the home screen. I'll show you the exact route!",
  "where is the nearest exit?": "Exits are marked with 🚪 on the map. You can also search for 'Exit' to find the closest one to your current position.",
  "how to use navbot?": "Just type your question or click on one of the common questions, and I'll do my best to help!",
  "what is kec navigator?": "KEC Navigator is an indoor navigation system designed for KEC to help students, staff, and visitors find rooms, labs, and offices with ease.",
  "principal": "The Principal's Office (SV 116) is on the First Floor. You can search for 'Principal' to get the route.",
  "ece department": "The ECE Department is located on the Second Floor. The HOD office is SV 204.",
  "eee department": "The EEE Department is located on the First Floor.",
  "library": "The main Library and Digital Library are located on the Third Floor (SV 301 and SV 302).",
  "simulation lab": "The Simulation Lab (SVE 106) is on the First Floor.",
  "physics lab": "The Physics Lab is typically on the Ground Floor or Second Floor depending on the block, check the search bar for 'Physics'!",
  "where is hod ece?": "ECE HOD Office is SV 204 on the Second Floor.",
  "where is hod eee?": "EEE HOD Office is SV 124 on the First Floor.",
  "go right": "I'm sorry, I cannot control your movement, but your navigation guide will tell you when to turn!",
};

export default function NavBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! I'm NavBot. 👋 How can I help you today?", from: 'bot', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: isOpen ? 1 : 0,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
  }, [isOpen, anim]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      from: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Bot response logic (Simulated Smart AI)
    setTimeout(async () => {
      const lower = text.toLowerCase().trim();
      let responseText = BOT_ANSWERS[lower];
      
      if (!responseText) {
        // Simple logic to find partial matches
        const key = Object.keys(BOT_ANSWERS).find(k => lower.includes(k) && k.length > 3);
        responseText = key ? BOT_ANSWERS[key] : "That's an interesting question about KEC! I'm currently scanning the floor plans and history records. I recommend searching for specific locations like 'ECE' or 'Library' in the main search bar.";
      }
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        from: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      
      // Haptic on response
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Voice response (New Improvement!)
      const { isMuted, voiceLanguage } = useNavStore.getState();
      if (!isMuted) {
        let langCode = 'en-US';
        if (voiceLanguage === 'hi') langCode = 'hi-IN';
        if (voiceLanguage === 'te') langCode = 'te-IN';
        
        Speech.speak(TRANSLATE(responseText, voiceLanguage), { 
          pitch: 1.1, 
          rate: 1.0,
          language: langCode
        });
      }

    }, 1500);
  };

  const startListening = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsListening(true);
    // Mocking voice recognition
    setTimeout(() => {
      setIsListening(false);
      setInputText("Where is ece hod?");
    }, 2000);
  };

  const trayTranslateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_H, 0],
  });

  const buttonScale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Floating Button */}
      {!isOpen && (
        <Animated.View style={[styles.fabContainer, { transform: [{ scale: buttonScale }] }]}>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setIsOpen(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.fabIcon}>🤖</Text>
            <Text style={styles.fabText}>NavBot</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Chat UI Window */}
      {isOpen && (
        <Animated.View style={[styles.window, { transform: [{ translateY: trayTranslateY }] }]}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.botAvatar}>
                <Text style={{ fontSize: 20 }}>🤖</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>NavBot</Text>
                <Text style={styles.headerStatus}>● Online Assistant</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.closeBtn}>
              <Text style={{ fontSize: 20, color: COLORS.textMuted }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            ref={scrollRef}
            style={styles.msgArea}
            contentContainerStyle={styles.msgContent}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map(m => (
              <View key={m.id} style={[styles.msgWrapper, m.from === 'user' ? styles.userWrapper : styles.botWrapper]}>
                <View style={[styles.msgBubble, m.from === 'user' ? styles.userBubble : styles.botBubble]}>
                  <Text style={[styles.msgText, m.from === 'user' ? styles.userText : styles.botText]}>
                    {m.from === 'bot' ? TRANSLATE(m.text, useNavStore.getState().voiceLanguage) : m.text}
                  </Text>
                </View>
                <Text style={styles.timestamp}>
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            ))}
            {isTyping && (
              <View style={[styles.msgWrapper, styles.botWrapper]}>
                <View style={[styles.msgBubble, styles.botBubble, { paddingVertical: 8 }]}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Pre-defined questions */}
          <View style={styles.preQuestionsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.preQuestionsScroll}>
              {PRE_QUESTIONS.map((q, i) => (
                <TouchableOpacity key={i} style={styles.preQuestionChip} onPress={() => handleSend(q)}>
                  <Text style={styles.preQuestionText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Input Area */}
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.inputBar}>
              <TouchableOpacity 
                style={[styles.micBtn, isListening && { backgroundColor: '#FF5252' }]} 
                onPress={startListening}
              >
                <Text style={styles.micIcon}>{isListening ? '🛑' : '🎤'}</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder={isListening ? "Listening..." : "Ask anything..."}
                placeholderTextColor={COLORS.textMuted}
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={() => handleSend(inputText)}
              />
              <TouchableOpacity 
                style={[styles.sendBtn, !inputText.trim() && { opacity: 0.5 }]} 
                onPress={() => handleSend(inputText)}
                disabled={!inputText.trim()}
              >
                <Text style={styles.sendIcon}>🚀</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    zIndex: 9999,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fab: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    gap: 8,
  },
  fabIcon: { fontSize: 24 },
  fabText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  
  window: {
    height: SCREEN_H * 0.75,
    width: SCREEN_W,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  headerStatus: { fontSize: 11, color: '#4CAF50', fontWeight: '600' },
  closeBtn: { padding: 4 },
  
  msgArea: { flex: 1, backgroundColor: '#f9f9fb' },
  msgContent: { padding: 20, paddingBottom: 40 },
  msgWrapper: { marginBottom: 16, maxWidth: '80%' },
  userWrapper: { alignSelf: 'flex-end' },
  botWrapper: { alignSelf: 'flex-start' },
  msgBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e5f2',
  },
  msgText: { fontSize: 15, lineHeight: 21 },
  userText: { color: '#fff' },
  botText: { color: COLORS.textPrimary },
  timestamp: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
    marginHorizontal: 4,
  },
  
  preQuestionsContainer: {
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  preQuestionsScroll: { paddingHorizontal: 16, gap: 8 },
  preQuestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f4ff',
    borderWidth: 1,
    borderColor: '#d0daff',
  },
  preQuestionText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  
  inputBar: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#f5f7fa',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: { fontSize: 20 },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E5F2',
  },
  micIcon: { fontSize: 18 },
});
