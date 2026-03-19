import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { COLORS, SPACING, BORDER_RADIUS, Typography } from '../constants/theme';
import Animated as RNAnimated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export const NeonLink = ({ onDetectUrl = null, onExpandedChange = null }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [idleMode, setIdleMode] = useState('triangle'); // triangle, dots, clock, date, custom
  const [detectedContent, setDetectedContent] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  // Position state
  const panX = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;

  // Animation values
  const pulseAnimation = useSharedValue(0);
  const expandAnimation = useSharedValue(0);

  // Set up pulsing animation for idle mode
  useEffect(() => {
    pulseAnimation.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  // Clipboard listener
  useEffect(() => {
    const clipboardListener = setInterval(async () => {
      try {
        const clipboard = await Clipboard.getStringAsync();
        // Check if it's a URL
        if (
          clipboard &&
          (clipboard.startsWith('http://') ||
            clipboard.startsWith('https://') ||
            clipboard.includes('youtube.com') ||
            clipboard.includes('instagram.com') ||
            clipboard.includes('tiktok.com'))
        ) {
          // Detect URL type and size
          const type = detectContentType(clipboard);
          const size = await estimateSize(clipboard);
          setDetectedContent({ url: clipboard, type, size });
          setIsExpanded(true);
          onExpandedChange?.(true);
          if (onDetectUrl) {
            onDetectUrl({ url: clipboard, type, size });
          }
        }
      } catch (error) {
        console.log('Clipboard error:', error);
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(clipboardListener);
  }, []);

  const detectContentType = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'Video (YouTube)';
    } else if (url.includes('instagram.com')) {
      return 'Image/Video (Instagram)';
    } else if (url.includes('tiktok.com')) {
      return 'Video (TikTok)';
    } else if (url.includes('soundcloud.com')) {
      return 'Audio (SoundCloud)';
    } else if (url.includes('.mp3') || url.includes('.wav')) {
      return 'Audio';
    } else if (url.includes('.mp4') || url.includes('.mkv')) {
      return 'Video';
    } else if (url.includes('.jpg') || url.includes('.png')) {
      return 'Image';
    } else {
      return 'Link';
    }
  };

  const estimateSize = async (url) => {
    // Simulate size detection
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const size = response.headers.get('content-length');
      if (size) {
        return formatBytes(parseInt(size));
      }
    } catch (error) {
      console.log('Size detection error:', error);
    }
    return 'Unknown';
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return 'Unknown';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleQuickDownload = () => {
    setIsDownloading(true);
    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        setDownloadProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsDownloading(false);
          setIsExpanded(false);
          setDetectedContent(null);
          setDownloadProgress(0);
          onExpandedChange?.(false);
        }, 500);
      } else {
        setDownloadProgress(progress);
      }
    }, 500);
  };

  // Pulsing dots animation style
  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(pulseAnimation.value, [0, 1], [0.3, 1], Extrapolate.CLAMP),
      transform: [
        {
          scale: interpolate(pulseAnimation.value, [0, 1], [0.8, 1], Extrapolate.CLAMP),
        },
      ],
    };
  });

  const renderIdleState = () => {
    switch (idleMode) {
      case 'triangle':
        return (
          <View style={styles.triangle}>
            <View style={styles.triangleInner} />
          </View>
        );
      case 'dots':
        return (
          <RNAnimated.View style={pulseAnimatedStyle}>
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          </RNAnimated.View>
        );
      case 'clock':
        return (
          <Text style={styles.clockText}>
            {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </Text>
        );
      case 'date':
        return (
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        );
      default:
        return (
          <View style={styles.triangle}>
            <View style={styles.triangleInner} />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Neon Link Island */}
      <Animated.View
        style={[
          styles.island,
          isExpanded && styles.islandExpanded,
        ]}
      >
        {isExpanded && detectedContent ? (
          <View style={styles.expandedContent}>
            <TouchableOpacity
              onPress={() => {
                setIsExpanded(false);
                setDetectedContent(null);
                onExpandedChange?.(false);
              }}
              style={styles.closeIcon}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.contentHeader}>
              <Text style={styles.contentType}>
                {detectedContent.type}
              </Text>
              <Text style={styles.contentSize}>
                {detectedContent.size}
              </Text>
            </View>

            {isDownloading && (
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${downloadProgress}%` },
                  ]}
                />
              </View>
            )}

            <TouchableOpacity
              onPress={handleQuickDownload}
              disabled={isDownloading}
              style={[
                styles.downloadButton,
                isDownloading && styles.downloadButtonDisabled,
              ]}
            >
              <Text style={styles.downloadButtonText}>
                {isDownloading ? '⬇️ Downloading...' : '⬇️ Quick Download'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setIsExpanded(!isExpanded)}
            style={styles.idleStateContainer}
          >
            {renderIdleState()}
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Settings for Neon Link */}
      <View style={styles.settingsContainer}>
        <Text style={styles.settingsLabel}>Idle Mode:</Text>
        <View style={styles.modeButtons}>
          {['triangle', 'dots', 'clock', 'date'].map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => setIdleMode(mode)}
              style={[
                styles.modeButton,
                idleMode === mode && styles.modeButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  idleMode === mode && styles.modeButtonTextActive,
                ]}
              >
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: SPACING.LG,
    right: SPACING.LG,
    alignItems: 'center',
    zIndex: 999,
  },
  island: {
    backgroundColor: `rgba(10, 14, 39, 0.95)`,
    borderRadius: BORDER_RADIUS.FULL,
    borderWidth: 1.5,
    borderColor: `rgba(255, 140, 0, 0.4)`,
    padding: SPACING.MD,
    minHeight: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.PRIMARY_ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  islandExpanded: {
    width: width - SPACING.LG * 2,
    minHeight: 160,
    borderRadius: BORDER_RADIUS.LG,
  },
  idleStateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  triangle: {
    width: 30,
    height: 30,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 26,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.PRIMARY_ORANGE,
  },
  triangleInner: {
    marginTop: -20,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.GLOW_WHITE,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: SPACING.XS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.GLOW_WHITE,
  },
  dot1: {},
  dot2: {
    backgroundColor: COLORS.PRIMARY_ORANGE,
  },
  dot3: {},
  clockText: {
    ...Typography.CAPTION,
    color: COLORS.GLOW_WHITE,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  dateText: {
    ...Typography.BODY_SMALL,
    color: COLORS.PRIMARY_ORANGE,
    fontWeight: '600',
  },
  expandedContent: {
    width: '100%',
    gap: SPACING.MD,
  },
  closeIcon: {
    position: 'absolute',
    top: SPACING.SM,
    right: SPACING.SM,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `rgba(255, 255, 255, 0.1)`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: COLORS.GLOW_WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  contentHeader: {
    marginTop: SPACING.SM,
  },
  contentType: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.PRIMARY_ORANGE,
    fontWeight: '600',
    marginBottom: SPACING.XS,
  },
  contentSize: {
    ...Typography.BODY_SMALL,
    color: COLORS.LIGHT_GRAY,
  },
  progressContainer: {
    height: 6,
    borderRadius: 3,
    backgroundColor: `rgba(255, 255, 255, 0.1)`,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY_ORANGE,
    borderRadius: 3,
  },
  downloadButton: {
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    backgroundColor: COLORS.PRIMARY_ORANGE,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
  },
  downloadButtonDisabled: {
    opacity: 0.6,
  },
  downloadButtonText: {
    ...Typography.BODY_SMALL,
    color: COLORS.MATTE_BLACK,
    fontWeight: '600',
  },
  settingsContainer: {
    marginTop: SPACING.LG,
    alignItems: 'center',
    gap: SPACING.SM,
  },
  settingsLabel: {
    ...Typography.BODY_SMALL,
    color: COLORS.LIGHT_GRAY,
  },
  modeButtons: {
    flexDirection: 'row',
    gap: SPACING.XS,
  },
  modeButton: {
    paddingVertical: SPACING.XS,
    paddingHorizontal: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
    backgroundColor: `rgba(255, 255, 255, 0.05)`,
    borderWidth: 1,
    borderColor: `rgba(255, 255, 255, 0.1)`,
  },
  modeButtonActive: {
    backgroundColor: COLORS.PRIMARY_ORANGE,
    borderColor: COLORS.PRIMARY_ORANGE,
  },
  modeButtonText: {
    ...Typography.CAPTION,
    color: COLORS.LIGHT_GRAY,
    fontWeight: '500',
  },
  modeButtonTextActive: {
    color: COLORS.MATTE_BLACK,
  },
});
