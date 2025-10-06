/**
 * Pixabay Image Search Modal
 * Allows users to search and select images from Pixabay
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { colors, spacing, typography, borderRadius } from '../theme';
import { pixabayService, type PixabayImage } from '../services/pixabayService';

export interface PixabaySearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  productName: string;
}

export const PixabaySearchModal: React.FC<PixabaySearchModalProps> = ({
  visible,
  onClose,
  onSelectImage,
  productName,
}) => {
  const { t } = useTranslation();
  const [images, setImages] = useState<PixabayImage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && productName.trim()) {
      handleSearch();
    }
  }, [visible, productName]);

  const handleSearch = async () => {
    if (!productName.trim()) {
      return;
    }

    setLoading(true);

    try {
      const result = await pixabayService.searchImages({
        query: productName.trim(),
        perPage: 30,
        imageType: 'photo',
        safesearch: true,
      });

      setImages(result.hits);
    } catch (error) {
      console.error('Pixabay search error:', error);
      Alert.alert(t('product.pixabayError'));
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = (image: PixabayImage) => {
    onSelectImage(image.webformatURL);
    handleClose();
  };

  const handleClose = () => {
    setImages([]);
    onClose();
  };

  const renderImageItem = ({ item }: { item: PixabayImage }) => (
    <Pressable
      style={styles.imageItem}
      onPress={() => handleSelectImage(item)}
      accessibilityRole="button"
      accessibilityLabel={`Select image: ${item.tags}`}
    >
      <Image
        source={{ uri: item.previewURL }}
        style={styles.imagePreview}
        resizeMode="cover"
      />
      <View style={styles.imageOverlay}>
        <Text style={styles.imageUser} numberOfLines={1}>
          {item.user}
        </Text>
      </View>
    </Pressable>
  );

  const keyExtractor = (item: PixabayImage) => item.id.toString();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('product.pixabaySearch')}</Text>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <View style={styles.searchInfo}>
          <Text style={styles.searchLabel}>Searching for:</Text>
          <Text style={styles.searchTerm}>{productName}</Text>
        </View>

        <View style={styles.content}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          )}

          {!loading && images.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>{t('product.noResults')}</Text>
            </View>
          )}

          {!loading && images.length > 0 && (
            <FlatList
              data={images}
              renderItem={renderImageItem}
              keyExtractor={keyExtractor}
              numColumns={2}
              contentContainerStyle={styles.imageGrid}
              showsVerticalScrollIndicator={true}
            />
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Images provided by Pixabay
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  title: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
    color: colors.text,
  },
  closeButton: {
    padding: spacing.xs,
  },
  closeText: {
    fontSize: typography.h3,
    color: colors.textSecondary,
  },
  searchInfo: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  searchTerm: {
    fontSize: typography.body,
    fontWeight: typography.weightSemibold,
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  imageGrid: {
    padding: spacing.sm,
  },
  imageItem: {
    flex: 1,
    margin: spacing.xs,
    aspectRatio: 1,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs / 2,
  },
  imageUser: {
    fontSize: typography.caption,
    color: '#fff',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  footerText: {
    fontSize: typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});

export default PixabaySearchModal;
