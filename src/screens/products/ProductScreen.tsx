/**
 * Product Detail Screen
 * Allows viewing and editing product information with attachments
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Input, Button } from '../../components/core';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { useTranslation } from 'react-i18next';

const measurementUnits = ['kg', 'g', 'lb', 'oz', 'l', 'ml', 'pcs', 'pack'];

type AttachmentType = 'link' | 'photo' | 'note' | 'location' | 'file';
type AttachmentInput = Partial<Attachment> & { type?: AttachmentType };

interface Attachment {
  id: string;
  type: AttachmentType;
  label: string;
  value?: string;
}

interface Product {
  name: string;
  brand?: string;
  sku?: string;
  imageUri?: string;
  quantity: string;
  unit: string;
  category?: string;
  notes?: string;
  description?: string;
  attachments: Attachment[];
  lastUpdated: string;
}

const attachmentTypeMeta: Record<AttachmentType, { label: string; icon: string; placeholder: string }>
  = {
    link: { label: 'Link', icon: '🔗', placeholder: 'https://example.com' },
    photo: { label: 'Photo', icon: '📷', placeholder: 'Photo description' },
    note: { label: 'Note', icon: '📝', placeholder: 'Write a quick note' },
    location: { label: 'Location', icon: '📍', placeholder: 'Store aisle or address' },
    file: { label: 'Attachment', icon: '📎', placeholder: 'Filename or description' },
  };

const DEFAULT_PRODUCT_TEMPLATE: Product = {
  name: 'Organic Honeycrisp Apples',
  brand: 'Nature Farms',
  sku: 'APL-001',
  quantity: '1',
  unit: 'kg',
  category: 'Produce',
  description: 'Crisp, sweet apples sourced from local farms. Perfect for snacking or baking.',
  notes: 'Keep refrigerated for longer freshness.',
  attachments: [
    {
      id: 'att-1',
      type: 'note',
      label: 'Storage Tip',
      value: 'Store in crisper drawer to maintain texture.',
    },
    {
      id: 'att-2',
      type: 'link',
      label: 'Recipe Idea',
      value: 'https://example.com/apple-pie',
    },
  ],
  lastUpdated: new Date().toISOString(),
};

const cloneDefaultProduct = (): Product => ({
  ...DEFAULT_PRODUCT_TEMPLATE,
  attachments: DEFAULT_PRODUCT_TEMPLATE.attachments.map((attachment) => ({ ...attachment })),
  lastUpdated: new Date().toISOString(),
});

const normalizeAttachments = (attachments?: AttachmentInput[]): Attachment[] => {
  if (!attachments || attachments.length === 0) {
    return [];
  }

  return attachments.map((attachment, index) => {
    const type = (attachment.type ?? 'note') as AttachmentType;
    const meta = attachmentTypeMeta[type];

    return {
      id: attachment.id ?? `att-${Date.now()}-${index}`,
      type,
      label: attachment.label ?? meta.label,
      value: attachment.value,
    };
  });
};

const buildProductState = (overrides?: Partial<Product>): Product => {
  const base = cloneDefaultProduct();

  if (!overrides) {
    return base;
  }

  const quantityValue = overrides.quantity ?? base.quantity;
  const normalizedQuantity =
    typeof quantityValue === 'number' ? quantityValue.toString() : quantityValue ?? '1';

  const attachments =
    overrides.attachments !== undefined
      ? normalizeAttachments(overrides.attachments as AttachmentInput[])
      : base.attachments;

  return {
    ...base,
    ...overrides,
    quantity: normalizedQuantity || '1',
    unit: overrides.unit ?? base.unit,
    attachments,
    lastUpdated: overrides.lastUpdated ?? new Date().toISOString(),
  };
};

export const ProductScreen = () => {
  const { t } = useTranslation();
  const route = useRoute();
  const params = route.params as { product?: Partial<Product> } | undefined;
  const derivedProduct = useMemo(() => buildProductState(params?.product), [params]);

  const [product, setProduct] = useState<Product>(derivedProduct);
  const [draft, setDraft] = useState<Product>(derivedProduct);
  const [isEditing, setIsEditing] = useState(false);
  const [isAttachmentModalVisible, setAttachmentModalVisible] = useState(false);
  const [newAttachmentType, setNewAttachmentType] = useState<AttachmentType>('note');
  const [newAttachmentLabel, setNewAttachmentLabel] = useState('');
  const [newAttachmentValue, setNewAttachmentValue] = useState('');

  useEffect(() => {
    setProduct(derivedProduct);
    setDraft(derivedProduct);
  }, [derivedProduct]);

  const lastUpdatedLabel = useMemo(() => {
    const date = new Date(product.lastUpdated);
    return date.toLocaleString();
  }, [product.lastUpdated]);

  const beginEdit = () => {
    setDraft(product);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(product);
    setIsEditing(false);
    resetAttachmentDraft();
  };

  const saveProduct = () => {
    setProduct({
      ...draft,
      lastUpdated: new Date().toISOString(),
    });
    setIsEditing(false);
    resetAttachmentDraft();
  };

  const updateDraft = (updates: Partial<Product>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  };

  const resetAttachmentDraft = () => {
    setAttachmentModalVisible(false);
    setNewAttachmentType('note');
    setNewAttachmentLabel('');
    setNewAttachmentValue('');
  };

  const handleAddAttachment = () => {
    if (!newAttachmentLabel.trim()) {
      return;
    }

    const attachment: Attachment = {
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: newAttachmentType,
      label: newAttachmentLabel.trim(),
      value: newAttachmentValue.trim() || undefined,
    };

    updateDraft({ attachments: [...draft.attachments, attachment] });
    resetAttachmentDraft();
  };

  const handleRemoveAttachment = (id: string) => {
    updateDraft({ attachments: draft.attachments.filter((att) => att.id !== id) });
  };

  const handleChooseImage = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
      if (result.didCancel) return;
      const uri = result.assets?.[0]?.uri;
      if (uri) {
        updateDraft({ imageUri: uri });
      }
    } catch (error) {
      console.error('Image selection failed', error);
      Alert.alert(t('product.imageSelectionFailed'));
    }
  };

  const handleImagePress = () => {
    if (!isEditing) return;

    const buttons: Array<{ text: string; style?: 'cancel' | 'destructive'; onPress?: () => void }>
      = [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('product.chooseFromLibrary'), onPress: handleChooseImage },
      ];

    if (draft.imageUri) {
      buttons.push({
        text: t('product.removeImage'),
        style: 'destructive',
        onPress: () => updateDraft({ imageUri: undefined }),
      });
    }

    Alert.alert(t('product.productImage'), t('product.updatePhoto'), buttons);
  };

  const renderAttachment = (attachment: Attachment, isDraft = false) => {
    const meta = attachmentTypeMeta[attachment.type];
    return (
      <View key={attachment.id} style={styles.attachmentCard}>
        <View style={styles.attachmentHeader}>
          <Text style={styles.attachmentIcon}>{meta.icon}</Text>
          <View style={styles.attachmentTextGroup}>
            <Text style={styles.attachmentLabel}>{attachment.label}</Text>
            {attachment.value && (
              <Text style={styles.attachmentValue}>{attachment.value}</Text>
            )}
          </View>
          {isDraft && isEditing && (
            <Pressable onPress={() => handleRemoveAttachment(attachment.id)}>
              <Text style={styles.removeAttachmentText}>{t('common.delete')}</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  const activeProduct = isEditing ? draft : product;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{activeProduct.name}</Text>
          {isEditing ? (
            <View style={styles.editActions}>
              <Button variant="ghost" size="small" onPress={cancelEdit}>
                {t('common.cancel')}
              </Button>
              <Button variant="primary" size="small" onPress={saveProduct}>
                {t('common.save')}
              </Button>
            </View>
          ) : (
            <Button variant="outline" size="small" onPress={beginEdit}>
              {t('common.edit')}
            </Button>
          )}
        </View>

        <Pressable
          onPress={handleImagePress}
          style={[styles.imageContainer, !activeProduct.imageUri && styles.imagePlaceholder]}
        >
          {activeProduct.imageUri ? (
            <Image source={{ uri: activeProduct.imageUri }} style={styles.productImage} />
          ) : (
            <View style={styles.placeholderContent}>
              <Text style={styles.placeholderEmoji}>🛒</Text>
              <Text style={styles.placeholderText}>
                {isEditing ? t('product.tapToAddImage') : t('product.noImage')}
              </Text>
            </View>
          )}
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('product.details')}</Text>
          {isEditing ? (
            <View style={styles.formGroup}>
              <Input
                label={t('products.nameLabel', { defaultValue: 'Product Name' })}
                value={draft.name}
                onChangeText={(text) => updateDraft({ name: text })}
              />
              <Input
                label={t('products.brandLabel', { defaultValue: 'Brand' })}
                value={draft.brand}
                onChangeText={(text) => updateDraft({ brand: text })}
              />
              <Input
                label={t('products.skuLabel', { defaultValue: 'SKU / Code' })}
                value={draft.sku}
                onChangeText={(text) => updateDraft({ sku: text })}
              />
              <Input
                label={t('products.categoryLabel', { defaultValue: 'Category' })}
                value={draft.category}
                onChangeText={(text) => updateDraft({ category: text })}
              />
            </View>
          ) : (
            <View style={styles.readOnlyBlock}>
              {product.brand && (
                <Text style={styles.readOnlyText}>Brand: {product.brand}</Text>
              )}
              {product.sku && (
                <Text style={styles.readOnlyText}>SKU: {product.sku}</Text>
              )}
              {product.category && (
                <Text style={styles.readOnlyText}>Category: {product.category}</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('product.measurements')}</Text>
          {isEditing ? (
            <View>
              <Input
                label={t('products.quantityLabel', { defaultValue: 'Quantity' })}
                keyboardType="decimal-pad"
                value={draft.quantity}
                onChangeText={(text) => updateDraft({ quantity: text })}
              />
              <View style={styles.unitPillRow}>
                {measurementUnits.map((unit) => (
                  <Pressable
                    key={unit}
                    onPress={() => updateDraft({ unit })}
                    style={[
                      styles.unitPill,
                      draft.unit === unit && styles.unitPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.unitPillText,
                        draft.unit === unit && styles.unitPillTextActive,
                      ]}
                    >
                      {unit.toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.readOnlyBlock}>
              <Text style={styles.readOnlyText}>
                {product.quantity} {product.unit.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('product.description')}</Text>
          {isEditing ? (
            <Input
              multiline
              style={styles.multilineInput}
              value={draft.description}
              onChangeText={(text) => updateDraft({ description: text })}
              placeholder="Add product description"
            />
          ) : (
            <Text style={styles.bodyText}>{product.description || t('product.noDescription')}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('product.notes')}</Text>
          {isEditing ? (
            <Input
              multiline
              style={styles.multilineInput}
              value={draft.notes}
              onChangeText={(text) => updateDraft({ notes: text })}
              placeholder={t('product.storageInstructions')}
            />
          ) : (
            <Text style={styles.bodyText}>{product.notes || t('product.noNotes')}</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{t('product.attachments')}</Text>
            {isEditing && (
              <Button variant="ghost" size="small" onPress={() => setAttachmentModalVisible(true)}>
                {t('product.addAttachment')}
              </Button>
            )}
          </View>
          {activeProduct.attachments.length === 0 ? (
            <Text style={styles.bodyTextMuted}>
              {isEditing ? t('product.addAttachmentHint') : t('product.noAttachments')}
            </Text>
          ) : (
            activeProduct.attachments.map((attachment) =>
              renderAttachment(attachment, isEditing)
            )
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t('product.lastUpdated')} {lastUpdatedLabel}
          </Text>
        </View>
      </ScrollView>

      <Modal visible={isAttachmentModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('product.addAttachment')}</Text>
            <View style={styles.modalTypesRow}>
              {(Object.keys(attachmentTypeMeta) as AttachmentType[]).map((type) => {
                const meta = attachmentTypeMeta[type];
                const isActive = newAttachmentType === type;
                return (
                  <Pressable
                    key={type}
                    onPress={() => setNewAttachmentType(type)}
                    style={[styles.modalTypePill, isActive && styles.modalTypePillActive]}
                  >
                    <Text style={[styles.modalTypeText, isActive && styles.modalTypeTextActive]}>
                      {meta.icon} {meta.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Input
              label={t('products.attachmentTitleLabel', { defaultValue: 'Title' })}
              value={newAttachmentLabel}
              onChangeText={setNewAttachmentLabel}
            />
            <Input
              label={t('products.attachmentDetailsLabel', { defaultValue: 'Details' })}
              value={newAttachmentValue}
              onChangeText={setNewAttachmentValue}
              placeholder={attachmentTypeMeta[newAttachmentType].placeholder}
            />
            <View style={styles.modalActions}>
              <Button variant="ghost" size="small" onPress={resetAttachmentDraft}>
                {t('common.cancel', { defaultValue: 'Cancel' })}
              </Button>
              <Button
                variant="primary"
                size="small"
                onPress={handleAddAttachment}
                disabled={!newAttachmentLabel.trim()}
              >
                {t('common.add', { defaultValue: 'Add' })}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: typography.h2,
    fontWeight: typography.weightBold,
    color: colors.text,
    flex: 1,
    marginRight: spacing.md,
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  imageContainer: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    height: 220,
  },
  imagePlaceholder: {
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderWidth: 1,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  placeholderEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  placeholderText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  formGroup: {
    gap: spacing.md,
  },
  readOnlyBlock: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.sm,
  },
  readOnlyText: {
    fontSize: typography.body,
    color: colors.text,
  },
  unitPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  unitPill: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  unitPillActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  unitPillText: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
  },
  unitPillTextActive: {
    color: colors.primary,
    fontWeight: typography.weightSemibold,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  bodyText: {
    fontSize: typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  bodyTextMuted: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  attachmentCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  attachmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  attachmentTextGroup: {
    flex: 1,
    gap: spacing.xs / 2,
  },
  attachmentLabel: {
    fontSize: typography.body,
    fontWeight: typography.weightSemibold,
    color: colors.text,
  },
  attachmentValue: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
  },
  removeAttachmentText: {
    fontSize: typography.caption,
    color: colors.error,
    fontWeight: typography.weightSemibold,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  footerText: {
    fontSize: typography.caption,
    color: colors.textTertiary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: typography.h4,
    fontWeight: typography.weightSemibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  modalTypesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  modalTypePill: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  modalTypePillActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  modalTypeText: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
  },
  modalTypeTextActive: {
    color: colors.primary,
    fontWeight: typography.weightSemibold,
  },
  modalActions: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
});

export default ProductScreen;
