// ═══════════════════════════════════════════
// Vision Screen — KEC & ECE Vision/Mission
// ═══════════════════════════════════════════
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useNavigation as useRNNav } from '@react-navigation/native';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS } from '../utils/constants';

export default function VisionScreen() {
  const rnNav = useRNNav();
  const { t } = useLanguage();

  const sections = [
    {
      icon: '🏛️',
      title: 'KEC Institutional Vision',
      content: 'To be a leading institute of professional education in imparting quality education to rural youth and producing dynamic technocrats with competent skills to meet the demands of industry and society.',
      color: '#1565C0',
    },
    {
      icon: '🎯',
      title: 'KEC Mission',
      content: 'To strive and provide meaningful education, training and research to match global standards and nurture talented professionals rich in moral, ethical and social values.',
      color: '#2E7D32',
    },
    {
      icon: '📡',
      title: 'ECE Department Vision',
      content: 'To provide quality education and research environment to develop innovative, skilled and ethical Electronics & Communication Engineers who contribute to the betterment of society.',
      color: '#6A1B9A',
    },
    {
      icon: '🚀',
      title: 'ECE Department Mission',
      content: null,
      bullets: [
        'Impart strong theoretical and practical knowledge in Electronics & Communication Engineering',
        'Promote research, innovation and entrepreneurship among students and faculty',
        'Develop technical skills and foster innovation',
        'Produce graduates capable of solving real-world engineering problems',
        'Instil professional ethics and social responsibility',
      ],
      color: '#E65100',
    },
    {
      icon: '🏆',
      title: 'Quality Objective',
      content: 'Achieve academic excellence by providing quality and practical education, making students fit to face challenges in the global professional scenario.',
      color: '#AD1457',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => rnNav.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← {t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.visionTitle}</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroIcon}>🎯</Text>
          <Text style={styles.heroTitle}>{t.visionTitle}</Text>
          <Text style={styles.heroSub}>Shaping the future through quality education & innovation</Text>
        </View>

        {sections.map((section, idx) => (
          <View key={idx} style={[styles.card, { borderLeftColor: section.color }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{section.icon}</Text>
              <Text style={[styles.cardTitle, { color: section.color }]}>{section.title}</Text>
            </View>
            {section.content && (
              <Text style={styles.cardContent}>{section.content}</Text>
            )}
            {section.bullets && (
              <View style={styles.bulletList}>
                {section.bullets.map((bullet, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <View style={[styles.bulletDot, { backgroundColor: section.color }]} />
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 14, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  backBtn: { paddingVertical: 4 },
  backText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '800', flex: 1 },
  scroll: { flex: 1 },
  heroSection: {
    backgroundColor: COLORS.primaryLight, margin: 16, borderRadius: 20, padding: 28, alignItems: 'center',
  },
  heroIcon: { fontSize: 40, marginBottom: 10 },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  heroSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  card: {
    marginHorizontal: 16, marginBottom: 12, backgroundColor: '#fff', borderRadius: 14,
    padding: 18, borderWidth: 1, borderColor: '#f0f0f0', borderLeftWidth: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  cardIcon: { fontSize: 22 },
  cardTitle: { fontSize: 15, fontWeight: '700', flex: 1 },
  cardContent: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 22 },
  bulletList: { gap: 8 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  bulletText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, flex: 1 },
});
