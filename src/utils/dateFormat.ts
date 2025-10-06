/**
 * Date Formatting Utilities
 */

/**
 * Format a date to a readable string (e.g., "Oct 5, 2025")
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a date to a short readable string (e.g., "Oct 5")
 */
export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a date with time (e.g., "Oct 5, 2025 4:25 PM")
 */
export const formatDateTime = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Get relative time string (e.g., "2 days ago", "in 3 days")
 */
export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (Math.abs(diffMinutes) < 1) {
    return 'just now';
  } else if (Math.abs(diffHours) < 1) {
    const mins = Math.abs(diffMinutes);
    return diffMinutes < 0
      ? `${mins} minute${mins !== 1 ? 's' : ''} ago`
      : `in ${mins} minute${mins !== 1 ? 's' : ''}`;
  } else if (Math.abs(diffDays) < 1) {
    const hours = Math.abs(diffHours);
    return diffHours < 0
      ? `${hours} hour${hours !== 1 ? 's' : ''} ago`
      : `in ${hours} hour${hours !== 1 ? 's' : ''}`;
  } else {
    const days = Math.abs(diffDays);
    return diffDays < 0
      ? `${days} day${days !== 1 ? 's' : ''} ago`
      : `in ${days} day${days !== 1 ? 's' : ''}`;
  }
};
