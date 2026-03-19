import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS, BORDER_RADIUS } from '../constants/theme';

export const AnimatedLogo = ({ size = 80, containerStyle = {} }) => {
  // Outer square (white) - clockwise rotation
  const outerRotation = useSharedValue(0);
  // Inner square (orange) - counter-clockwise rotation
  const innerRotation = useSharedValue(0);

  useEffect(() => {
    // Outer square: slow rotation (8 seconds per full rotation)
    outerRotation.value = withRepeat(
      withTiming(360, {
        duration: 8000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // Inner square: faster rotation in opposite direction (4 seconds per full rotation)
    innerRotation.value = withRepeat(
      withTiming(-360, {
        duration: 4000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  // Animated style for outer square
  const outerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${outerRotation.value}deg` }],
    };
  });

  // Animated style for inner square
  const innerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${innerRotation.value}deg` }],
    };
  });

  const outerSize = size;
  const innerSize = size * 0.5; // Inner square is 50% of outer square

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Outer white square */}
      <Animated.View
        style={[
          styles.square,
          {
            width: outerSize,
            height: outerSize,
            borderRadius: BORDER_RADIUS.SM,
          },
          outerAnimatedStyle,
        ]}
      >
        {/* Inner orange square */}
        <Animated.View
          style={[
            styles.innerSquare,
            {
              width: innerSize,
              height: innerSize,
              borderRadius: BORDER_RADIUS.SM * 0.5,
            },
            innerAnimatedStyle,
          ]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {
    backgroundColor: COLORS.GLOW_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    // Glassmorphism effect
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: COLORS.PRIMARY_ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  innerSquare: {
    backgroundColor: COLORS.PRIMARY_ORANGE,
    borderWidth: 1,
    borderColor: 'rgba(255, 140, 0, 0.3)',
    shadowColor: COLORS.PRIMARY_ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
});
