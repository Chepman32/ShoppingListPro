/**
 * Product Types
 * Shared product-related interfaces
 */

export type ProductAttachmentType = 'link' | 'photo' | 'note' | 'location' | 'file';

export interface ProductAttachment {
  id: string;
  type: ProductAttachmentType;
  label: string;
  value?: string;
}

export interface ProductDetails {
  id?: string;
  name: string;
  brand?: string;
  sku?: string;
  imageUri?: string;
  quantity: string;
  unit: string;
  category?: string;
  notes?: string;
  description?: string;
  attachments: ProductAttachment[];
  lastUpdated: string;
}

export interface ProductNavigationParams {
  product?: Partial<ProductDetails> & {
    attachments?: Array<Partial<ProductAttachment>>;
  };
  listId?: string;
  listItemId?: string;
  listName?: string;
}

export type PartialProductParams = ProductNavigationParams['product'];
