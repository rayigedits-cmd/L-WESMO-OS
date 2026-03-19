import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, Typography } from '../constants/theme';
import { GlassCard } from '../components/GlassCard';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { detectURLType, formatFileSize } from '../utils/helpers';

const QUALITY_OPTIONS = {
  video: ['144p', '360p', '720p', '1080p', '2K', '4K'],
  audio: ['MP3', 'WAV', 'FLAC', 'AAC', 'OGG'],
  image: ['Original', 'High', 'Medium', 'Low'],
};

export const DownloaderScreen = ({ navigation, route }) => {
  const [urlInput, setUrlInput] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('720p');
  const [selectedFormat, setSelectedFormat] = useState('MP3');
  const [contentType, setContentType] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [downloads, setDownloads] = useState([]);

  // If called from Neon Link with an initial URL, preload it.
  React.useEffect(() => {
    if (route?.params?.initialUrl) {
      setUrlInput(route.params.initialUrl);
      const type = route.params.detectedType || detectURLType(route.params.initialUrl);
      setContentType(type);
      setMetadata({
        title: 'Detected Content',
        duration: 'Unknown',
        size: route.params.detectedSize || 'Unknown',
        platform: type,
        thumbnail: null,
        description: 'Detected via Neon Link',
      });
    }
  }, [route?.params]);

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;

    setIsLoading(true);
    try {
      // Detect content type
      const type = detectURLType(urlInput);
      setContentType(type);

      // Simulate metadata fetching (in production, would fetch real data)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setMetadata({
        title: 'Sample Video Title',
        duration: '10:45',
        size: '285.4 MB',
        platform: type,
        thumbnail: 'https://example.com/thumb.jpg',
        description: 'This is a sample video description.',
      });
    } catch (error) {
      console.error('Error fetching metadata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartDownload = async () => {
    if (!metadata) return;

    const newDownload = {
      id: Date.now(),
      title: metadata.title,
      progress: 0,
      status: 'downloading',
      quality: selectedQuality,
      format: selectedFormat,
      size: metadata.size,
    };

    setDownloads([newDownload, ...downloads]);

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        clearInterval(interval);
        setDownloads((prev) =>
          prev.map((d) =>
            d.id === newDownload.id
              ? { ...d, progress: 100, status: 'completed' }
              : d
          )
        );
      } else {
        setDownloads((prev) =>
          prev.map((d) =>
            d.id === newDownload.id ? { ...d, progress } : d
          )
        );
      }
    }, 500);
  };

  const renderQualityOptions = () => {
    const type = contentType.toLowerCase().includes('audio')
      ? 'audio'
      : contentType.toLowerCase().includes('video')
        ? 'video'
        : 'image';

    const options = QUALITY_OPTIONS[type] || QUALITY_OPTIONS.video;

    return options.map((option) => (
      <TouchableOpacity
        key={option}
        onPress={() => {
          if (type === 'audio') {
            setSelectedFormat(option);
          } else {
            setSelectedQuality(option);
          }
          setShowQualityModal(false);
        }}
        style={[
          styles.qualityOption,
          (type === 'audio'
            ? selectedFormat === option
            : selectedQuality === option) && styles.qualityOptionActive,
        ]}
      >
        <Text
          style={[
            styles.qualityOptionText,
            (type === 'audio'
              ? selectedFormat === option
              : selectedQuality === option) && styles.qualityOptionTextActive,
          ]}
        >
          {option}
        </Text>
      </TouchableOpacity>
    ));
  };

  const renderDownloadItem = ({ item }) => (
    <Animated.View
      style={styles.downloadItem}
      entering={FadeIn.duration(400)}
    >
      <GlassCard intensity="medium">
        <View style={styles.downloadHeader}>
          <View style={styles.downloadInfo}>
            <Text style={styles.downloadTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.downloadQuality}>
              {item.quality} • {item.format} • {item.size}
            </Text>
          </View>
          <Text style={styles.downloadProgress}>
            {Math.round(item.progress)}%
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${item.progress}%` },
            ]}
          />
        </View>

        <View style={styles.downloadFooter}>
          <Text
            style={[
              styles.downloadStatus,
              {
                color:
                  item.status === 'completed'
                    ? COLORS.SUCCESS
                    : COLORS.PRIMARY_ORANGE,
              },
            ]}
          >
            {item.status === 'completed' ? '✓ Completed' : '⬇ Downloading'}
          </Text>
        </View>
      </GlassCard>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>L'WESMOU Downloader</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* URL Input Section */}
        <Animated.View
          style={styles.inputSection}
          entering={FadeIn.duration(500)}
        >
          <Text style={styles.sectionTitle}>Paste Your URL</Text>
          <GlassCard intensity="medium">
            <TextInput
              style={styles.urlInput}
              placeholder="Paste URL here..."
              placeholderTextColor={COLORS.MEDIUM_GRAY}
              value={urlInput}
              onChangeText={setUrlInput}
              multiline={false}
            />
            <TouchableOpacity
              onPress={handleUrlSubmit}
              disabled={!urlInput.trim() || isLoading}
              style={[
                styles.submitButton,
                (!urlInput.trim() || isLoading) &&
                  styles.submitButtonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.MATTE_BLACK}
                />
              ) : (
                <Text style={styles.submitButtonText}>Detect & Preview</Text>
              )}
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        {/* Metadata Preview */}
        {metadata && (
          <Animated.View
            style={styles.metadataSection}
            entering={SlideInUp.duration(600)}
          >
            <Text style={styles.sectionTitle}>Content Preview</Text>
            <GlassCard intensity="light" style={styles.metadataCard}>
              <View style={styles.metadataContent}>
                <View style={styles.metadataIcon}>
                  <Text style={styles.metadataIconText}>
                    {contentType.includes('Audio')
                      ? '🎵'
                      : contentType.includes('Image')
                        ? '🖼️'
                        : '🎬'}
                  </Text>
                </View>
                <View style={styles.metadataDetails}>
                  <Text style={styles.metadataTitle}>{metadata.title}</Text>
                  <Text style={styles.metadataSubtext}>
                    {metadata.platform} • {metadata.duration}
                  </Text>
                  <Text style={styles.metadataSize}>{metadata.size}</Text>
                </View>
              </View>

              {/* Quality Selector */}
              <TouchableOpacity
                onPress={() => setShowQualityModal(true)}
                style={styles.qualitySelector}
              >
                <Text style={styles.qualitySelectorLabel}>
                  Quality/Format:
                </Text>
                <View style={styles.qualitySelectorValue}>
                  <Text style={styles.qualitySelectorText}>
                    {selectedFormat || selectedQuality}
                  </Text>
                  <Text style={styles.qualitySelectorArrow}>▼</Text>
                </View>
              </TouchableOpacity>

              {/* Download Button */}
              <TouchableOpacity
                onPress={handleStartDownload}
                style={styles.downloadButton}
              >
                <Text style={styles.downloadButtonText}>Start Download</Text>
              </TouchableOpacity>
            </GlassCard>
          </Animated.View>
        )}

        {/* Download History */}
        {downloads.length > 0 && (
          <Animated.View
            style={styles.historySection}
            entering={FadeIn.delay(200).duration(600)}
          >
            <Text style={styles.sectionTitle}>Active Downloads</Text>
            <FlatList
              data={downloads}
              renderItem={renderDownloadItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </Animated.View>
        )}

        {/* Ad Banner */}
        <GlassCard intensity="light" style={styles.adBanner}>
          <Text style={styles.adText}>
            Advertisement Banner (ID: 28776956)
          </Text>
        </GlassCard>
      </ScrollView>

      {/* Quality Modal */}
      <Modal
        visible={showQualityModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setShowQualityModal(false)}
              style={styles.modalClose}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Select Quality</Text>

            <ScrollView style={styles.qualityList}>
              {renderQualityOptions()}
            </ScrollView>
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
  inputSection: {
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    ...Typography.HEADING_3,
    color: COLORS.PRIMARY_ORANGE,
    marginBottom: SPACING.MD,
  },
  urlInput: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.GLOW_WHITE,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: `rgba(0, 0, 0, 0.3)`,
    marginBottom: SPACING.MD,
  },
  submitButton: {
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: COLORS.PRIMARY_ORANGE,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.MATTE_BLACK,
    fontWeight: '600',
  },
  metadataSection: {
    marginBottom: SPACING.LG,
  },
  metadataCard: {
    gap: SPACING.MD,
  },
  metadataContent: {
    flexDirection: 'row-reverse',
    gap: SPACING.MD,
    alignItems: 'center',
  },
  metadataIcon: {
    fontSize: 40,
  },
  metadataIconText: {
    fontSize: 40,
  },
  metadataDetails: {
    flex: 1,
  },
  metadataTitle: {
    ...Typography.BODY_LARGE,
    color: COLORS.GLOW_WHITE,
    fontWeight: '600',
  },
  metadataSubtext: {
    ...Typography.BODY_SMALL,
    color: COLORS.LIGHT_GRAY,
    marginTop: SPACING.XS,
  },
  metadataSize: {
    ...Typography.BODY_SMALL,
    color: COLORS.PRIMARY_ORANGE,
    fontWeight: '600',
    marginTop: SPACING.XS,
  },
  qualitySelector: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: `rgba(0, 0, 0, 0.2)`,
  },
  qualitySelectorLabel: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.LIGHT_GRAY,
  },
  qualitySelectorValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  qualitySelectorText: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.PRIMARY_ORANGE,
    fontWeight: '600',
  },
  qualitySelectorArrow: {
    color: COLORS.PRIMARY_ORANGE,
    fontSize: 12,
  },
  downloadButton: {
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: COLORS.PRIMARY_ORANGE,
    alignItems: 'center',
  },
  downloadButtonText: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.MATTE_BLACK,
    fontWeight: '600',
  },
  historySection: {
    marginBottom: SPACING.LG,
  },
  downloadItem: {
    marginBottom: SPACING.MD,
  },
  downloadHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  downloadInfo: {
    flex: 1,
  },
  downloadTitle: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.GLOW_WHITE,
    fontWeight: '600',
  },
  downloadQuality: {
    ...Typography.BODY_SMALL,
    color: COLORS.LIGHT_GRAY,
    marginTop: SPACING.XS,
  },
  downloadProgress: {
    ...Typography.BODY_LARGE,
    color: COLORS.PRIMARY_ORANGE,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    backgroundColor: `rgba(255, 255, 255, 0.1)`,
    overflow: 'hidden',
    marginBottom: SPACING.MD,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY_ORANGE,
    borderRadius: 4,
  },
  downloadFooter: {
    alignItems: 'flex-end',
  },
  downloadStatus: {
    ...Typography.BODY_SMALL,
    fontWeight: '600',
  },
  adBanner: {
    marginTop: SPACING.XL,
    marginBottom: SPACING.XL,
  },
  adText: {
    ...Typography.BODY_SMALL,
    color: COLORS.LIGHT_GRAY,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: `rgba(0, 0, 0, 0.8)`,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.MATTE_BLACK,
    borderTopLeftRadius: BORDER_RADIUS.XL,
    borderTopRightRadius: BORDER_RADIUS.XL,
    maxHeight: '70%',
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.LG,
  },
  modalClose: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: `rgba(255, 255, 255, 0.1)`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.MD,
    alignSelf: 'center',
  },
  modalCloseText: {
    color: COLORS.GLOW_WHITE,
    fontSize: 18,
  },
  modalTitle: {
    ...Typography.HEADING_3,
    color: COLORS.PRIMARY_ORANGE,
    marginBottom: SPACING.LG,
    textAlign: 'center',
  },
  qualityList: {
    gap: SPACING.SM,
  },
  qualityOption: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: `rgba(255, 255, 255, 0.05)`,
    borderWidth: 1,
    borderColor: `rgba(255, 255, 255, 0.1)`,
    marginBottom: SPACING.SM,
  },
  qualityOptionActive: {
    backgroundColor: COLORS.PRIMARY_ORANGE,
    borderColor: COLORS.PRIMARY_ORANGE,
  },
  qualityOptionText: {
    ...Typography.BODY_MEDIUM,
    color: COLORS.LIGHT_GRAY,
    textAlign: 'center',
  },
  qualityOptionTextActive: {
    color: COLORS.MATTE_BLACK,
    fontWeight: '600',
  },
});
