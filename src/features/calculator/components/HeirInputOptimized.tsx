import React, { memo, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withSequence,
  withTiming 
} from 'react-native-reanimated';
import { Text, Surface } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

interface Props {
  heirKey: string;
  label: string;
  description: string;
  max: number;
  value: number;
  onChange: (value: number) => void;
  accentColor: string;
  index: number; // For staggered animations
}

export const HeirInputOptimized = memo(function HeirInput({
  heirKey,
  label,
  description,
  max,
  value,
  onChange,
  accentColor,
  index
}: Props) {
  const isActive = value > 0;
  const scale = useSharedValue(1);
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);
  
  // Staggered entrance animation
  React.useEffect(() => {
    translateY.value = withDelay(
      index * 50,
      withSpring(0, { damping: 15 })
    );
    opacity.value = withDelay(
      index * 50,
      withTiming(1, { duration: 300 })
    );
  }, [index]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
    opacity: opacity.value,
  }));
  
  const handleIncrement = useCallback(() => {
    if (value < max) {
      scale.value = withSequence(
        withTiming(0.95, { duration: 50 }),
        withSpring(1, { damping: 10 })
      );
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(value + 1);
    }
  }, [value, max, onChange]);
  
  const handleDecrement = useCallback(() => {
    if (value > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(value - 1);
    }
  }, [value, onChange]);
  
  // Render optimized with reanimated
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Surface style={[styles.surface, isActive && { borderColor: accentColor }]}>
        {/* Optimized content */}
      </Surface>
    </Animated.View>
  );
});
