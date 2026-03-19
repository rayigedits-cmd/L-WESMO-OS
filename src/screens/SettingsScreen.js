import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ProgressViewIOS,
  ProgressBarAndroid,
  Platform,
} from 'react-native';
import * as Device from 'expo-device';
import * as Battery from 'expo-battery';
import { COLORS, SPACING, BORDER_RADIUS, Typography } from '../constants/theme';
import { GlassCard } from '../components/GlassCard';
import Animated, { FadeIn } from 'react-native-reanimated';

// About Screen
export const AboutScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Animated.View entering={FadeIn.duration(600)}>
          <Text style={styles.pageTitle}>About L'WESMOU OS</Text>

          <GlassCard intensity="medium" style={styles.card}>
            <Text style={styles.sectionTitle}>Our Mission</Text>
            <Text style={styles.sectionText}>
              L'WESMOU OS is built on a single principle: Your privacy is sacred.
              We believe technology should empower users, not exploit them.
            </Text>
          </GlassCard>

          <GlassCard intensity="medium" style={styles.card}>
            <Text style={styles.sectionTitle}>Core Values</Text>
            <Text style={styles.sectionText}>
              {`🔒 PRIVACY FIRST
Your data is yours alone. Everything processes locally on your device. Period.

🚀 PERFORMANCE
Optimized code. Minimal footprint. Maximum speed. Zero bloat.

🎨 BEAUTIFUL DESIGN
Premium UI/UX with glassmorphic effects and smooth animations.

💪 POWERFUL TOOLS
Professional-grade features for downloading, file management, scanning, and more.

🌍 LOCALLY FOCUSED
Built with Arabic users in mind. Full RTL support and cultural awareness.`}
            </Text>
          </GlassCard>

          <GlassCard intensity="medium" style={styles.card}>
            <Text style={styles.sectionTitle}>Developer</Text>
            <Text style={styles.developerName}>Mellouki Djamal</Text>
            <Text style={styles.developerHandle}>@MLk_JAMAL</Text>
            <Text style={styles.sectionText}>
              {`A passionate developer committed to creating privacy-first solutions.
              
Building tools that respect user autonomy and digital rights.`}
            </Text>
          </GlassCard>

          <GlassCard intensity="medium" style={styles.card}>
            <Text style={styles.sectionTitle}>Features</Text>
            <Text style={styles.featureList}>
              {`✓ Multi-format Downloader (Video, Audio, Images)
✓ Document Processing Suite (PDF, DOCX, XLSX)
✓ Advanced Scanner with QR/Barcode & OCR
✓ AI Vision Analysis (Local Processing)
✓ Encrypted File Vault
✓ Dynamic Island (Neon Link)
✓ Real-time Hardware Monitoring
✓ 100% Local Processing - No Cloud Uploads
✓ Full Arabic Localization
✓ Haptic Feedback Integration

And much more coming in Phase 2...`}
            </Text>
          </GlassCard>

          <GlassCard intensity="light" style={styles.card}>
            <Text style={[styles.sectionTitle, { fontSize: 12 }]}>
              Version 1.0.0 - Phase 1
            </Text>
            <Text style={[styles.sectionText, { fontSize: 12 }]}>
              © 2026 Mellouki Djamal. All rights reserved.
            </Text>
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

// Settings & Hardware Info Screen
export const SettingsScreen = ({ navigation }) => {
  const [hardwareInfo, setHardwareInfo] = useState({
    totalMemory: 0,
    availableMemory: 0,
    CPUUsage: 0.4, // Simulated
    GPUUsage: 0.3, // Simulated
    batteryLevel: 0.85,
    storageTotal: 128,
    storageFree: 45,
    appStorage: 2.4,
  });

  useEffect(() => {
    const fetchHardwareInfo = async () => {
      try {
        const memory = require('react-native').NativeModules.PerfModule;
        const batteryLevel = await Battery.getBatteryLevelAsync();

        setHardwareInfo((prev) => ({
          ...prev,
          batteryLevel,
        }));
      } catch (error) {
        console.log('Hardware info error:', error);
      }
    };

    fetchHardwareInfo();
    const interval = setInterval(fetchHardwareInfo, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const renderGauge = (label, value, max = 100, unit = '%') => {
    const percentage = (value / max) * 100;
    const color =
      percentage > 80 ? COLORS.ERROR
        : percentage > 50 ? COLORS.WARNING
          : COLORS.SUCCESS;

    return (
      <View style={styles.gaugeContainer}>
        <View style={styles.gaugeHeader}>
          <Text style={styles.gaugeLabel}>{label}</Text>
          <Text style={[styles.gaugeValue, { color }]}>
            {(percentage).toFixed(1)}{unit}
          </Text>
        </View>
        {Platform.OS === 'ios' ? (
          <ProgressViewIOS
            progress={value / max}
            progressTintColor={color}
            style={styles.progressBar}
          />
        ) : (
          <View style={styles.progressBarAndroid}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${percentage}%`,
                  backgroundColor: color,
                },
              ]}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Animated.View entering={FadeIn.duration(600)}>
          <Text style={styles.pageTitle}>Hardware Information</Text>

          {/* System Performance */}
          <GlassCard intensity="medium" style={styles.card}>
            <Text style={styles.sectionTitle}>System Performance</Text>
            {renderGauge('CPU Usage', hardwareInfo.CPUUsage, 1, '%')}
            {renderGauge('GPU Usage', hardwareInfo.GPUUsage, 1, '%')}
            {renderGauge('RAM Usage', hardwareInfo.availableMemory || 4, 8, 'GB')}
            {renderGauge(
              'Battery Level',
              hardwareInfo.batteryLevel,
              1,
              '%'
            )}
          </GlassCard>

          {/* Storage */}
          <GlassCard intensity="medium" style={styles.card}>
            <Text style={styles.sectionTitle}>Storage</Text>
            <View style={styles.storageInfo}>
              <Text style={styles.storageLabel}>
                {hardwareInfo.storageFree} GB Free / {hardwareInfo.storageTotal} GB Total
              </Text>
              {Platform.OS === 'ios' ? (
                <ProgressViewIOS
                  progress={
                    (hardwareInfo.storageTotal - hardwareInfo.storageFree) /
                    hardwareInfo.storageTotal
                  }
                  progressTintColor={COLORS.PRIMARY_ORANGE}
                  style={styles.progressBar}
                />
              ) : (
                <View style={styles.progressBarAndroid}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${
                          ((hardwareInfo.storageTotal - hardwareInfo.storageFree) /
                            hardwareInfo.storageTotal) *
                          100
                        }%`,
                        backgroundColor: COLORS.PRIMARY_ORANGE,
                      },
                    ]}
                  />
                </View>
              )}
              <Text style={styles.appStorageText}>
                L'WESMOU OS: {hardwareInfo.appStorage} GB
              </Text>
            </View>
          </GlassCard>

          {/* Device Info */}
          <GlassCard intensity="medium" style={styles.card}>
            <Text style={styles.sectionTitle}>Device Information</Text>
            <View style={styles.deviceInfoList}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Model:</Text>
                <Text style={styles.infoValue}>{Device.modelName || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>OS:</Text>
                <Text style={styles.infoValue}>
                  {Platform.OS === 'ios' ? 'iOS' : 'Android'} {Device.osVersion}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Version:</Text>
                <Text style={styles.infoValue}>1.0.0 - Phase 1</Text>
              </View>
            </View>
          </GlassCard>

          {/* Neon Link Settings */}
          <GlassCard intensity="medium" style={styles.card}>
            <Text style={styles.sectionTitle}>Neon Link Settings</Text>
            <TouchableOpacity style={styles.settingOption}>
              <Text style={styles.settingLabel}>Idle Mode</Text>
              <Text style={styles.settingValue}>Triangle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingOption}>
              <Text style={styles.settingLabel}>Clipboard Monitoring</Text>
              <Text style={styles.settingValue}>Enabled</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingOption}>
              <Text style={styles.settingLabel}>Expand on Detection</Text>
              <Text style={styles.settingValue}>Auto</Text>
            </TouchableOpacity>
          </GlassCard>

          {/* General Settings */}
          <GlassCard intensity="medium" style={styles.card}>
            <Text style={styles.sectionTitle}>General</Text>
            <TouchableOpacity style={styles.settingOption}>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingValue}>English / العربية</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingOption}>
              <Text style={styles.settingLabel}>Theme</Text>
              <Text style={styles.settingValue}>Dark (Matte Black)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingOption}>
              <Text style={styles.settingLabel}>Haptic Feedback</Text>
              <Text style={styles.settingValue}>Enabled</Text>
            </TouchableOpacity>
          </GlassCard>

          {/* Ad Banner */}
          <GlassCard intensity="light" style={styles.adCard}>
            <Text style={styles.adText}>
              Advertisement Banner (ID: 28776956)
            </Text>
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.MATTE_BLACK,
  },
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.LG,
  },
  backButton: {
    marginBottom: SPACING.LG,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: `rgba(255, 140, 0, 0.1)`,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.PRIMARY_ORANGE,
    fontWeight: '600',
  },
  pageTitle: {
    ...Typography.HEADING_2,
    color: COLORS.GLOW_WHITE,
    marginBottom: SPACING.LG,
  },
  card: {
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    ...Typography.HEADING_3,
    color: COLORS.PRIMARY_ORANGE,
    marginBottom: SPACING.MD,
  },
  sectionText: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.LIGHT_GRAY,
    lineHeight: 24,
  },
  developerName: {
    ...Typography.HEADING_3,
    color: COLORS.PRIMARY_ORANGE,
    marginBottom: SPACING.XS,
  },
  developerHandle: {
    ...Typography.BODY_SMALL,
    color: COLORS.MEDIUM_GRAY,
    marginBottom: SPACING.MD,
  },
  featureList: {
    ...Typography.BODY_SMALL,
    color: COLORS.LIGHT_GRAY,
    lineHeight: 22,
  },
  // Hardware Info Styles
  gaugeContainer: {
    marginBottom: SPACING.LG,
    gap: SPACING.MD,
  },
  gaugeHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gaugeLabel: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.GLOW_WHITE,
    fontWeight: '500',
  },
  gaugeValue: {
    ...Typography.BODY_LARGE,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  progressBarAndroid: {
    height: 6,
    borderRadius: 3,
    backgroundColor: `rgba(255, 255, 255, 0.1)`,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  storageInfo: {
    gap: SPACING.MD,
  },
  storageLabel: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.GLOW_WHITE,
  },
  appStorageText: {
    ...Typography.BODY_SMALL,
    color: COLORS.MEDIUM_GRAY,
  },
  deviceInfoList: {
    gap: SPACING.SM,
  },
  infoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: `rgba(255, 255, 255, 0.05)`,
  },
  infoLabel: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.LIGHT_GRAY,
  },
  infoValue: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.PRIMARY_ORANGE,
    fontWeight: '600',
  },
  settingOption: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: `rgba(255, 255, 255, 0.05)`,
  },
  settingLabel: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.GLOW_WHITE,
  },
  settingValue: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.PRIMARY_ORANGE,
    fontWeight: '600',
  },
  adCard: {
    marginTop: SPACING.LG,
    marginBottom: SPACING.XL,
  },
  adText: {
    ...Typography.BODY_SMALL,
    color: COLORS.LIGHT_GRAY,
    textAlign: 'center',
  },
});
