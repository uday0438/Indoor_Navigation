// ═══════════════════════════════════════════
// About ECE Screen — Department details
// ═══════════════════════════════════════════
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';
import { useNavigation as useRNNav } from '@react-navigation/native';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS } from '../utils/constants';

export default function AboutECEScreen() {
  const rnNav = useRNNav();
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => rnNav.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← {t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.aboutECETitle}</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>📡</Text>
          <Text style={styles.heroTitle}>{t.aboutECETitle}</Text>
          <Text style={styles.heroSub}>Department of ECE • Established 2001</Text>
          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>120</Text>
              <Text style={styles.statLabel}>Intake</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>90%</Text>
              <Text style={styles.statLabel}>Placements</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>₹2.87Cr</Text>
              <Text style={styles.statLabel}>DST Grant</Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 About the Department</Text>
          <Text style={styles.cardText}>
            Electronics & Communication Engineering Department was started in the year 2001 with the intake of 60, gradually increased to 120 in 2002. Now it offers diploma program, undergraduate program, two postgraduate programs (M.Tech in VLSI Design & M.Tech in Embedded Systems) and Ph.D. program with affiliation to JNTUA.
          </Text>
          <Text style={[styles.cardText, { marginTop: 10 }]}>
            The department has well experienced and dedicated faculty and staff of proven ability and diverse specialization. The faculty are actively involved in research in the areas of Digital Communications, Antennas, Signal Processing, Fiber Optic Communications, VLSI, IoT, Wireless Communication, Microwave Engineering, Neural Networks, Satellite Communication, and Computer Networks.
          </Text>
        </View>

        {/* Activities */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔬 Professional Activities</Text>
          <Text style={styles.cardText}>
            The department continually conducts Workshops, Conferences, Faculty Development Programs (FDPs), Project Expos and brain storming sessions on entrepreneurship for students to become technology-based entrepreneurs.
          </Text>
          <Text style={[styles.cardText, { marginTop: 10 }]}>
            The laboratories are well equipped with modern training facilities. Students are encouraged to deliver seminars, publish papers in National/International Conferences, promoting technical and communication skills.
          </Text>
        </View>

        {/* Funding */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💰 Funded Projects</Text>
          <View style={styles.fundRow}>
            <View style={[styles.fundChip, { backgroundColor: '#E3F2FD' }]}>
              <Text style={[styles.fundAmount, { color: '#1565C0' }]}>₹2,87,00,000</Text>
              <Text style={styles.fundSource}>DST NewGen IEDC (2017)</Text>
            </View>
            <View style={[styles.fundChip, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.fundAmount, { color: '#2E7D32' }]}>₹2,50,000</Text>
              <Text style={styles.fundSource}>UGC SERO</Text>
            </View>
            <View style={[styles.fundChip, { backgroundColor: '#FFF3E0' }]}>
              <Text style={[styles.fundAmount, { color: '#E65100' }]}>₹1,00,000</Text>
              <Text style={styles.fundSource}>IEI</Text>
            </View>
            <View style={[styles.fundChip, { backgroundColor: '#F3E5F5' }]}>
              <Text style={[styles.fundAmount, { color: '#6A1B9A' }]}>₹1,00,000</Text>
              <Text style={styles.fundSource}>DST NIMAT</Text>
            </View>
          </View>
        </View>

        {/* HOD Section */}
        <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: '#1565C0' }]}>
          <Text style={styles.cardTitle}>👨‍🏫 {t.hodTitle}</Text>
          <View style={styles.profileSection}>
            <Image
              source={require('../../assets/hod_ece.jpg')}
              style={styles.profileAvatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Dr. G. N. Kodanda Ramaiah</Text>
              <Text style={styles.profileRole}>Head of the Department, ECE</Text>
            </View>
          </View>
          <Text style={styles.cardText}>
            Dr. G. N. Kodanda Ramaiah is an experienced academician with expertise in telecommunications, signal processing, and embedded systems. He has made significant contributions to teaching, research, and academic leadership, playing an important role in the development of the ECE department.
          </Text>
          <Text style={[styles.sectionLabel, { marginTop: 12 }]}>{t.achievementsTitle}</Text>
          {[
            'Published several research papers in reputed national and international journals',
            'Guided numerous undergraduate student projects in emerging technologies',
            'Actively involved in research related to communication systems and electronics',
            'Contributed to curriculum development and academic planning',
            'Participated in technical conferences, workshops, and seminars',
            'Known for effective student mentoring and academic excellence',
          ].map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={[styles.bulletDot, { backgroundColor: '#1565C0' }]} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
          <View style={styles.visionBox}>
            <Text style={styles.visionLabel}>Vision</Text>
            <Text style={styles.visionText}>
              His vision is to strengthen the foundation of electronics and communication engineering while encouraging students to explore modern technologies and practical applications.
            </Text>
          </View>
        </View>

        {/* Guide Section */}
        <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: '#2E7D32' }]}>
          <Text style={styles.cardTitle}>👩‍🏫 {t.guideTitle}</Text>
          <View style={styles.profileSection}>
            <Image
              source={require('../../assets/sumalatha.jpg')}
              style={[styles.profileAvatar, { backgroundColor: '#E8F5E9' }]}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Ms. M. Sumalatha</Text>
              <Text style={styles.profileRole}>M.Tech, Assistant Professor, Dept. of ECE</Text>
            </View>
          </View>
          <Text style={styles.cardText}>
            This project has been successfully carried out under the guidance of Ms. M. Sumalatha, Assistant Professor in the Department of Electronics and Communication Engineering. Her continuous support, valuable suggestions, and technical expertise have been instrumental throughout all stages of the project.
          </Text>
          <Text style={[styles.cardText, { marginTop: 8 }]}>
            Under her guidance, the team was able to effectively plan, design, and implement the project with a clear understanding of concepts and practical approaches. Her encouragement and mentorship have played a significant role in achieving the project objectives.
          </Text>
          <Text style={[styles.sectionLabel, { marginTop: 12 }]}>{t.contributionTitle}</Text>
          {[
            'Provided consistent guidance throughout the project lifecycle',
            'Assisted in design, development, and implementation',
            'Offered valuable technical insights and suggestions',
            'Encouraged a structured and practical approach to problem-solving',
          ].map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={[styles.bulletDot, { backgroundColor: '#2E7D32' }]} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Second Guide Section */}
        <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: '#F57C00' }]}>
          <Text style={styles.cardTitle}>👨‍🏫 Additional Guidance</Text>
          <View style={styles.profileSection}>
            <Image
              source={require('../../assets/nagapavan.jpeg')}
              style={styles.profileAvatar}
              resizeMode="cover"
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Mr. S. Naga Pavan Kumar Reddy</Text>
              <Text style={styles.profileRole}>ECE Lab Assistant / IOT Trainer</Text>
            </View>
          </View>
          <Text style={styles.cardText}>
            We extend our heartfelt gratitude to Mr. S. Naga Pavan Kumar Reddy for his invaluable technical support and guidance throughout the development of this project. His deep knowledge of IoT systems, sensors, and practical implementation helped the team overcome numerous technical challenges.
          </Text>
          <Text style={[styles.cardText, { marginTop: 8 }]}>
            His willingness to assist with hardware debugging, sensor calibration, and system integration proved to be a critical factor in the successful execution of the indoor navigation tracking features.
          </Text>
          <Text style={[styles.sectionLabel, { marginTop: 12 }]}>{t.contributionTitle}</Text>
          {[
            'Provided crucial technical support for IoT and sensor integration',
            'Assisted the team in hardware troubleshooting and calibration',
            'Offered innovative, practical solutions for real-time tracking issues',
            'Supported the development and testing of system performance',
          ].map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={[styles.bulletDot, { backgroundColor: '#F57C00' }]} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
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
  heroIcon: { fontSize: 40, marginBottom: 8 },
  heroTitle: { color: '#fff', fontSize: 18, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  heroSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, textAlign: 'center' },
  statRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center',
  },
  statVal: { color: '#fff', fontSize: 16, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 },
  card: {
    marginHorizontal: 16, marginBottom: 12, backgroundColor: '#fff', borderRadius: 14,
    padding: 18, borderWidth: 1, borderColor: '#f0f0f0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.primary, marginBottom: 10 },
  cardText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 22 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 8 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  bulletText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 19, flex: 1 },
  profileSection: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  profileAvatar: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#E3F2FD',
    alignItems: 'center', justifyContent: 'center',
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  profileRole: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  visionBox: {
    marginTop: 12, backgroundColor: '#f0f4ff', borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: '#d0daff',
  },
  visionLabel: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
  visionText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 19 },
  fundRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  fundChip: { borderRadius: 10, padding: 12, width: '47%' },
  fundAmount: { fontSize: 14, fontWeight: '800' },
  fundSource: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
});
