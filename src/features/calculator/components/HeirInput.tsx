/**
 * Optimized HeirInput Component with Reanimated 3
 * Features: Smooth animations, haptics, memoization, accessibility
 */

import React, { memo, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  interpolateColor,
  runOnJS
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

interface HeirInputProps {
  heirKey: string;
  label: string;
  description: string;
  max: number;
  value: number;
  onChange: (value: number) => void;
  accentColor: string;
  index: number;
  categoryExpanded?: boolean;
}

const AnimatedSurface = Animated.createAnimatedComponent(Surface);

export const HeirInput = memo(function HeirInput({
  heirKey,
  label,
  description,
  max,
  value,
  onChange,
  accentColor,
  index,
  categoryExpanded = true
}: HeirInputProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isActive = value > 0;
  
  // Shared values for smooth animations
  const scale = useSharedValue(1);
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);
  const backgroundProgress = useSharedValue(isActive ? 1 : 0);
  const elevation = useSharedValue(isActive ? 4 : 1);

  // Staggered entrance animation
  React.useEffect(() => {
    if (categoryExpanded) {
      translateY.value = withDelay(
        index * 30,
        withSpring(0, { damping: 15, stiffness: 150 })
      );
      opacity.value = withDelay(
        index * 30,
        withTiming(1, { duration: 250 })
      );
    }
  }, [categoryExpanded, index]);

  // Animate on active state change
  React.useEffect(() => {
    backgroundProgress.value = withTiming(isActive ? 1 : 0, { duration: 200 });
    elevation.value = withTiming(isActive ? 4 : 1, { duration: 200 });
  }, [isActive]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
    opacity: opacity.value,
  }));

  const animatedSurfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      backgroundProgress.value,
      [0, 1],
      [theme.colors.surface, `${accentColor}15`]
    ),
    borderColor: interpolateColor(
      backgroundProgress.value,
      [0, 1],
      [theme.colors.outline, accentColor]
    ),
  }));

  const handleIncrement = useCallback(() => {
    if (value < max) {
      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Scale animation
      scale.value = withSequence(
        withTiming(0.96, { duration: 50 }),
        withSpring(1, { damping: 10, stiffness: 400 })
      );
      
      onChange(value + 1);
      
      // Accessibility announcement
      AccessibilityInfo.announceForAccessibility(
        `${label}: ${value + 1}`
      );
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [value, max, onChange, label, scale]);

  const handleDecrement = useCallback(() => {
    if (value > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      scale.value = withSequence(
        withTiming(0.96, { duration: 50 }),
        withSpring(1, { damping: 10, stiffness: 400 })
      );
      
      onChange(value - 1);
      
      AccessibilityInfo.announceForAccessibility(
        `${label}: ${value - 1}`
      );
    }
  }, [value, onChange, label, scale]);

  const handleLongPress = useCallback((direction: 'inc' | 'dec') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    if (direction === 'inc' && value < max) {
      const newValue = Math.min(value + 5, max);
      onChange(newValue);
      
      // Pulse animation
      scale.value = withSequence(
        withTiming(1.05, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
    } else if (direction === 'dec' && value > 0) {
      const newValue = Math.max(value - 5, 0);
      onChange(newValue);
    }
  }, [value, max, onChange, scale]);

  // Memoized styles for performance
  const containerStyle = useMemo(() => [
    styles.container,
    { flex: 1, minWidth: '47%' }
  ], []);

  return (
    <Animated.View 
      style={[containerStyle, animatedContainerStyle]}
      accessible={true}
      accessibilityLabel={`${label}, ${value} ${t('heirs.count')}`}
      accessibilityHint={description}
      accessibilityRole="adjustable"
      accessibilityValue={{ min: 0, max, now: value }}
      accessibilityActions={[
        { name: 'increment' },
        { name: 'decrement' }
      ]}
      onAccessibilityAction={(event) => {
        switch (event.nativeEvent.actionName) {
          case 'increment':
            handleIncrement();
            break;
          case 'decrement':
            handleDecrement();
            break;
        }
      }}
    >
      <AnimatedSurface
        style={[styles.surface, animatedSurfaceStyle]}
        elevation={elevation}
      >
        <View style={styles.content}>
          <View style={styles.info}>
            <Text
              style={[
                styles.label,
                isActive && { color: accentColor, fontWeight: '700' }
              ]}
              variant="labelLarge"
            >
              {label}
            </Text>
            <Text 
              style={styles.description} 
              variant="bodySmall"
              numberOfLines={2}
            >
              {description}
            </Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              onPress={handleDecrement}
              onLongPress={() => handleLongPress('dec')}
              delayLongPress={400}
              style={[
                styles.button,
                { backgroundColor: isActive ? `${accentColor}20` : theme.colors.surfaceVariant }
              ]}
              disabled={value === 0}
              accessibilityLabel={t('actions.decrease')}
              accessibilityRole="button"
            >
              <Text style={[styles.buttonText, { color: accentColor }]}>−</Text>
            </TouchableOpacity>

            <View
              style={[
                styles.valueContainer,
                isActive && { backgroundColor: accentColor }
              ]}
            >
              <Text
                style={[
                  styles.value,
                  isActive && { color: '#fff', fontWeight: 'bold' }
                ]}
                variant="titleMedium"
              >
                {value}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleIncrement}
              onLongPress={() => handleLongPress('inc')}
              delayLongPress={400}
              style={[
                styles.button,
                { backgroundColor: isActive ? `${accentColor}20` : theme.colors.surfaceVariant }
              ]}
              disabled={value >= max}
              accessibilityLabel={t('actions.increase')}
              accessibilityRole="button"
            >
              <Text style={[styles.buttonText, { color: accentColor }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress indicator for max value */}
        {max > 1 && (
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill,
                { 
                  width: `${(value / max) * 100}%`,
                  backgroundColor: accentColor 
                }
              ]} 
            />
          </View>
        )}
      </AnimatedSurface>
    </Animated.View>
  );
});

// Styles
const styles = StyleSheet.create({
  container: {
    margin: 4,
  },
  surface: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  content: {
    padding: 12,
  },
  info: {
    marginBottom: 10,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  description: {
    fontSize: 11,
    lineHeight: 16,
    opacity: 0.7,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '600',
  },
  valueContainer: {
    minWidth: 48,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginTop: 8,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default HeirInput;
