import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from '../constants/theme';

export const GlassCard = ({
  children,
  style = {},
  intensity = 'medium',
  padding = SPACING.LG,
  glowEffect = false,
}) => {
  const intensityMap = {
    light: 0.08,
    medium: 0.15,
    strong: 0.25,
  };

  const glowColor = glowEffect ? COLORS.PRIMARY_ORANGE : 'transparent';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `rgba(10, 14, 39, ${intensityMap[intensity]})`,
          padding,
          borderColor: `rgba(255, 255, 255, ${intensityMap[intensity] * 2})`,
          shadowColor: glowEffect ? glowColor : '#000000',
          shadowOpacity: glowEffect ? 0.4 : 0.15,
        },
        SHADOWS.SOFT,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.LG,
    borderWidth: 1,
    backdropFilter: 'blur(20px)',
    // For web (will be ignored on native)
    WebkitBackdropFilter: 'blur(20px)',
  },
});

export const GlassButton = ({
  children,
  onPress,
  disabled = false,
  style = {},
  textStyle = {},
  glowEffect = true,
}) => {
  return (
    <View
      style={[
        styles.buttonContainer,
        {
          opacity: disabled ? 0.5 : 1,
        },
        glowEffect && styles.buttonGlow,
        style,
      ]}
    >
      <View
        style={[
          styles.button,
          glowEffect ? styles.buttonOrange : styles.buttonGray,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const buttonStyles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.MD,
    overflow: 'hidden',
  },
  buttonContainer: {
    borderRadius: BORDER_RADIUS.MD,
    overflow: 'hidden',
  },
  buttonGlow: {
    shadowColor: COLORS.PRIMARY_ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  button: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonOrange: {
    backgroundColor: COLORS.PRIMARY_ORANGE,
    borderColor: 'rgba(255, 140, 0, 0.3)',
  },
  buttonGray: {
    backgroundColor: COLORS.DARK_GRAY,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});

Object.assign(styles, buttonStyles);
