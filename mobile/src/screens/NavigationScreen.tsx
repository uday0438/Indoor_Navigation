// ═══════════════════════════════════════════
// Navigation Screen — Professional Version
// ═══════════════════════════════════════════
import React, { useState, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar, SafeAreaView, Modal, Animated, ScrollView, PanResponder } from 'react-native';
import Svg, { Rect, Circle, Line, G, Text as SvgText, Path } from 'react-native-svg';
import { useNavigation as useRNNav } from '@react-navigation/native';
import { useNavStore } from '../store/navigationStore';
import { useNavigation } from '../hooks/useNavigation';
import { COLORS, FLOOR_NAMES } from '../utils/constants';
import { TRANSLATE } from '../utils/translation';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const TYPE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  classroom:  { bg: '#E8F5E9', border: '#43A047', text: '#2E7D32' },
  lab:        { bg: '#E3F2FD', border: '#1E88E5', text: '#1565C0' },
  office:     { bg: '#FFF3E0', border: '#FB8C00', text: '#E65100' },
  auditorium: { bg: '#F3E5F5', border: '#8E24AA', text: '#6A1B9A' },
  library:    { bg: '#FCE4EC', border: '#D81B60', text: '#AD1457' },
  stairs:     { bg: '#ECEFF1', border: '#78909C', text: '#37474F' },
  entrance:   { bg: '#E0F7FA', border: '#00ACC1', text: '#006064' },
  room:       { bg: '#FFFDE7', border: '#FDD835', text: '#F9A825' },
  corridor:   { bg: '#F5F5F5', border: '#E0E0E0', text: '#9E9E9E' },
};

export default function NavigationScreen() {
  const rnNav = useRNNav<any>();
  const { stopNavigation } = useNavigation();
  const {
    navState, route, currentFloor, setCurrentFloor,
    userPosition, currentStepIndex, destination, floors, locations,
    isMuted, setIsMuted, voiceLanguage, setVoiceLanguage
  } = useNavStore();

  const [scale, setScale] = useState(1.2);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [showAllSteps, setShowAllSteps] = useState(false);

  const handleLanguageToggle = () => {
    if (voiceLanguage === 'en') setVoiceLanguage('hi');
    else if (voiceLanguage === 'hi') setVoiceLanguage('te');
    else setVoiceLanguage('en');
  };

  // Allow panning map manually
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => {
        return Math.abs(gs.dx) > 5 || Math.abs(gs.dy) > 5;
      },
      onPanResponderMove: (e, gs) => {
        if (e.nativeEvent.touches.length === 1) {
          setOffsetX(ov => ov - gs.dx * (0.015 / scale));
          setOffsetY(ov => ov - gs.dy * (0.015 / scale));
        }
      },
    })
  ).current;

  const activeFloor = floors.find((f) => f.floorNumber === currentFloor);
  const mapW = activeFloor?.width || 105;
  const mapH = activeFloor?.height || 90;

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.3, 4));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.3, 0.6));

  const floorLocs = useMemo(() =>
    locations ? locations.filter((l) => l.floor === currentFloor) : [],
    [locations, currentFloor]
  );

  const floorRooms = floorLocs.filter(l => l.type !== 'corridor' && l.type !== 'stairs' && l.type !== 'lift' && l.type !== 'entrance');

  const floorPath = useMemo(() => {
    if (!route) return [];
    return route.path.filter((n) => n.floor === currentFloor);
  }, [route, currentFloor]);

  const currentStep = route?.steps?.[currentStepIndex];

  // Dynamic ViewBox
  const vB = useMemo(() => {
    const x = (mapW/2 - (mapW/2)/scale) + offsetX;
    const y = (mapH/2 - (mapH/1.6)/scale) + offsetY;
    const w = mapW/scale;
    const h = mapH/scale;
    return `${x} ${y} ${w} ${h}`;
  }, [scale, offsetX, offsetY, mapW, mapH]);

  const getUserRotation = () => {
    return userPosition?.heading ? (userPosition.heading * 180 / Math.PI) : 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header with Destination Info */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerLabel}>NAVIGATING TO</Text>
          <Text style={styles.headerTitle}>{destination?.label || destination?.name || 'Destination'}</Text>
        </View>
        <TouchableOpacity style={styles.exitButton} onPress={() => { stopNavigation(); rnNav.goBack(); }}>
          <Ionicons name="close-circle" size={24} color="#fff" />
          <Text style={styles.exitText}>Exit</Text>
        </TouchableOpacity>
      </View>

      {/* Floor Selector Chip Row */}
      <View style={styles.floorContainer}>
        {floors.map((f) => (
          <TouchableOpacity 
            key={f.floorNumber} 
            style={[styles.floorChip, currentFloor === f.floorNumber && styles.floorChipActive]} 
            onPress={() => setCurrentFloor(f.floorNumber)}
          >
            <Text style={[styles.floorChipText, currentFloor === f.floorNumber && styles.floorChipTextActive]}>
              {f.shortName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Map Content Area */}
      <View style={styles.mapContainer} {...panResponder.panHandlers}>
        <Svg 
          width={SCREEN_W} 
          height={SCREEN_H * 0.6} 
          viewBox={vB}
        >
          <G>
            {/* Floor Background/Base */}
            <Rect x={0} y={0} width={mapW} height={mapH} fill="#f8fafc" stroke="#E2E8F0" strokeWidth={0.2} />
            
            {/* Grid Lines */}
            <Path 
              d={`M0 ${mapH/2} L${mapW} ${mapH/2} M${mapW/2} 0 L${mapW/2} ${mapH}`} 
              stroke="rgba(0,0,0,0.03)" 
              strokeWidth={0.5} 
            />

            {/* Corridor rendering */}
            {floorLocs.filter(l => l.type === 'corridor').map(c => (
               <Rect key={c.locationId} x={c.x-3} y={c.y-3} width={6} height={6} fill="#F1F5F9" />
            ))}

            {/* Room Shapes */}
            {floorRooms.map((room) => {
              const c = TYPE_COLORS[room.type] || TYPE_COLORS.room;
              return (
                <G key={room.locationId}>
                  <Rect 
                    x={room.x - 4} 
                    y={room.y - 3} 
                    width={8} 
                    height={6} 
                    rx={0.5} 
                    fill={c.bg} 
                    stroke={c.border} 
                    strokeWidth={0.15} 
                  />
                  <SvgText 
                    x={room.x} 
                    y={room.y} 
                    textAnchor="middle" 
                    alignmentBaseline="central" 
                    fontSize={1.3} 
                    fontWeight="700"
                    fill={c.text}
                  >
                    {room.label || room.name}
                  </SvgText>
                </G>
              );
            })}

            {/* Path Line */}
            {floorPath.length > 1 && floorPath.map((node, i) => {
              if (i === 0) return null;
              const prev = floorPath[i - 1];
              return (
                <Line 
                  key={i} 
                  x1={prev.x} y1={prev.y} 
                  x2={node.x} y2={node.y} 
                  stroke={COLORS.accent} 
                  strokeWidth={1.5} 
                  strokeLinecap="round" 
                  strokeDasharray="2.5, 1.5"
                />
              );
            })}

            {/* Destination Marker 📍 */}
            {destination && destination.floor === currentFloor && (
              <G transform={`translate(${destination.x}, ${destination.y - 2})`}>
                <Circle r={1} fill="#EF4444" />
                <SvgText x={0} y={0} textAnchor="middle" fontSize={4}>📍</SvgText>
              </G>
            )}

            {/* Moving User Dot (Blue Dot) 🔵 */}
            {userPosition && userPosition.floor === currentFloor && (
              <G transform={`translate(${userPosition.x}, ${userPosition.y}) rotate(${getUserRotation()})`}>
                {/* Glow effect */}
                <Circle r={4} fill="rgba(37, 99, 235, 0.15)" />
                {/* Core dot */}
                <Circle r={1.6} fill="#2563EB" stroke="#FFFFFF" strokeWidth={0.3} />
                {/* Direction pointer arrow */}
                <Path d="M0 -3.5 L2 -0.5 L-2 -0.5 Z" fill="#2563EB" />
              </G>
            )}
          </G>
        </Svg>

        {/* Zoom Controls Overlay - NOW AT BOTTOM LEFT */}
        <View style={styles.leftBottomControls}>
          <TouchableOpacity style={styles.voiceBtn} onPress={() => setIsMuted(!isMuted)}>
            <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={22} color={isMuted ? COLORS.error : COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.voiceBtn} onPress={handleLanguageToggle}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.primary }}>
              {voiceLanguage === 'en' ? 'ENG' : voiceLanguage === 'hi' ? 'HIN' : 'TEL'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.zoomControlsContainer}>
            <TouchableOpacity style={styles.zoomBtnSmall} onPress={handleZoomIn}>
              <Ionicons name="add" size={20} color="#334155" />
            </TouchableOpacity>
            <View style={styles.zoomDividerH} />
            <TouchableOpacity style={styles.zoomBtnSmall} onPress={handleZoomOut}>
              <Ionicons name="remove" size={20} color="#334155" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Instruction Card at Bottom */}
      <View style={[styles.instructionCard, showAllSteps && { height: SCREEN_H * 0.45 }]}>
        <View style={styles.instructionHeader}>
          <View style={styles.instructionIconContainer}>
            <MaterialCommunityIcons 
              name={currentStep?.icon as any || 'map-marker-distance'} 
              size={32} 
              color={COLORS.accent} 
            />
          </View>
          <View style={styles.instructionTextContainer}>
            <Text style={styles.instructionDistance}>
               {navState === 'arrived' ? '0' : (currentStep?.distance || '...') } {voiceLanguage === 'en' ? 'meters' : (voiceLanguage === 'hi' ? 'मीटर' : 'మీటర్లు')}
            </Text>
            <Text style={styles.instructionText} numberOfLines={2}>
              {TRANSLATE(navState === 'arrived' ? 'Goal Reached!' : (currentStep?.text || 'Searching...'), voiceLanguage)}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.expandBtn} 
            onPress={() => setShowAllSteps(!showAllSteps)}
          >
            <Ionicons name={showAllSteps ? "chevron-down" : "chevron-up"} size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {showAllSteps ? (
          <ScrollView style={styles.stepsList} showsVerticalScrollIndicator={false}>
            {route?.steps.map((step, i) => (
              <View key={i} style={[styles.stepItem, i < currentStepIndex && styles.stepDone]}>
                <MaterialCommunityIcons 
                  name={step.icon as any || 'circle-outline'} 
                  size={20} 
                  color={i < currentStepIndex ? COLORS.success : i === currentStepIndex ? COLORS.accent : COLORS.textMuted} 
                />
                <Text style={[styles.stepItemText, i === currentStepIndex && styles.stepItemActive]}>
                  {TRANSLATE(step.text, voiceLanguage)}
                </Text>
                <Text style={styles.stepItemDist}>{step.distance}{voiceLanguage === 'en' ? 'm' : (voiceLanguage === 'hi' ? 'मी' : 'మీ')}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${(currentStepIndex+1) / (route?.steps.length || 1) * 100}%` }]} />
          </View>
        )}
      </View>
      {/* Arrival Celebration Modal */}
      <Modal visible={navState === 'arrived'} transparent animationType="fade">
        <View style={styles.celebrationOverlay}>
          <Animated.View style={styles.celebrationContent}>
            <View style={styles.celebrationIconBg}>
              <Text style={{ fontSize: 60 }}>🎉</Text>
            </View>
            <Text style={styles.celebrationTitle}>Goal Reached!</Text>
            <Text style={styles.celebrationSub}>You have successfully arrived at</Text>
            <Text style={styles.celebrationDest}>{destination?.label || destination?.name}</Text>
            
            <View style={styles.celebrationStats}>
              <View style={styles.statBox}>
                <Ionicons name="walk" size={24} color={COLORS.primary} />
                <Text style={styles.statText}>Safe Journey</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.doneBtn} 
              onPress={() => { stopNavigation(); rnNav.navigate('Home'); }}
            >
              <Text style={styles.doneBtnText}>Back to Home</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    height: 90, 
    backgroundColor: COLORS.primary, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
  },
  headerInfo: { flex: 1 },
  headerLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9, letterSpacing: 1.5, fontWeight: '700', marginBottom: 2 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  exitButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.12)', 
    paddingVertical: 7, 
    paddingHorizontal: 10, 
    borderRadius: 12,
    gap: 5
  },
  exitText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  
  floorContainer: { 
    flexDirection: 'row', 
    padding: 12, 
    justifyContent: 'center',
    gap: 8
  },
  floorChip: { 
    backgroundColor: '#FFFFFF', 
    paddingHorizontal: 14, 
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  floorChipActive: { 
    backgroundColor: COLORS.accent, 
    borderColor: COLORS.accent 
  },
  floorChipText: { color: '#64748B', fontWeight: '700', fontSize: 12 },
  floorChipTextActive: { color: '#FFFFFF' },

  mapContainer: { 
    flex: 1, 
    marginHorizontal: 15, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 24, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 4,
    position: 'relative'
  },
  leftBottomControls: {
    position: 'absolute',
    left: 15,
    bottom: 15,
    gap: 10
  },
  voiceBtn: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4,
  },
  zoomControlsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  zoomBtnSmall: { padding: 10 },
  zoomDividerH: { height: 1, backgroundColor: '#F1F5F9' },

  instructionCard: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    borderRadius: 24,
    padding: 18,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  instructionHeader: { flexDirection: 'row', alignItems: 'center' },
  instructionIconContainer: { 
    width: 54, 
    height: 54, 
    borderRadius: 14, 
    backgroundColor: '#F8FAFC', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginRight: 14
  },
  instructionTextContainer: { flex: 1 },
  instructionDistance: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  instructionText: { fontSize: 14, color: '#64748B', fontWeight: '600', marginTop: 2 },
  expandBtn: { padding: 8 },
  
  stepsList: { marginTop: 15, maxHeight: 250 },
  stepItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#F1F5F9' },
  stepDone: { opacity: 0.4 },
  stepItemActive: { color: COLORS.accent, fontWeight: '700' },
  stepItemText: { flex: 1, marginLeft: 12, fontSize: 13, color: '#334155' },
  stepItemDist: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },

  progressBarBg: { height: 5, backgroundColor: '#F1F5F9', borderRadius: 3, marginTop: 15, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 3 },

  celebrationOverlay: {
    flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.85)', justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  celebrationContent: {
    width: '100%', backgroundColor: '#FFFFFF', borderRadius: 32, padding: 30, alignItems: 'center', elevation: 20,
  },
  celebrationIconBg: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: '#F0F9FF', justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    borderWidth: 2, borderColor: '#BAE6FD',
  },
  celebrationTitle: { fontSize: 28, fontWeight: '900', color: COLORS.primary, marginBottom: 8 },
  celebrationSub: { fontSize: 14, color: COLORS.textMuted },
  celebrationDest: { fontSize: 18, fontWeight: '700', color: COLORS.accent, marginTop: 4, textAlign: 'center' },
  celebrationStats: { flexDirection: 'row', marginTop: 25, gap: 15 },
  statBox: { backgroundColor: '#F1F5F9', padding: 15, borderRadius: 16, alignItems: 'center', minWidth: 100 },
  statText: { fontSize: 12, fontWeight: '700', color: COLORS.primary, marginTop: 5 },
  doneBtn: { backgroundColor: COLORS.primary, width: '100%', paddingVertical: 16, borderRadius: 16, marginTop: 30, alignItems: 'center' },
  doneBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});

