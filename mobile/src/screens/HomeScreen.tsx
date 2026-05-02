// ═══════════════════════════════════════════
// Home Screen — With language, about us, contact
// ═══════════════════════════════════════════
import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, StatusBar, Dimensions, Modal, Alert, Linking, Image, ImageBackground
} from 'react-native';
import { useNavigation as useRNNav } from '@react-navigation/native';
import { useNavigation } from '../hooks/useNavigation';
import { useLanguage, Language, LANGUAGE_NAMES } from '../i18n/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { useNavStore } from '../store/navigationStore';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useRNNav<any>();
  const { loadData } = useNavigation();
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useNavStore();
  const themeColors = useThemeColors();
  const styles = React.useMemo(() => createStyles(themeColors), [themeColors]);

  const [showLangModal, setShowLangModal] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => { loadData(); }, []);

  const handleSendMessage = () => {
    if (!contactName.trim() || !contactEmail.trim() || !contactMsg.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Construct mailto link
    const subject = `Indoornav Inquiry from ${contactName}`;
    const body = `Name: ${contactName}\nEmail: ${contactEmail}\n\nMessage:\n${contactMsg}`;
    const mailUrl = `mailto:sravssravyachinni@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailUrl).catch(() => {
      Alert.alert('Error', 'Could not open mail app. Please email manually to sravssravyachinni@gmail.com');
    });

    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 3000);
    setContactName(''); setContactEmail(''); setContactMsg('');
  };

  const handleEmailUs = () => {
    Linking.openURL('mailto:sravssravyachinni@gmail.com?subject=KEC Navigator Inquiry');
  };

  const languages: Language[] = ['en', 'te', 'hi', 'kn', 'ta'];

  const teamMembers = [
    { name: 'Mr. K. Uday Bhaskar', role: 'Developer', designation: 'B.Tech', icon: '👨‍💻', color: '#1565C0' },
    { name: 'Ms. P. Sravya', role: `${t.teamLead}, UI/UX Designer`, designation: 'B.Tech', email: 'sravssravyachinni@gmail.com', icon: '👩‍💻', color: '#2E7D32' }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={themeColors.primary} />

      {/* Header with logo and language */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.logoImg, { backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: 20 }}>🎓</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>{t.appName}</Text>
            <Text style={styles.headerSub}>{t.subtitle}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity 
            style={styles.langBtn} 
            onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <Text style={styles.langIcon}>{theme === 'light' ? '🌙' : '☀️'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.langBtn} onPress={() => setShowLangModal(true)}>
            <Text style={styles.langIcon}>🌐</Text>
            <Text style={styles.langLabel}>{language.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero card */}
        <View style={[styles.hero, { backgroundColor: themeColors.primary }]}>
          <View style={styles.heroOverlay}>
            <Text style={styles.heroIcon}>🏛️</Text>
            <Text style={styles.heroTitle}>{t.buildingName}</Text>
            <Text style={styles.heroDesc}>{t.buildingDesc}</Text>
            <TouchableOpacity style={styles.heroBtn} onPress={() => navigation.navigate('Navigate')}>
              <Text style={styles.heroBtnText}>{t.startNavigation}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick cards */}
        <View style={styles.cardGrid}>
          {[
            { icon: '🗺️', title: t.navigate, desc: t.indoorMaps, screen: 'Navigate' },
            { icon: '🎯', title: t.vision, desc: t.ourGoals, screen: 'Vision' },
            { icon: '📡', title: t.aboutECE, desc: t.department, screen: 'AboutECE' },
            { icon: '🏆', title: t.aboutKEC, desc: t.collegeInfo, screen: 'AboutKEC' },
          ].map((card) => (
            <TouchableOpacity
              key={card.title}
              style={styles.card}
              onPress={() => card.screen && navigation.navigate(card.screen)}
            >
              <Text style={styles.cardIcon}>{card.icon}</Text>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDesc}>{card.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick nav chips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧭 {t.quickNavigate}</Text>
          <View style={styles.chipContainer}>
            {['Principal', 'Library', 'HOD ECE', 'Auditorium', 'MPMC Lab', 'IOT Lab'].map((label) => (
              <TouchableOpacity key={label} style={styles.chip} onPress={() => navigation.navigate('Navigate', { prefillDestination: label })}>
                <Text style={styles.chipText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* About Us */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 {t.aboutUs}</Text>
          <Text style={styles.sectionSubtitle}>Indoor Navigation System — Project Team</Text>
          {teamMembers.map((member, i) => (
            <View key={i} style={[styles.teamCard, { borderLeftColor: member.color }]}>
              <View style={[styles.teamAvatar, { backgroundColor: member.color + '15' }]}>
                <Text style={{ fontSize: 24 }}>{member.icon}</Text>
              </View>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{member.name}</Text>
                <Text style={[styles.teamRole, { color: member.color }]}>{member.role}</Text>
                <Text style={styles.teamDesig}>{member.designation}</Text>
                {member.email && (
                  <TouchableOpacity onPress={() => Linking.openURL(`mailto:${member.email}`)}>
                    <Text style={styles.teamEmail}>📧 {member.email}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Get in Touch */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📬 {t.getInTouch}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.yourName}
            placeholderTextColor={themeColors.textMuted}
            value={contactName}
            onChangeText={setContactName}
          />
          <TextInput
            style={styles.input}
            placeholder={t.yourEmail}
            placeholderTextColor={themeColors.textMuted}
            value={contactEmail}
            onChangeText={setContactEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t.yourMessage}
            placeholderTextColor={themeColors.textMuted}
            value={contactMsg}
            onChangeText={setContactMsg}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
            <Text style={styles.sendBtnText}>🚀 {t.sendMessage}</Text>
          </TouchableOpacity>
          {messageSent && (
            <View style={styles.successMsg}>
              <Text style={styles.successText}>✅ {t.messageSent}</Text>
            </View>
          )}

          {/* Email Us */}
          <TouchableOpacity style={styles.emailBtn} onPress={handleEmailUs}>
            <Text style={styles.emailBtnText}>📧 {t.emailUs}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Language Modal */}
      <Modal visible={showLangModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🌐 {t.selectLanguage}</Text>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.langOption, language === lang && styles.langOptionActive]}
                onPress={() => { setLanguage(lang); setShowLangModal(false); }}
              >
                <Text style={[styles.langOptionText, language === lang && styles.langOptionTextActive]}>
                  {LANGUAGE_NAMES[lang]}
                </Text>
                {language === lang && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowLangModal(false)}>
              <Text style={styles.modalCloseText}>{t.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (themeColors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: themeColors.background },
  header: {
    backgroundColor: themeColors.primary, paddingTop: 50, paddingBottom: 14, paddingHorizontal: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoImg: { width: 32, height: 32, borderRadius: 16 },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.65)', fontSize: 10, marginTop: 1 },
  langBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16,
  },
  langIcon: { fontSize: 14 },
  langLabel: { color: '#fff', fontSize: 11, fontWeight: '700' },
  scroll: { flex: 1 },
  hero: {
    margin: 16, borderRadius: 18, overflow: 'hidden', backgroundColor: themeColors.primaryLight,
  },
  heroOverlay: {
    padding: 24, backgroundColor: 'rgba(13, 27, 74, 0.5)',
  },
  heroIcon: { fontSize: 30, marginBottom: 8 },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 6 },
  heroDesc: { color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 20 },
  heroBtn: {
    marginTop: 16, paddingVertical: 12, paddingHorizontal: 24,
    backgroundColor: '#fff', borderRadius: 10, alignSelf: 'flex-start',
  },
  heroBtnText: { color: themeColors.primary, fontWeight: '700', fontSize: 14 },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10 },
  card: {
    width: (width - 44) / 2, backgroundColor: themeColors.surface,
    borderRadius: 14, padding: 16, borderWidth: 1, borderColor: themeColors.border,
  },
  cardIcon: { fontSize: 26, marginBottom: 8 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: themeColors.primary },
  cardDesc: { fontSize: 11, color: themeColors.textMuted, marginTop: 2 },
  section: {
    margin: 16, marginBottom: 8, backgroundColor: themeColors.surface,
    borderRadius: 14, padding: 18, borderWidth: 1, borderColor: themeColors.border,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: themeColors.primary, marginBottom: 8 },
  sectionSubtitle: { fontSize: 11, color: themeColors.textMuted, marginBottom: 12 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 6, paddingHorizontal: 14,
    backgroundColor: themeColors.theme === 'dark' ? '#1E293B' : '#f0f2ff', 
    borderRadius: 20, borderWidth: 1, borderColor: themeColors.theme === 'dark' ? '#334155' : '#d0d5f0',
  },
  chipText: { fontSize: 12, fontWeight: '600', color: themeColors.theme === 'dark' ? '#93C5FD' : themeColors.primary },
  // Team
  teamCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 12, marginBottom: 8, backgroundColor: themeColors.theme === 'dark' ? '#1E1E1E' : '#fafbff', borderRadius: 12,
    borderLeftWidth: 3,
  },
  teamAvatar: {
    width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center',
  },
  teamInfo: { flex: 1 },
  teamName: { fontSize: 14, fontWeight: '700', color: themeColors.textPrimary },
  teamRole: { fontSize: 11, fontWeight: '600', marginTop: 1 },
  teamDesig: { fontSize: 10, color: themeColors.textMuted, marginTop: 1 },
  teamEmail: { fontSize: 10, color: themeColors.accent, marginTop: 2 },
  // Contact form
  input: {
    borderWidth: 1, borderColor: themeColors.border, borderRadius: 10, padding: 12,
    fontSize: 14, color: themeColors.textPrimary, marginBottom: 10, backgroundColor: themeColors.theme === 'dark' ? '#121212' : '#fafbfc',
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  sendBtn: {
    backgroundColor: themeColors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center',
  },
  sendBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  successMsg: {
    marginTop: 10, backgroundColor: '#E8F5E9', borderRadius: 8, padding: 10, alignItems: 'center',
  },
  successText: { color: '#2E7D32', fontWeight: '600', fontSize: 13 },
  emailBtn: {
    marginTop: 10, borderWidth: 1, borderColor: themeColors.primary, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center',
  },
  emailBtnText: { color: themeColors.primary, fontSize: 14, fontWeight: '600' },
  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    width: width * 0.8, backgroundColor: themeColors.surface, borderRadius: 20, padding: 24,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: themeColors.primary, textAlign: 'center', marginBottom: 18 },
  langOption: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 16, borderRadius: 10, marginBottom: 6,
  },
  langOptionActive: { backgroundColor: themeColors.theme === 'dark' ? '#1E293B' : '#f0f4ff' },
  langOptionText: { fontSize: 16, color: themeColors.textPrimary },
  langOptionTextActive: { color: themeColors.accent, fontWeight: '700' },
  checkMark: { color: themeColors.accent, fontSize: 18, fontWeight: '700' },
  modalClose: {
    marginTop: 12, paddingVertical: 12, backgroundColor: themeColors.theme === 'dark' ? '#333' : '#f5f5f5', borderRadius: 10, alignItems: 'center',
  },
  modalCloseText: { color: themeColors.textSecondary, fontWeight: '600' },
});
