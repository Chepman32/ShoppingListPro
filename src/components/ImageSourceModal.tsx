/**
 * Image Source Selection Modal
 * Allows users to choose between gallery or Pixabay for image selection
 */

import React from 'react';
import { View, Text, Modal, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, typography, borderRadius } from '../theme';
import { Button } from './core';

export interface ImageSourceModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectGallery: () => void;
  onSelectPixabay: () => void;
}

export const ImageSourceModal: React.FC<ImageSourceModalProps> = ({
  visible,
  onClose,
  onSelectGallery,
  onSelectPixabay,
}) => {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{t('product.chooseImageSource')}</Text>

          <View style={styles.optionsContainer}>
            <Pressable
              style={styles.optionCard}
              onPress={onSelectGallery}
              accessibilityRole="button"
              accessibilityLabel={t('product.chooseFromLibrary')}
            >
              <Text style={styles.optionIcon}>📷</Text>
              <Text style={styles.optionTitle}>{t('product.chooseFromLibrary')}</Text>
              <Text style={styles.optionDescription}>
                Select from your device
              </Text>
            </Pressable>

            <Pressable
              style={styles.optionCard}
              onPress={onSelectPixabay}
              accessibilityRole="button"
              accessibilityLabel={t('product.searchPixabay')}
            >
              <Text style={styles.optionIcon}>🔍</Text>
              <Text style={styles.optionTitle}>{t('product.searchPixabay')}</Text>
              <Text style={styles.optionDescription}>
                Search free stock images
              </Text>
            </Pressable>
          </View>

          <View style={styles.actions}>
            <Button variant="ghost" size="small" onPress={onClose}>
              {t('common.cancel')}
            </Button>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  optionCard: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.background,
    padding: spacing.lg,
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  optionTitle: {
    fontSize: typography.h5,
    fontWeight: typography.weightSemibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  optionDescription: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default ImageSourceModal;
