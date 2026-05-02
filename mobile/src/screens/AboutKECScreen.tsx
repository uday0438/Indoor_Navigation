// ═══════════════════════════════════════════
// About KEC Screen — College information
// ═══════════════════════════════════════════
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Image, Linking, Alert } from 'react-native';
import { useNavigation as useRNNav } from '@react-navigation/native';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS } from '../utils/constants';

export default function AboutKECScreen() {
  const rnNav = useRNNav();
  const { t } = useLanguage();

  const leadership = [
    {
      name: 'Dr. B.C. Nagaraj', role: 'Founder & Chairman, BCN Group of Institutions',
      desc: 'A visionary philanthropist dedicated to excellence in education.',
      longMessage: 'We at Kuppam Engineering College have a vision to impart quality technical education, to bring out the hidden skills and abilities of the students with proper discipline. We are committed to providing meaningful education, research, and training to meet global standards.\n\nWe have put together an experienced team of highly qualified, motivated and dedicated staff, supported by excellent infrastructural facilities to make the institution an ideal place of learning.\n\nOur commitment goes beyond achieving current academic standards. We continuously strive to enhance and upgrade them. Finally, it will give us immense pleasure when students graduated from our college are well placed in their careers.\n\nDr. B C Nagaraj, MBA.,\nFounder & Chairman'
    },
    {
      name: 'Dr. N. Sunil Raj, M.B.B.S.', role: 'Vice-Chairman',
      desc: 'Committed to medical and technical progress.',
      longMessage: 'At Kuppam Engineering College, we are committed to delivering high-quality technical education through a team of highly qualified and experienced faculty members, supported by excellent infrastructural facilities.\n\nBeyond regular academics, we focus on holistic skill development through mandatory certification programs, NPTEL courses, hands-on mini projects, and continuous learning modules spread across all four years. This ensures that every student is industry-ready by the time they reach their final year and fully prepared to excel in placements and future career pathways.\n\nOur mission is to nurture competent, confident, and dynamic engineers who make their parents proud and contribute meaningfully to the progress of our nation.'
    },
    {
      name: 'Sri. N. Sagar Raj', role: 'Secretary',
      desc: 'Dynamic leader focusing on college administration and student growth.'
    },
    {
      name: 'Dr. S. Sudhakar Babu', role: 'Principal',
      desc: 'Promoting academic excellence and research innovation.'
    },
  ];

  const showVisionaryMessage = (leader: any) => {
    if (leader.longMessage) {
      Alert.alert(
        `Message from ${leader.name}`,
        leader.longMessage,
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => rnNav.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← {t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.aboutKECTitle}</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.logoImg, { backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: 30 }}>🎓</Text>
          </View>
          <Text style={styles.heroTitle}>Kuppam Engineering College</Text>
          <Text style={styles.heroSub}>Autonomous Institution • Est. 2001</Text>
          <View style={styles.badgeRow}>
            {['NBA', 'NAAC (A+)', 'ISO 9001:2015', 'UGC 2(f) & 12(b)', "Grade 'A'"].map((badge, i) => (
              <View key={i} style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* About */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📜 History & Vision</Text>
          <Text style={styles.cardText}>
            Kuppam Engineering College (KEC) was inaugurated by Sri. N. Chandra Babu Naidu, Hon'ble Former Chief Minister of Andhra Pradesh on 11th September 2001. The institute was promoted by the well-known philanthropist Dr. B.C. Nagaraj, Founder Chairman of BCN Group of Institutions.
          </Text>
          <Text style={[styles.cardText, { marginTop: 10 }]}>
            Our vision is to become a premier research-oriented technical institution providing quality education and fostering innovative research for societal benefit. KEC is accredited by NBA & NAAC with A+ grade, and it is an autonomous institution recognized for its academic rigor.
          </Text>
        </View>

        {/* Leadership */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👥 Our Leadership Team</Text>
          {leadership.map((leader, i) => (
            <View key={i} style={styles.leaderRow}>
              <View style={[styles.leaderPhoto, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4ff' }]}>
                <Text style={{ fontSize: 24 }}>👨‍💼</Text>
              </View>
              <View style={styles.leaderInfo}>
                <TouchableOpacity onPress={() => showVisionaryMessage(leader)} disabled={!leader.longMessage}>
                  <Text style={[styles.leaderName, leader.longMessage ? { color: COLORS.accent, textDecorationLine: 'underline' } : {}]}>
                    {leader.name}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.leaderRole}>{leader.role}</Text>
                <Text style={styles.leaderDesc}>{leader.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Facilities */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🏛️ State-of-the-Art Facilities</Text>
          <Text style={styles.cardText}>
            • Digital Library with over 50,000+ volumes and access to IEEE/IETE journals.
          </Text>
          <Text style={styles.cardText}>
            • Modern laboratories equipped with latest technologies (IOT, Drone Tech, AI Labs).
          </Text>
          <Text style={styles.cardText}>
            • 55-acre lush green campus with residential facilities for 1000+ students.
          </Text>
          <Text style={styles.cardText}>
            • Dedicated Incubation Center and Startup Hub for young entrepreneurs.
          </Text>
          <TouchableOpacity style={styles.webBtn} onPress={() => {
            Linking.openURL('https://www.kec.ac.in').catch(() => {
              Alert.alert('Error', 'Could not open the browser. Please visit https://www.kec.ac.in manually.');
            });
          }}>
            <Text style={styles.webBtnText}>Visit Official Website 🌐</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Institutional Highlights</Text>
          <View style={styles.highlightGrid}>
            {[
              { val: '24+', label: 'Years Excellence', icon: '🏆' },
              { val: '10k+', label: 'Alumni', icon: '🎓' },
              { val: '50+', label: 'Companies/Year', icon: '🏢' },
              { val: 'A+', label: 'NAAC Rating', icon: '⭐' },
            ].map((h, i) => (
              <View key={i} style={styles.highlightBox}>
                <Text style={styles.highlightIcon}>{h.icon}</Text>
                <Text style={styles.highlightVal}>{h.val}</Text>
                <Text style={styles.highlightLabel}>{h.label}</Text>
              </View>
            ))}
          </View>
        </View>

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
  headerTitle: { color: '#fff', fontSize: 15, fontWeight: '800', flex: 1 },
  scroll: { flex: 1 },
  hero: {
    backgroundColor: COLORS.primaryLight, margin: 16, borderRadius: 20, padding: 24, alignItems: 'center',
  },
  logoImg: { width: 60, height: 60, marginBottom: 12, borderRadius: 30 },
  heroIcon: { fontSize: 40, marginBottom: 8 },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  heroSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, textAlign: 'center' },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 14 },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  card: {
    marginHorizontal: 16, marginBottom: 12, backgroundColor: '#fff', borderRadius: 14,
    padding: 18, borderWidth: 1, borderColor: '#f0f0f0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.primary, marginBottom: 12 },
  cardText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 22 },

  leaderRow: { flexDirection: 'row', gap: 16, marginBottom: 20, alignItems: 'flex-start' },
  leaderPhoto: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#f0f4ff',
    borderWidth: 1, borderColor: '#f0f0f0',
  },
  leaderInfo: { flex: 1 },
  leaderName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  leaderRole: { fontSize: 11, color: COLORS.accent, fontWeight: '600', marginTop: 1 },
  leaderDesc: { fontSize: 11, color: COLORS.textMuted, marginTop: 4, fontStyle: 'italic' },

  webBtn: {
    marginTop: 15, backgroundColor: '#f8f9ff', borderColor: '#d0daff', borderWidth: 1,
    borderRadius: 8, padding: 10, alignItems: 'center',
  },
  webBtnText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },

  highlightGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  highlightBox: {
    width: '47%', backgroundColor: '#f8f9ff', borderRadius: 12, padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: '#eef0ff',
  },
  highlightIcon: { fontSize: 24, marginBottom: 4 },
  highlightVal: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  highlightLabel: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center', marginTop: 2 },
});

