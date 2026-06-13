import { useRef, useState } from 'react';
import { View, Image, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  beforeUrl: string;
  afterUrl: string;
  showCheckerboard?: boolean;
}

/**
 * Draggable before/after comparison. The "after" image fills the frame and the
 * "before" image is overlaid and clipped to the left of the handle.
 */
export default function BeforeAfterSlider({ beforeUrl, afterUrl, showCheckerboard }: Props) {
  const [width, setWidth] = useState(0);
  const [pos, setPos] = useState(0.5); // 0..1
  const widthRef = useRef(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setWidth(w);
    widthRef.current = w;
  };

  const handleTouch = (locationX: number) => {
    const w = widthRef.current;
    if (!w) return;
    setPos(Math.min(Math.max(locationX / w, 0), 1));
  };

  const clipWidth = width * pos;

  return (
    <View
      style={styles.container}
      onLayout={onLayout}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderMove={(e) => handleTouch(e.nativeEvent.locationX)}
      onResponderGrant={(e) => handleTouch(e.nativeEvent.locationX)}
    >
      {showCheckerboard && <View style={styles.checkerboard} />}

      {/* After (full) */}
      <Image source={{ uri: afterUrl }} style={styles.image} resizeMode="contain" />

      {/* Before (clipped to left) */}
      <View style={[styles.beforeClip, { width: clipWidth }]} pointerEvents="none">
        <Image source={{ uri: beforeUrl }} style={[styles.image, { width }]} resizeMode="contain" />
      </View>

      {/* Divider + handle */}
      <View style={[styles.divider, { left: clipWidth - 1 }]} pointerEvents="none">
        <View style={styles.handle}>
          <Text style={styles.handleIcon}>◇</Text>
        </View>
      </View>

      <View style={[styles.label, styles.labelLeft]} pointerEvents="none">
        <Text style={styles.labelText}>BEFORE</Text>
      </View>
      <View style={[styles.label, styles.labelRight]} pointerEvents="none">
        <Text style={styles.labelText}>AFTER</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  checkerboard: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#2A2A33' },
  image: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  beforeClip: { position: 'absolute', top: 0, bottom: 0, left: 0, overflow: 'hidden' },
  divider: { position: 'absolute', top: 0, bottom: 0, width: 2, backgroundColor: 'rgba(255,255,255,0.85)' },
  handle: {
    position: 'absolute',
    top: '50%',
    marginTop: -16,
    marginLeft: -15,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleIcon: { color: colors.bg, fontSize: 12, fontWeight: '700' },
  label: { position: 'absolute', bottom: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
  labelLeft: { left: 10, backgroundColor: 'rgba(0,0,0,0.6)' },
  labelRight: { right: 10, backgroundColor: 'rgba(124,58,237,0.8)' },
  labelText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
