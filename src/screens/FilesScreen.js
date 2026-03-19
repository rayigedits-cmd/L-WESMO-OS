import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, Typography } from '../constants/theme';
import { GlassCard } from '../components/GlassCard';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const FILE_OPERATIONS = [
  {
    id: 'convert-pdf',
    icon: '📄',
    title: 'Convert to PDF',
    description: 'Convert images or text to PDF format',
    color: '#FF6B6B',
  },
  {
    id: 'encrypt',
    icon: '🔐',
    title: 'Encrypt & Secure',
    description: 'Add password protection and signatures',
    color: '#4A90E2',
  },
  {
    id: 'edit',
    icon: '✏️',
    title: 'Edit Document',
    description: 'Edit text, merge files, modify content',
    color: '#50E3C2',
  },
  {
    id: 'translate',
    icon: '🌐',
    title: 'Smart Translate',
    description: 'Translate documents locally (100% private)',
    color: '#B8E986',
  },
  {
    id: 'extract',
    icon: '📋',
    title: 'Extract Text/Data',
    description: 'OCR and data extraction from files',
    color: '#F5A623',
  },
  {
    id: 'compress',
    icon: '📦',
    title: 'Compress Files',
    description: 'Reduce file size without quality loss',
    color: '#BD10E0',
  },
];

export const FilesScreen = ({ navigation }) => {
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  const handleOperationStart = async (operation) => {
    setSelectedOperation(operation);
    setShowModal(true);
    setIsProcessing(true);
    setProcessingStatus('Initializing...');

    // Simulate processing
    setTimeout(() => {
      setProcessingStatus('Processing your file...');
    }, 500);

    setTimeout(() => {
      setProcessingStatus('Almost done...');
    }, 1500);

    setTimeout(() => {
      setIsProcessing(false);
      setProcessingStatus('Ready to download');
    }, 2500);
  };

  const renderOperationCard = ({ item, index }) => (
    <Animated.View
      style={styles.cardContainer}
      entering={FadeIn.delay(index * 100).duration(600)}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleOperationStart(item)}
      >
        <GlassCard intensity="medium">
          <View style={styles.operationContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.operationIcon}>{item.icon}</Text>
            </View>
            <View style={styles.operationInfo}>
              <Text style={styles.operationTitle}>{item.title}</Text>
              <Text style={styles.operationDescription}>
                {item.description}
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </View>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>L'WESMOU Files</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro */}
        <Animated.View
          style={styles.introSection}
          entering={FadeIn.duration(500)}
        >
          <GlassCard intensity="light">
            <Text style={styles.introText}>
              Professional document processing suite. All processing happens
              locally on your device - zero cloud uploads, 100% private.
            </Text>
          </GlassCard>
        </Animated.View>

        {/* Operations Grid */}
        <Text style={styles.sectionTitle}>Available Operations</Text>
        <FlatList
          data={FILE_OPERATIONS}
          renderItem={renderOperationCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          numColumns={1}
          contentContainerStyle={styles.operationsList}
        />

        {/* Features */}
        <Animated.View
          style={styles.featuresSection}
          entering={FadeIn.delay(200).duration(600)}
        >
          <Text style={styles.sectionTitle}>Key Features</Text>
          <GlassCard intensity="light">
            <Text style={styles.featureList}>
              {`✓ Multiple Format Support (PDF, DOCX, XLSX, TXT)
✓ Local Encryption with Advanced Algorithms
✓ Digital Signature Support
✓ Batch Processing Capabilities
✓ Smart Text Recognition & Extraction
✓ Format Conversion without Quality Loss
✓ File Merging & Splitting
✓ Metadata Management
✓ 100% Offline Processing
✓ Zero Data Logging`}
            </Text>
          </GlassCard>
        </Animated.View>

        {/* Ad Banner */}
        <GlassCard intensity="light" style={styles.adBanner}>
          <Text style={styles.adText}>
            Advertisement Banner (ID: 28776956)
          </Text>
        </GlassCard>
      </ScrollView>

      {/* Processing Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => !isProcessing && setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {!isProcessing && (
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.modalClose}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            )}

            <Animated.View
              style={styles.processingContainer}
              entering={FadeIn.duration(600)}
            >
              <Text style={styles.processingIcon}>
                {selectedOperation?.icon}
              </Text>
              <Text style={styles.processingTitle}>
                {selectedOperation?.title}
              </Text>

              {isProcessing ? (
                <>
                  <ActivityIndicator
                    size="large"
                    color={COLORS.PRIMARY_ORANGE}
                    style={styles.spinner}
                  />
                  <Text style={styles.processingStatus}>
                    {processingStatus}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.completeIcon}>✓</Text>
                  <Text style={styles.completeText}>{processingStatus}</Text>
                  <TouchableOpacity
                    onPress={() => setShowModal(false)}
                    style={styles.downloadButton}
                  >
                    <Text style={styles.downloadButtonText}>
                      Download Result
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>
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
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.LG,
  },
  introSection: {
    marginBottom: SPACING.LG,
  },
  introText: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.LIGHT_GRAY,
    lineHeight: 22,
  },
  sectionTitle: {
    ...Typography.HEADING_3,
    color: COLORS.PRIMARY_ORANGE,
    marginBottom: SPACING.MD,
    marginTop: SPACING.LG,
  },
  operationsList: {
    gap: SPACING.MD,
    paddingBottom: SPACING.LG,
  },
  cardContainer: {
    marginBottom: SPACING.SM,
  },
  operationContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: SPACING.MD,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: `rgba(255, 255, 255, 0.05)`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  operationIcon: {
    fontSize: 28,
  },
  operationInfo: {
    flex: 1,
  },
  operationTitle: {
    ...Typography.BODY_LARGE,
    color: COLORS.GLOW_WHITE,
    fontWeight: '600',
    marginBottom: SPACING.XS,
  },
  operationDescription: {
    ...Typography.BODY_SMALL,
    color: COLORS.LIGHT_GRAY,
  },
  arrow: {
    ...Typography.HEADING_2,
    color: COLORS.PRIMARY_ORANGE,
  },
  featuresSection: {
    marginBottom: SPACING.LG,
  },
  featureList: {
    ...Typography.BODY_SMALL,
    color: COLORS.LIGHT_GRAY,
    lineHeight: 22,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: `rgba(0, 0, 0, 0.9)`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: BORDER_RADIUS.XL,
    backgroundColor: COLORS.MATTE_BLACK,
    padding: SPACING.LG,
    borderWidth: 1,
    borderColor: `rgba(255, 140, 0, 0.3)`,
  },
  modalClose: {
    position: 'absolute',
    top: SPACING.MD,
    right: SPACING.MD,
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: `rgba(255, 255, 255, 0.1)`,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalCloseText: {
    color: COLORS.GLOW_WHITE,
    fontSize: 18,
  },
  processingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.XL,
  },
  processingIcon: {
    fontSize: 64,
    marginBottom: SPACING.LG,
  },
  processingTitle: {
    ...Typography.HEADING_2,
    color: COLORS.GLOW_WHITE,
    marginBottom: SPACING.LG,
    textAlign: 'center',
  },
  spinner: {
    marginVertical: SPACING.LG,
  },
  processingStatus: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.PRIMARY_ORANGE,
    marginTop: SPACING.MD,
    fontWeight: '600',
  },
  completeIcon: {
    fontSize: 64,
    color: COLORS.SUCCESS,
    marginVertical: SPACING.LG,
  },
  completeText: {
    ...Typography.HEADING_3,
    color: COLORS.SUCCESS,
    marginBottom: SPACING.LG,
  },
  downloadButton: {
    width: '100%',
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: COLORS.PRIMARY_ORANGE,
    alignItems: 'center',
    marginTop: SPACING.LG,
  },
  downloadButtonText: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.MATTE_BLACK,
    fontWeight: '600',
  },
});
