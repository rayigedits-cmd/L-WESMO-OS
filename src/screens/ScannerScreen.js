import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { CameraView } from 'expo-camera';
import { COLORS, SPACING, BORDER_RADIUS, Typography } from '../constants/theme';
import { GlassCard } from '../components/GlassCard';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import * as Clipboard from 'expo-clipboard';

const SCANNER_MODES = [
  { id: 'qr', title: 'QR Code', icon: '◼', color: '#4A9EFF' },
  { id: 'barcode', title: 'Barcode', icon: '█', color: '#F59E0B' },
  { id: 'ocr', title: 'OCR', icon: '📄', color: '#10CF60' },
];

export const ScannerScreen = ({ navigation }) => {
  const [mode, setMode] = useState('qr');
  const [cameraActive, setCameraActive] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);

  const handleBarcodeScanned = ({ data }) => {
    if (cameraActive) {
      setScannedData({
        type: mode,
        value: data,
        timestamp: new Date(),
      });
      setCameraActive(false);
      setIsProcessing(true);

      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
    }
  };

  const handleCopyToClipboard = async () => {
    if (scannedData?.value) {
      await Clipboard.setStringAsync(scannedData.value);
      // Could show success toast here
    }
  };

  const handleReset = () => {
    setScannedData(null);
    setCameraActive(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>L'WESMOU Scanner</Text>
      </View>

      {cameraActive && !scannedData ? (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            onBarcodeScanned={handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr', 'code128', 'code39'],
            }}
          >
            <View style={styles.overlay}>
              <View style={styles.scanFrame} />
              <Text style={styles.scanText}>
                {mode === 'qr' ? 'Position QR Code' : 'Position Barcode'}
              </Text>
            </View>
          </CameraView>

          {/* Camera Controls */}
          <View style={styles.cameraControls}>
            <TouchableOpacity
              onPress={() => setCameraActive(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕ Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!cameraActive && !scannedData ? (
            <>
              {/* Mode Selection */}
              <Animated.View
                style={styles.modeSection}
                entering={FadeIn.duration(500)}
              >
                <Text style={styles.sectionTitle}>Select Scanner Mode</Text>
                <View style={styles.modeGrid}>
                  {SCANNER_MODES.map((m) => (
                    <TouchableOpacity
                      key={m.id}
                      onPress={() => {
                        setMode(m.id);
                        setCameraActive(true);
                      }}
                      style={[
                        styles.modeCard,
                        mode === m.id && styles.modeCardActive,
                      ]}
                    >
                      <GlassCard intensity="medium">
                        <View style={styles.modeCardContent}>
                          <Text style={styles.modeIcon}>{m.icon}</Text>
                          <Text style={styles.modeName}>{m.title}</Text>
                        </View>
                      </GlassCard>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>

              {/* Features */}
              <Animated.View
                style={styles.featuresSection}
                entering={FadeIn.delay(200).duration(600)}
              >
                <Text style={styles.sectionTitle}>Scanner Features</Text>
                <GlassCard intensity="light">
                  <Text style={styles.featureText}>
                    {`📱 QR CODE SCANNER
Fast and accurate QR code detection and decoding.
Compatible with all standard QR code formats.

📊 BARCODE READER
Industry-standard barcode recognition.
Supports Code39, Code128, and more.

🖼️ OCR ENGINE
Extract text from images and documents.
100% local processing - no cloud uploads.
Multi-language support.

🔍 SMART DETECTION
Automatic mode detection for efficiency.
Real-time preview and instant feedback.`}
                  </Text>
                </GlassCard>
              </Animated.View>

              {/* Quick Actions */}
              <Animated.View
                style={styles.actionsSection}
                entering={FadeIn.delay(400).duration(600)}
              >
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <TouchableOpacity style={styles.actionButton}>
                  <GlassCard intensity="medium" glowEffect={true}>
                    <Text style={styles.actionButtonText}>
                      🎥 Start Scanning →
                    </Text>
                  </GlassCard>
                </TouchableOpacity>
              </Animated.View>

              {/* Ad Banner */}
              <GlassCard intensity="light" style={styles.adBanner}>
                <Text style={styles.adText}>
                  Advertisement Banner (ID: 28776956)
                </Text>
              </GlassCard>
            </>
          ) : (
            <>
              {/* Scanned Result */}
              <Animated.View
                style={styles.resultSection}
                entering={SlideInUp.duration(600)}
              >
                {isProcessing ? (
                  <View style={styles.processingContainer}>
                    <ActivityIndicator size="large" color={COLORS.PRIMARY_ORANGE} />
                    <Text style={styles.processingText}>Processing scan...</Text>
                  </View>
                ) : (
                  <GlassCard intensity="medium">
                    <View style={styles.resultHeader}>
                      <Text style={styles.resultType}>
                        📌 {scannedData?.type.toUpperCase()} Detected
                      </Text>
                      <Text style={styles.resultTime}>
                        {scannedData?.timestamp.toLocaleTimeString()}
                      </Text>
                    </View>

                    {/* Scanned Data Display */}
                    <TextInput
                      style={styles.resultInput}
                      placeholder="Scanned data will appear here"
                      placeholderTextColor={COLORS.MEDIUM_GRAY}
                      value={scannedData?.value}
                      editable={false}
                      multiline={true}
                    />

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        onPress={handleCopyToClipboard}
                        style={styles.actionBtn}
                      >
                        <GlassCard intensity="light">
                          <Text style={styles.actionBtnText}>
                            📋 Copy
                          </Text>
                        </GlassCard>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={handleReset}
                        style={styles.actionBtn}
                      >
                        <GlassCard
                          intensity="medium"
                          glowEffect={true}
                        >
                          <Text style={styles.actionBtnTextOrange}>
                            🔄 Scan Again
                          </Text>
                        </GlassCard>
                      </TouchableOpacity>
                    </View>
                  </GlassCard>
                )}
              </Animated.View>

              {/* Ad Banner */}
              <GlassCard intensity="light" style={styles.adBanner}>
                <Text style={styles.adText}>
                  Advertisement Banner (ID: 28776956)
                </Text>
              </GlassCard>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.MATTE_BLACK,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: `rgba(255, 255, 255, 0.05)`,
    gap: SPACING.MD,
  },
  backButton: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.PRIMARY_ORANGE,
    fontWeight: '600',
  },
  headerTitle: {
    ...Typography.HEADING_3,
    color: COLORS.GLOW_WHITE,
    fontWeight: '600',
    flex: 1,
  },
  // Camera Styles
  cameraContainer: {
    flex: 1,
    backgroundColor: COLORS.DEEP_BLACK,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY_ORANGE,
    borderRadius: BORDER_RADIUS.LG,
    shadowColor: COLORS.PRIMARY_ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  scanText: {
    ...Typography.BODY_LARGE,
    color: COLORS.GLOW_WHITE,
    marginTop: SPACING.XL,
    fontWeight: '600',
  },
  cameraControls: {
    position: 'absolute',
    bottom: SPACING.LG,
    left: SPACING.LG,
    right: SPACING.LG,
    flexDirection: 'row-reverse',
  },
  closeButton: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.LG,
    backgroundColor: COLORS.ERROR,
  },
  closeButtonText: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.GLOW_WHITE,
    fontWeight: '600',
  },
  // Content Styles
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.LG,
  },
  modeSection: {
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    ...Typography.HEADING_3,
    color: COLORS.PRIMARY_ORANGE,
    marginBottom: SPACING.MD,
  },
  modeGrid: {
    flexDirection: 'row-reverse',
    gap: SPACING.MD,
    marginBottom: SPACING.LG,
  },
  modeCard: {
    flex: 1,
  },
  modeCardActive: {
    opacity: 0.8,
  },
  modeCardContent: {
    alignItems: 'center',
    gap: SPACING.MD,
    paddingVertical: SPACING.LG,
  },
  modeIcon: {
    fontSize: 28,
  },
  modeName: {
    ...Typography.BODY_SMALL,
    color: COLORS.GLOW_WHITE,
    fontWeight: '600',
  },
  featuresSection: {
    marginBottom: SPACING.LG,
  },
  featureText: {
    ...Typography.BODY_SMALL,
    color: COLORS.LIGHT_GRAY,
    lineHeight: 22,
  },
  actionsSection: {
    marginBottom: SPACING.LG,
  },
  actionButton: {
    paddingVertical: SPACING.MD,
  },
  actionButtonText: {
    ...Typography.BODY_LARGE,
    color: COLORS.MATTE_BLACK,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Result Styles
  resultSection: {
    marginBottom: SPACING.LG,
  },
  processingContainer: {
    paddingVertical: SPACING.XXL,
    alignItems: 'center',
    gap: SPACING.LG,
  },
  processingText: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.PRIMARY_ORANGE,
    fontWeight: '600',
  },
  resultHeader: {
    marginBottom: SPACING.MD,
    paddingBottom: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: `rgba(255, 255, 255, 0.1)`,
  },
  resultType: {
    ...Typography.BODY_LARGE,
    color: COLORS.PRIMARY_ORANGE,
    fontWeight: '600',
    marginBottom: SPACING.XS,
  },
  resultTime: {
    ...Typography.BODY_SMALL,
    color: COLORS.MEDIUM_GRAY,
  },
  resultInput: {
    backgroundColor: `rgba(0, 0, 0, 0.3)`,
    color: COLORS.GLOW_WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginVertical: SPACING.MD,
    minHeight: 100,
    ...Typography.BODY_MEDIUM,
  },
  actionButtons: {
    flexDirection: 'row-reverse',
    gap: SPACING.MD,
  },
  actionBtn: {
    flex: 1,
  },
  actionBtnText: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.GLOW_WHITE,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: SPACING.MD,
  },
  actionBtnTextOrange: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.MATTE_BLACK,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: SPACING.MD,
  },
  adBanner: {
    marginTop: SPACING.LG,
    marginBottom: SPACING.XL,
  },
  adText: {
    ...Typography.BODY_SMALL,
    color: COLORS.LIGHT_GRAY,
    textAlign: 'center',
  },
});
