// ═══════════════════════════════════════════
// Map Screen — Interactive floor maps + navigation
// ═══════════════════════════════════════════
import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  StyleSheet, FlatList, Dimensions, StatusBar, Animated, PanResponder
} from 'react-native';
import Svg, { Rect, Circle, Line, Text as SvgText, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useNavigation as useRNNav, useRoute } from '@react-navigation/native';
import { useNavStore } from '../store/navigationStore';
import { useNavigation } from '../hooks/useNavigation';
import { COLORS, FLOOR_SHORT } from '../utils/constants';
import { MapLocation } from '../types';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Room type color map
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
  washroom:   { bg: '#F3E5F5', border: '#AB47BC', text: '#7B1FA2' },
  store:      { bg: '#EFEBE9', border: '#8D6E63', text: '#4E342E' },
};

export default function MapScreen() {
  const rnNav = useRNNav<any>();
  const rnRoute = useRoute<any>();
  const { startNavigation } = useNavigation();
  const {
    currentFloor, setCurrentFloor, locations, floors,
    userPosition, route, navState,
  } = useNavStore();
  
  // ─── ZOOM & PAN STATE ───
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const lastDist = useRef(0);
  const isPinching = useRef(false);

  const [fromRoom, setFromRoom] = useState<MapLocation | null>(null);
  const [toRoom, setToRoom] = useState<MapLocation | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchMode, setSearchMode] = useState<'from' | 'to'>('from');
  const [searchText, setSearchText] = useState('');

  // ─── PINCH ZOOM & PAN ───
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        isPinching.current = false;
        lastDist.current = 0;
      },
      onPanResponderMove: (e, gs) => {
        const { touches } = e.nativeEvent;
        if (touches.length === 2) {
          isPinching.current = true;
          const touch1 = touches[0];
          const touch2 = touches[1];
          const dist = Math.sqrt(
            Math.pow(touch2.locationX - touch1.locationX, 2) +
            Math.pow(touch2.locationY - touch1.locationY, 2)
          );
          if (lastDist.current > 0) {
            const diff = dist - lastDist.current;
            setZoom(z => Math.max(1, Math.min(5, z + diff * 0.01)));
          }
          lastDist.current = dist;
        } else if (touches.length === 1 && !isPinching.current) {
          setOffsetX(ov => ov - gs.dx * (0.05 / zoom));
          setOffsetY(ov => ov - gs.dy * (0.05 / zoom));
        }
      },
    })
  ).current;

  // Handle prefill from Quick Navigate chips
  React.useEffect(() => {
    if (locations.length > 0 && rnRoute.params?.prefillDestination) {
      const destQuery = rnRoute.params.prefillDestination.toLowerCase();
      // Match exactly or closely
      const match = locations.find(l => 
        l.name.toLowerCase() === destQuery ||
        l.name.toLowerCase().includes(destQuery) ||
        l.locationId.toLowerCase().includes(destQuery) ||
        (l.type && l.type.toLowerCase().includes(destQuery))
      );
      if (match) {
        setToRoom(match);
      }
    }
  }, [locations, rnRoute.params]);

  const floorLocs = useMemo(() =>
    locations.filter((l) => l.floor === currentFloor && l.type !== 'corridor'),
    [locations, currentFloor]
  );

  const activeFloor = floors.find((f) => f.floorNumber === currentFloor);
  const mapW = activeFloor?.width || 105;
  const mapH = activeFloor?.height || 90;

  // Calculate dynamic viewBox
  const viewBox = useMemo(() => {
    // Current width/height based on zoom
    const w = (mapW + 6) / zoom;
    const h = (mapH + 6) / zoom;
    // Top-left corner: center - half-width + offset
    const x = (mapW / 2) - (w / 2) + offsetX;
    const y = (mapH / 2) - (h / 2) + offsetY;
    return `${x} ${y} ${w} ${h}`;
  }, [zoom, offsetX, offsetY, mapW, mapH]);

  const handleZoomIn = () => setZoom(z => Math.min(4, z + 0.5));
  const handleZoomOut = () => setZoom(z => Math.max(1, z - 0.5));
  const handleReset = () => { setZoom(1); setOffsetX(0); setOffsetY(0); };

  // Search filter
  const filtered = useMemo(() => {
    if (!searchText.trim()) return locations.filter((l) => l.type !== 'corridor');
    const q = searchText.toLowerCase();
    return locations.filter((l) =>
      l.type !== 'corridor' && (
        l.name.toLowerCase().includes(q) ||
        (l.label && l.label.toLowerCase().includes(q))
      )
    );
  }, [searchText, locations]);

  const handleRoomTap = useCallback((room: MapLocation) => {
    if (!fromRoom) {
      setFromRoom(room);
    } else if (!toRoom && room.locationId !== fromRoom.locationId) {
      setToRoom(room);
    } else {
      setFromRoom(room);
      setToRoom(null);
    }
  }, [fromRoom, toRoom]);

  const handleGo = useCallback(async () => {
    if (!fromRoom || !toRoom) return;
    const success = await startNavigation(fromRoom, toRoom);
    if (success) {
      rnNav.navigate('ActiveNavigation');
    } else {
      alert("Failed to connect to navigation server. Please try again.");
    }
  }, [fromRoom, toRoom, startNavigation, rnNav]);

  const selectFromSearch = (room: MapLocation) => {
    if (searchMode === 'from') {
      setFromRoom(room);
      setCurrentFloor(room.floor);
    } else {
      setToRoom(room);
    }
    setShowSearch(false);
    setSearchText('');
  };

  // Route path on current floor — corridors only, skip room start/end
  const routePathOnFloor = useMemo(() => {
    if (!route) return [];
    let path = (route.path as any[]).filter((n) => n.floor === currentFloor);
    while (path.length > 0 && path[0].type !== 'corridor' && path[0].type !== 'stairs' && path[0].type !== 'entrance') {
      path = path.slice(1);
    }
    while (path.length > 0 && path[path.length - 1].type !== 'corridor' && path[path.length - 1].type !== 'stairs' && path[path.length - 1].type !== 'entrance') {
      path = path.slice(0, -1);
    }
    return path;
  }, [route, currentFloor]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Indoor Map</Text>
        <View style={styles.floorChips}>
          {floors.map((f) => (
            <TouchableOpacity
              key={f.floorNumber}
              style={[styles.floorChip, currentFloor === f.floorNumber && styles.floorChipActive]}
              onPress={() => { setCurrentFloor(f.floorNumber); handleReset(); }}
            >
              <Text style={[styles.floorChipText, currentFloor === f.floorNumber && styles.floorChipTextActive]}>
                {f.shortName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Route planner */}
      <View style={styles.planner}>
        <View style={styles.plannerDots}>
          <View style={[styles.dot, { backgroundColor: COLORS.accent }]} />
          <View style={styles.dotLine} />
          <View style={[styles.dot, { backgroundColor: COLORS.error }]} />
        </View>
        <View style={styles.plannerInputs}>
          <TouchableOpacity
            style={[styles.plannerInput, fromRoom && styles.plannerInputActive]}
            onPress={() => { setSearchMode('from'); setShowSearch(true); }}
          >
            <Text style={fromRoom ? styles.plannerInputTextActive : styles.plannerInputText}>
              {fromRoom ? (fromRoom.label || fromRoom.name) : 'Select start...'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.plannerInput, toRoom && styles.plannerInputActiveTo]}
            onPress={() => { setSearchMode('to'); setShowSearch(true); }}
          >
            <Text style={toRoom ? styles.plannerInputTextActiveTo : styles.plannerInputText}>
              {toRoom ? (toRoom.label || toRoom.name) : 'Select destination...'}
            </Text>
          </TouchableOpacity>
        </View>
        {fromRoom && toRoom && (
          <TouchableOpacity style={styles.goBtn} onPress={handleGo}>
            <Text style={styles.goBtnText}>GO</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SVG Map */}
      <View style={styles.mapContainer} {...panResponder.panHandlers}>
        <Svg
          width={SCREEN_W}
          height={SCREEN_H - 280}
          viewBox={viewBox}
        >
          {/* Grid */}
          <Rect x={-3} y={-3} width={mapW + 6} height={mapH + 6} fill="#f0f2f5" />
          <Rect x={0} y={0} width={mapW} height={mapH} fill="none" stroke="#ccc" strokeWidth={0.3} />

          {/* Rooms */}
          {floorLocs.map((room) => {
            const c = TYPE_COLORS[room.type] || TYPE_COLORS.room;
            const isFrom = fromRoom?.locationId === room.locationId;
            const isTo = toRoom?.locationId === room.locationId;
            const label = room.label || room.name;
            // Rooms without explicit dimensions get default sizing
            const w = 9; const h = 7;

            return (
              <G key={room.locationId} onPress={() => handleRoomTap(room)}>
                <Rect
                  x={room.x - w / 2} y={room.y - h / 2}
                  width={w} height={h} rx={0.3}
                  fill={isFrom ? '#BBDEFB' : isTo ? '#C8E6C9' : c.bg}
                  stroke={isFrom ? '#1565C0' : isTo ? '#2E7D32' : c.border}
                  strokeWidth={isFrom || isTo ? 0.5 : 0.2}
                />
                {(() => {
                  const parts = label.split(' ');
                  // Heuristic for split: If total length > 8 and has space, split into two lines
                  const shouldSplit = label.length > 8 && parts.length >= 2;
                  const line1 = shouldSplit ? parts.slice(0, Math.ceil(parts.length / 2)).join(' ') : label;
                  const line2 = shouldSplit ? parts.slice(Math.ceil(parts.length / 2)).join(' ') : '';
                  
                  // Scale font: Smaller for longer words
                  const maxWordLength = Math.max(...parts.map(p => p.length), 5);
                  const baseSize = shouldSplit ? 1.4 : 1.6;
                  const fontSize = Math.min(baseSize, (w * 0.8) / (maxWordLength * 0.6));

                  return (
                    <G>
                      <SvgText
                        x={room.x} y={shouldSplit ? room.y - 0.8 : room.y}
                        textAnchor="middle" alignmentBaseline="central"
                        fill={c.text} fontSize={fontSize} fontWeight="700"
                      >
                        {line1}
                      </SvgText>
                      {shouldSplit && (
                        <SvgText
                          x={room.x} y={room.y + 1.2}
                          textAnchor="middle" alignmentBaseline="central"
                          fill={c.text} fontSize={fontSize} fontWeight="700"
                        >
                          {line2}
                        </SvgText>
                      )}
                    </G>
                  );
                })()}
              </G>
            );
          })}

          {/* Route polyline */}
          {routePathOnFloor.length > 1 && routePathOnFloor.map((node, i) => {
            if (i === 0) return null;
            const prev = routePathOnFloor[i - 1];
            return (
              <Line
                key={`route-${i}`}
                x1={prev.x} y1={prev.y}
                x2={node.x} y2={node.y}
                stroke={COLORS.accent}
                strokeWidth={1.2}
                strokeDasharray="3,1.5"
                strokeLinecap="round"
              />
            );
          })}

          {/* User position blue dot */}
          {userPosition && userPosition.floor === currentFloor && (
            <G>
              <Circle
                cx={userPosition.x} cy={userPosition.y}
                r={userPosition.accuracy * 1.5}
                fill="rgba(33,150,243,0.1)"
              />
              <Circle
                cx={userPosition.x} cy={userPosition.y}
                r={1.8} fill={COLORS.accent} stroke="white" strokeWidth={0.5}
              />
            </G>
          )}

          {/* Destination marker */}
          {toRoom && toRoom.floor === currentFloor && (
            <G>
              <Circle cx={toRoom.x} cy={toRoom.y - 5} r={2} fill={COLORS.error} />
              <SvgText
                x={toRoom.x} y={toRoom.y - 4.5}
                textAnchor="middle" alignmentBaseline="central"
                fill="white" fontSize={2} fontWeight="bold"
              >📍</SvgText>
            </G>
          )}
        </Svg>
        
        {/* Zoom Controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomBtn} onPress={handleZoomIn}>
            <Text style={styles.zoomBtnText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomBtn} onPress={handleZoomOut}>
            <Text style={styles.zoomBtnText}>−</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.zoomBtn, { marginTop: 10 }]} onPress={handleReset}>
            <Text style={{ fontSize: 18 }}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Info bar */}
      {fromRoom && !toRoom && (
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>Now select a destination</Text>
          <TouchableOpacity onPress={() => { setFromRoom(null); setToRoom(null); }}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search overlay */}
      {showSearch && (
        <View style={styles.searchOverlay}>
          <View style={styles.searchHeader}>
            <TouchableOpacity onPress={() => setShowSearch(false)}>
              <Text style={styles.searchBack}>←</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder={searchMode === 'from' ? 'Search start...' : 'Search destination...'}
              autoFocus
            />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.locationId}
            renderItem={({ item }) => {
              const c = TYPE_COLORS[item.type] || TYPE_COLORS.room;
              const floorName = floors.find((f) => f.floorNumber === item.floor)?.name || '';
              return (
                <TouchableOpacity
                  style={[styles.searchItem, { borderLeftColor: c.border }]}
                  onPress={() => selectFromSearch(item)}
                >
                  <View>
                    <Text style={styles.searchItemName}>{item.label || item.name}</Text>
                    <Text style={styles.searchItemFloor}>
                      {floorName}{item.label ? ` • ${item.name}` : ''}
                    </Text>
                  </View>
                  <Text style={[styles.searchItemType, { color: c.text, backgroundColor: c.bg }]}>
                    {item.type}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary, paddingTop: 50,
    paddingBottom: 12, paddingHorizontal: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  floorChips: { flexDirection: 'row', gap: 4 },
  floorChip: {
    width: 32, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  floorChipActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  floorChipText: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700' },
  floorChipTextActive: { color: '#fff' },
  planner: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  plannerDots: { alignItems: 'center', marginRight: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotLine: { width: 2, height: 20, backgroundColor: '#e0e0e0' },
  plannerInputs: { flex: 1, gap: 6 },
  plannerInput: {
    padding: 10, borderWidth: 1, borderColor: '#e0e0e0',
    borderRadius: 8, backgroundColor: '#fff',
  },
  plannerInputActive: { borderColor: COLORS.accent, backgroundColor: '#E3F2FD' },
  plannerInputActiveTo: { borderColor: COLORS.success, backgroundColor: '#E8F5E9' },
  plannerInputText: { color: COLORS.textMuted, fontSize: 13 },
  plannerInputTextActive: { color: COLORS.accent, fontSize: 13, fontWeight: '600' },
  plannerInputTextActiveTo: { color: COLORS.success, fontSize: 13, fontWeight: '600' },
  goBtn: {
    marginLeft: 10, backgroundColor: COLORS.primary,
    paddingHorizontal: 18, paddingVertical: 20, borderRadius: 10,
  },
  goBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  mapContainer: { flex: 1, backgroundColor: '#f0f2f5', overflow: 'hidden' },
  infoBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    padding: 12, backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#eee',
  },
  infoText: { fontSize: 13, color: COLORS.textSecondary },
  zoomControls: {
    position: 'absolute', bottom: 20, right: 20, gap: 10,
  },
  zoomBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
  zoomBtnText: { fontSize: 24, fontWeight: '700', color: COLORS.primary },
  clearText: { fontSize: 13, color: COLORS.error, fontWeight: '600' },
  searchOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: '#fff', zIndex: 100,
  },
  searchHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  searchBack: { fontSize: 22, color: COLORS.textPrimary },
  searchInput: {
    flex: 1, padding: 10, borderWidth: 1, borderColor: '#e0e0e0',
    borderRadius: 8, fontSize: 14,
  },
  searchItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, marginHorizontal: 16, marginTop: 4,
    backgroundColor: '#fafafa', borderRadius: 8,
    borderLeftWidth: 3,
  },
  searchItemName: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  searchItemFloor: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  searchItemType: {
    fontSize: 9, fontWeight: '700', paddingHorizontal: 8,
    paddingVertical: 2, borderRadius: 4, textTransform: 'uppercase',
  },
});
