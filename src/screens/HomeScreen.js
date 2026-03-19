import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Animated as RNAnimated,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, Typography } from '../constants/theme';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { GlassCard } from '../components/GlassCard';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

const CARDS = [
  {
    id: 'downloader',
    icon: '⬇️',
    name: 'Downloader',
    arabicName: 'المحمل',
    description: 'Download videos, audio, images',
    color: '#FF8C00',
  },
  {
    id: 'files',
    icon: '📄',
    name: 'Files',
    arabicName: 'الملفات',
    description: 'PDF, DOCX, XLSX processing',
    color: '#4A9EFF',
  },
  {
    id: 'scanner',
    icon: '📱',
    name: 'Scanner',
    arabicName: 'الماسح',
    description: 'QR/Barcode & OCR engine',
    color: '#10CF60',
  },
  {
    id: 'vision',
    icon: '👁️',
    name: 'Vision',
    arabicName: 'الرؤية',
    description: 'Image recognition & analysis',
    color: '#A855F7',
  },
  {
    id: 'gallery',
    icon: '🖼️',
    name: 'Gallery',
    arabicName: 'المعرض',
    description: 'Organize & edit photos',
    color: '#F59E0B',
  },
  {
    id: 'todo',
    icon: '✓',
    name: 'ToDo',
    arabicName: 'قائمة المهام',
    description: 'Task management suite',
    color: '#EC4899',
  },
  {
    id: 'vault',
    icon: '🔐',
    name: 'Vault',
    arabicName: 'الخزنة',
    description: 'Encrypted file storage',
    color: '#06B6D4',
  },
];

export const HomeScreen = ({ navigation }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCardPress = (cardId) => {
    // Navigate to specific module screens
    switch (cardId) {
      case 'downloader':
        navigation.navigate('Downloader');
        break;
      case 'files':
        navigation.navigate('Files');
        break;
      case 'scanner':
        navigation.navigate('Scanner');
        break;
      case 'vision':
        // navigation.navigate('Vision');
        console.log('Vision module - Coming in Phase 2');
        break;
      case 'gallery':
        // navigation.navigate('Gallery');
        console.log('Gallery module - Coming in Phase 2');
        break;
      case 'todo':
        // navigation.navigate('ToDo');
        console.log('ToDo module - Coming in Phase 2');
        break;
      case 'vault':
        // navigation.navigate('Vault');
        console.log('Vault module - Coming in Phase 2');
        break;
      default:
        console.log('Opening:', cardId);
    }
  };

  const renderCard = ({ item, index }) => (
    <Animated.View
      entering={FadeIn.delay(index * 100).duration(600)}
      style={styles.cardWrapper}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleCardPress(item.id)}
      >
        <GlassCard intensity="medium" glowEffect={true}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{item.icon}</Text>
              <View style={styles.cardTitles}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardArabicName}>{item.arabicName}</Text>
              </View>
            </View>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.openButton,
                { borderColor: item.color },
              ]}
            >
              <Text
                style={[
                  styles.openButtonText,
                  { color: item.color },
                ]}
              >
                Open →
              </Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View
        style={styles.header}
        entering={FadeIn.duration(500)}
      >
        <AnimatedLogo size={60} />
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => setSidebarOpen(!sidebarOpen)}
            style={styles.menuButton}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Available Tools</Text>

        <FlatList
          data={CARDS}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.cardsList}
        />

        {/* Ad Banner */}
        <Animated.View
          style={styles.adBanner}
          entering={SlideInDown.delay(1000).duration(600)}
        >
          <GlassCard intensity="light">
            <Text style={styles.adText}>
              Advertisement Banner (ID: 28776956)
            </Text>
            <Text style={styles.adSubtext}>
              [Your ad network integration here]
            </Text>
          </GlassCard>
        </Animated.View>
      </ScrollView>

      {/* Sidebar - Overlay */}
      {sidebarOpen && (
        <View style={styles.sidebarOverlay}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setSidebarOpen(false)}
            style={styles.sidebarBackdrop}
          />
          <Animated.View
            style={styles.sidebar}
            entering={FadeIn.duration(300)}
          >
            <TouchableOpacity
              onPress={() => setSidebarOpen(false)}
              style={styles.sidebarClose}
            >
              <Text style={styles.sidebarCloseText}>✕</Text>
            </TouchableOpacity>

            <GlassCard intensity="medium" style={styles.developerCard}>
              <Text style={styles.developerTitle}>Developer</Text>
              <Text style={styles.developerName}>Mellouki Djamal</Text>
              <Text style={styles.developerHandle}>@MLk_JAMAL</Text>
            </GlassCard>

            <View style={styles.socialLinks}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>✈️</Text>
                <Text style={styles.socialText}>Telegram</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>📱</Text>
                <Text style={styles.socialText}>TikTok</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>📸</Text>
                <Text style={styles.socialText}>Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>💬</Text>
                <Text style={styles.socialText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.supportButton}>
              <GlassCard
                intensity="medium"
                glowEffect={true}
                style={styles.supportButtonContent}
              >
                <Text style={styles.supportButtonText}>
                  💖 Support Developer
                </Text>
              </GlassCard>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.aboutButton}
              onPress={() => navigation.navigate('About')}
            >
              <GlassCard intensity="light">
                <Text style={styles.aboutButtonText}>
                  ℹ️ About L'WESMOU OS
                </Text>
              </GlassCard>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <GlassCard intensity="light">
                <Text style={styles.settingsButtonText}>
                  ⚙️ Settings & Hardware
                </Text>
              </GlassCard>
            </TouchableOpacity>
          </Animated.View>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: `rgba(255, 255, 255, 0.05)`,
  },
  headerRight: {
    flexDirection: 'row',
    gap: SPACING.MD,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: `rgba(255, 140, 0, 0.1)`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `rgba(255, 140, 0, 0.2)`,
  },
  menuIcon: {
    fontSize: 24,
    color: COLORS.PRIMARY_ORANGE,
  },
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.LG,
  },
  sectionTitle: {
    ...Typography.HEADING_2,
    color: COLORS.GLOW_WHITE,
    marginBottom: SPACING.LG,
    marginLeft: SPACING.SM,
  },
  cardsList: {
    gap: SPACING.MD,
  },
  cardWrapper: {
    marginBottom: SPACING.SM,
  },
  cardContent: {
    gap: SPACING.MD,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: SPACING.MD,
  },
  cardIcon: {
    fontSize: 40,
  },
  cardTitles: {
    flex: 1,
  },
  cardName: {
    ...Typography.BODY_LARGE,
    color: COLORS.GLOW_WHITE,
    fontWeight: '600',
  },
  cardArabicName: {
    ...Typography.BODY_SMALL,
    color: COLORS.PRIMARY_ORANGE,
    marginTop: SPACING.XS,
  },
  cardDescription: {
    ...Typography.BODY_SMALL,
    color: COLORS.LIGHT_GRAY,
  },
  openButton: {
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  openButtonText: {
    ...Typography.BODY_SMALL,
    fontWeight: '600',
  },
  adBanner: {
    marginVertical: SPACING.XL,
  },
  adText: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.LIGHT_GRAY,
    textAlign: 'center',
  },
  adSubtext: {
    ...Typography.BODY_SMALL,
    color: COLORS.MEDIUM_GRAY,
    textAlign: 'center',
    marginTop: SPACING.XS,
  },
  // Sidebar Styles
  sidebarOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row-reverse',
    zIndex: 1000,
  },
  sidebarBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sidebar: {
    width: '75%',
    backgroundColor: COLORS.MATTE_BLACK,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.XL,
    borderLeftWidth: 1,
    borderLeftColor: `rgba(255, 255, 255, 0.1)`,
  },
  sidebarClose: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: `rgba(255, 140, 0, 0.1)`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  sidebarCloseText: {
    color: COLORS.PRIMARY_ORANGE,
    fontSize: 20,
  },
  developerCard: {
    marginBottom: SPACING.LG,
  },
  developerTitle: {
    ...Typography.BODY_SMALL,
    color: COLORS.LIGHT_GRAY,
    marginBottom: SPACING.XS,
  },
  developerName: {
    ...Typography.HEADING_3,
    color: COLORS.PRIMARY_ORANGE,
    marginBottom: SPACING.XS,
  },
  developerHandle: {
    ...Typography.BODY_SMALL,
    color: COLORS.MEDIUM_GRAY,
  },
  socialLinks: {
    gap: SPACING.MD,
    marginBottom: SPACING.LG,
  },
  socialButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: `rgba(255, 255, 255, 0.05)`,
    borderWidth: 1,
    borderColor: `rgba(255, 255, 255, 0.1)`,
  },
  socialIcon: {
    fontSize: 20,
  },
  socialText: {
    ...Typography.BODY_SMALL,
    color: COLORS.GLOW_WHITE,
    fontWeight: '500',
  },
  supportButton: {
    marginBottom: SPACING.MD,
  },
  supportButtonContent: {
    padding: SPACING.MD,
  },
  supportButtonText: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.MATTE_BLACK,
    fontWeight: '600',
    textAlign: 'center',
  },
  aboutButton: {
    marginBottom: SPACING.MD,
  },
  aboutButtonText: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.GLOW_WHITE,
    fontWeight: '500',
    textAlign: 'center',
  },
  settingsButton: {
    marginBottom: SPACING.MD,
  },
  settingsButtonText: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.GLOW_WHITE,
    fontWeight: '500',
    textAlign: 'center',
  },
});
