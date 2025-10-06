/**
 * Pixabay API Service
 * Provides access to Pixabay's free image search API
 */

import axios from 'axios';

const PIXABAY_API_KEY = '52632912-14f5419b672ec4c0ad535d20e';
const PIXABAY_BASE_URL = 'https://pixabay.com/api/';

export interface PixabayImage {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  views: number;
  downloads: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

export interface PixabaySearchResponse {
  total: number;
  totalHits: number;
  hits: PixabayImage[];
}

export interface PixabaySearchParams {
  query: string;
  page?: number;
  perPage?: number;
  imageType?: 'all' | 'photo' | 'illustration' | 'vector';
  orientation?: 'all' | 'horizontal' | 'vertical';
  category?: string;
  minWidth?: number;
  minHeight?: number;
  safesearch?: boolean;
}

/**
 * Search for images on Pixabay
 */
export const searchImages = async (
  params: PixabaySearchParams
): Promise<PixabaySearchResponse> => {
  try {
    const response = await axios.get<PixabaySearchResponse>(PIXABAY_BASE_URL, {
      params: {
        key: PIXABAY_API_KEY,
        q: params.query,
        page: params.page || 1,
        per_page: params.perPage || 20,
        image_type: params.imageType || 'photo',
        orientation: params.orientation || 'all',
        category: params.category,
        min_width: params.minWidth,
        min_height: params.minHeight,
        safesearch: params.safesearch !== false,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Pixabay API error:', error);
    throw new Error('Failed to fetch images from Pixabay');
  }
};

/**
 * Get a single image by ID
 */
export const getImageById = async (id: number): Promise<PixabayImage | null> => {
  try {
    const response = await axios.get<PixabaySearchResponse>(PIXABAY_BASE_URL, {
      params: {
        key: PIXABAY_API_KEY,
        id,
      },
    });

    return response.data.hits[0] || null;
  } catch (error) {
    console.error('Pixabay API error:', error);
    return null;
  }
};

export const pixabayService = {
  searchImages,
  getImageById,
};

export default pixabayService;
