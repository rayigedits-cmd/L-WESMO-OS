import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated as RNAnimated,
  Modal,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, Typography } from '../constants/theme';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { GlassCard } from '../components/GlassCard';
import Animated, {
  FadeIn,
  FadeOut,
  BounceIn,
} from 'react-native-reanimated';

export const OnboardingScreen = ({ navigation }) => {
  const [isConsented, setIsConsented] = useState(false);
  const [expandedDropdown, setExpandedDropdown] = useState(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);

  const handleCheckbox = async () => {
    setIsConsented(!isConsented);
    // Haptic feedback would go here
  };

  const handleContinue = () => {
    if (isConsented) {
      navigation.replace('Home');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with animated logo */}
        <Animated.View
          style={styles.header}
          entering={FadeIn.duration(800)}
        >
          <AnimatedLogo size={100} containerStyle={styles.logo} />
          <Text style={styles.appName}>L'WESMOU OS</Text>
          <Text style={styles.appNameArabic}>منظومة الويسمو</Text>
        </Animated.View>

        {/* Privacy & Why Choose Us Buttons */}
        <Animated.View
          style={styles.buttonsContainer}
          entering={FadeIn.delay(200).duration(800)}
        >
          {/* "Why Choose Us" Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowWhyModal(true)}
            style={styles.dropdownButton}
          >
            <GlassCard intensity="medium">
              <Text style={styles.dropdownButtonText}>
                لماذا تختار تطبيقنا؟
              </Text>
              <Text style={styles.dropdownSubtext}>Why Choose Us</Text>
            </GlassCard>
          </TouchableOpacity>

          {/* Privacy Policy Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowPolicyModal(true)}
            style={styles.dropdownButton}
          >
            <GlassCard intensity="medium">
              <Text style={styles.dropdownButtonText}>
                سياسة الخصوصية
              </Text>
              <Text style={styles.dropdownSubtext}>Privacy Policy</Text>
            </GlassCard>
          </TouchableOpacity>
        </Animated.View>

        {/* Consent Checkbox */}
        <Animated.View
          style={styles.consentContainer}
          entering={FadeIn.delay(400).duration(800)}
        >
          <TouchableOpacity
            onPress={handleCheckbox}
            style={[
              styles.checkbox,
              isConsented && styles.checkboxChecked,
            ]}
          >
            {isConsented && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.consentText}>
            لقد قرأت ووافقت على سياسة المنظومة
          </Text>
        </Animated.View>

        {/* Continue Button */}
        <Animated.View
          style={styles.continueButtonContainer}
          entering={BounceIn.delay(600).duration(800)}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleContinue}
            disabled={!isConsented}
          >
            <View
              style={[
                styles.continueButton,
                isConsented
                  ? styles.continueButtonActive
                  : styles.continueButtonDisabled,
              ]}
            >
              <Text style={styles.continueButtonText}>متابعة</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Privacy Policy Modal */}
      <Modal
        visible={showPolicyModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setShowPolicyModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <ScrollView
              contentContainerStyle={styles.policyScrollContent}
              showsVerticalScrollIndicator={true}
            >
              <Text style={styles.modalTitle}>سياسة الخصوصية</Text>
              <Text style={styles.modalTitle2}>Privacy Policy</Text>

              <GlassCard intensity="light" padding={SPACING.MD}>
                <Text style={styles.policyText}>
                  {`Developer: Mellouki Djamal (MLk_JAMAL)

Our privacy policy is designed to protect your rights and ensure complete transparency about how L'WESMOU OS operates.

KEY PRINCIPLES:

1. LOCAL-FIRST PROCESSING
All data processing occurs exclusively on your device hardware (CPU/GPU). Zero cloud uploads. Zero external API calls. Your data never leaves your device.

2. NO DATA COLLECTION
- We do not collect personal information
- We do not track user behavior
- We do not sell or share user data
- We do not use analytics or telemetry

3. INTELLECTUAL PROPERTY PROTECTION
This application and all its features are protected intellectual property of Mellouki Djamal. Unauthorized reproduction, distribution, or commercial use without explicit written permission is strictly prohibited.

4. DEVELOPER PROTECTION
Ideas, concepts, algorithms, and implementations within L'WESMOU OS are confidential intellectual property. Any attempt to reverse-engineer, extract, or commercialize these assets without authorization will be pursued legally.

5. ADVERTISING
Advertisements displayed in this application may be based on application context only, not user tracking. No personal data is used for ad targeting.

6. SECURITY & ENCRYPTION
All files created within L'WESMOU OS can be encrypted locally using advanced cryptographic standards. You maintain full control of your encryption keys.

7. LEGAL DISCLAIMER
By using L'WESMOU OS, you agree to these terms. The developer is not liable for misuse of this application or any consequences arising from user actions.

CONTACT:
For privacy concerns, contact: MLk_JAMAL`}
                </Text>
              </GlassCard>
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowPolicyModal(false)}
              style={styles.agreeButton}
            >
              <Text style={styles.agreeButtonText}>وافق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Why Choose Us Modal */}
      <Modal
        visible={showWhyModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setShowWhyModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <ScrollView
              contentContainerStyle={styles.policyScrollContent}
              showsVerticalScrollIndicator={true}
            >
              <Text style={styles.modalTitle}>لماذا تختار تطبيقنا؟</Text>
              <Text style={styles.modalTitle2}>Why Choose L'WESMOU OS?</Text>

              <GlassCard intensity="light" padding={SPACING.MD}>
                <Text style={styles.whyText}>
                  {`🔒 COMPLETE LOCAL PRIVACY
Everything runs on your device. No cloud. No tracking. No selling your data. Your privacy is paramount.

⚡ ZERO INTERNET DEPENDENCY
Full functionality without internet connection. Download, process, edit - all locally.

🎨 ULTRA-PREMIUM UI
Cutting-edge glassmorphic design with responsive animations and haptic feedback for an immersive experience.

🛠 ALL-IN-ONE TOOLBELT
• Download videos, audio, and images in multiple quality formats
• Convert documents to PDF with security features
• Scan QR codes and extract text with OCR
• Manage files locally with encryption
• And much more...

🚀 NEON LINK DYNAMIC ISLAND
Smart floating overlay that revolutionizes app interaction. Clipboard monitoring, quick actions, and real-time system information.

💼 PROFESSIONAL GRADE
Built for users who take privacy seriously and demand powerful tools without compromising security.

👨‍💻 OPEN CONCEPT
Created by Mellouki Djamal with passion for privacy-first technology.

⭐ 100% LOCAL PROCESSING
OCR, translation, compression - all happens on your CPU/GPU. Never leaving your device.

🎯 DESIGNED FOR ARABIC USERS
Full RTL support, Arabic localization, and culturally aware design principles.`}
                </Text>
              </GlassCard>
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowWhyModal(false)}
              style={styles.agreeButton}
            >
              <Text style={styles.agreeButtonText}>حسناً</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.MATTE_BLACK,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.XL,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.XXL,
  },
  logo: {
    marginBottom: SPACING.XL,
  },
  appName: {
    ...Typography.HEADING_1,
    color: COLORS.GLOW_WHITE,
    textAlign: 'center',
    marginBottom: SPACING.SM,
  },
  appNameArabic: {
    ...Typography.HEADING_3,
    color: COLORS.PRIMARY_ORANGE,
    textAlign: 'center',
  },
  buttonsContainer: {
    gap: SPACING.MD,
    marginBottom: SPACING.XL,
  },
  dropdownButton: {
    marginVertical: SPACING.SM,
  },
  dropdownButtonText: {
    ...Typography.BODY_LARGE,
    color: COLORS.PRIMARY_ORANGE,
    fontWeight: '600',
    marginBottom: SPACING.XS,
  },
  dropdownSubtext: {
    ...Typography.BODY_SMALL,
    color: COLORS.LIGHT_GRAY,
  },
  consentContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: SPACING.XL,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
    backgroundColor: `rgba(255, 140, 0, 0.05)`,
    borderWidth: 1,
    borderColor: `rgba(255, 140, 0, 0.2)`,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.SM,
    borderWidth: 2,
    borderColor: COLORS.GLOW_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MD,
  },
  checkboxChecked: {
    backgroundColor: COLORS.PRIMARY_ORANGE,
    borderColor: COLORS.PRIMARY_ORANGE,
  },
  checkmark: {
    color: COLORS.GLOW_WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  consentText: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.GLOW_WHITE,
    flex: 1,
    textAlign: 'right',
  },
  continueButtonContainer: {
    marginTop: SPACING.LG,
  },
  continueButton: {
    paddingVertical: SPACING.LG,
    borderRadius: BORDER_RADIUS.LG,
    alignItems: 'center',
    borderWidth: 2,
  },
  continueButtonActive: {
    backgroundColor: COLORS.PRIMARY_ORANGE,
    borderColor: COLORS.PRIMARY_ORANGE,
    shadowColor: COLORS.PRIMARY_ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonDisabled: {
    backgroundColor: COLORS.DARK_GRAY,
    borderColor: COLORS.MEDIUM_GRAY,
  },
  continueButtonText: {
    ...Typography.HEADING_3,
    color: COLORS.MATTE_BLACK,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: `rgba(0, 0, 0, 0.8)`,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.MATTE_BLACK,
    borderTopLeftRadius: BORDER_RADIUS.XL,
    borderTopRightRadius: BORDER_RADIUS.XL,
    maxHeight: '90%',
    paddingTop: SPACING.LG,
    paddingBottom: SPACING.LG,
    borderTopWidth: 1,
    borderTopColor: `rgba(255, 255, 255, 0.1)`,
  },
  closeButton: {
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.FULL,
    backgroundColor: `rgba(255, 255, 255, 0.1)`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  closeButtonText: {
    color: COLORS.GLOW_WHITE,
    fontSize: 20,
    fontWeight: 'bold',
  },
  policyScrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: SPACING.LG,
  },
  modalTitle: {
    ...Typography.HEADING_2,
    color: COLORS.PRIMARY_ORANGE,
    marginBottom: SPACING.SM,
    textAlign: 'center',
  },
  modalTitle2: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.LIGHT_GRAY,
    marginBottom: SPACING.LG,
    textAlign: 'center',
  },
  policyText: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.LIGHT_GRAY,
    lineHeight: 24,
  },
  whyText: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.LIGHT_GRAY,
    lineHeight: 24,
  },
  agreeButton: {
    marginHorizontal: SPACING.LG,
    marginTop: SPACING.MD,
    paddingVertical: SPACING.MD,
    backgroundColor: COLORS.PRIMARY_ORANGE,
    borderRadius: BORDER_RADIUS.LG,
    alignItems: 'center',
    shadowColor: COLORS.PRIMARY_ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  agreeButtonText: {
    ...Typography.BODY_LARGE,
    color: COLORS.MATTE_BLACK,
    fontWeight: '600',
  },
});
