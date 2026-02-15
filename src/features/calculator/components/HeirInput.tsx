import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface, IconButton, useTheme } from 'react-native-paper';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface HeirInputProps {
  heirKey: string;
  label: string;
  description: string;
  max: number;
  value: number;
  onChange: (value: number) => void;
  accentColor?: string;
}

export const HeirInput: React.FC<HeirInputProps> = ({
  heirKey,
  label,
  description,
  max,
  value,
  onChange,
  accentColor = '#1B5E20',
}) => {
  const theme = useTheme();
  const isActive = value > 0;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(isActive ? 1.02 : 1, { damping: 15 }) },
    ],
  }));

  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > 0) {
      onChange(value - 1);
    }
  };

  const handleLongPress = (direction: 'inc' | 'dec') => {
    if (direction === 'inc' && value < max) {
      onChange(Math.min(value + 5, max));
    } else if (direction === 'dec' && value > 0) {
      onChange(Math.max(value - 5, 0));
    }
  };

  return (
    <Animated.View style={[animatedStyle, { flex: 1, minWidth: '45%' }]}>
      <Surface
        style={[
          styles.container,
          isActive && {
            backgroundColor: `${accentColor}10`,
            borderColor: accentColor,
            elevation: 4,
          },
        ]}
        elevation={isActive ? 4 : 1}
      >
        <View style={styles.content}>
          <View style={styles.info}>
            <Text
              style={[
                styles.label,
                isActive && { color: accentColor, fontWeight: '700' },
              ]}
            >
              {label}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              onPress={decrement}
              onLongPress={() => handleLongPress('dec')}
              delayLongPress={300}
              style={[
                styles.button,
                { backgroundColor: isActive ? `${accentColor}20` : '#f0f0f0' },
              ]}
              disabled={value === 0}
            >
              <Text style={[styles.buttonText, { color: accentColor }]}>−</Text>
            </TouchableOpacity>

            <View
              style={[
                styles.valueContainer,
                isActive && { backgroundColor: accentColor },
              ]}
            >
              <Text
                style={[
                  styles.value,
                  isActive && { color: '#fff', fontWeight: 'bold' },
                ]}
              >
                {value}
              </Text>
            </View>

            <TouchableOpacity
              onPress={increment}
              onLongPress={() => handleLongPress('inc')}
              delayLongPress={300}
              style={[
                styles.button,
                { backgroundColor: isActive ? `${accentColor}20` : '#f0f0f0' },
              ]}
              disabled={value >= max}
            >
              <Text style={[styles.buttonText, { color: accentColor }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Surface>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 4,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
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
    color: '#1a1a1a',
    marginBottom: 2,
  },
  description: {
    fontSize: 10,
    color: '#757575',
    lineHeight: 14,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  valueContainer: {
    minWidth: 44,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});

export default HeirInput;
