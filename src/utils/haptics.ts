/**
 * Haptic Feedback Utility
 * Based on SDD Appendix E - iOS Haptic Patterns
 */

import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Platform } from 'react-native';

class HapticsManager {
  private enabled: boolean = true;

  constructor() {
    if (Platform.OS !== 'ios') {
      this.enabled = false;
    }
  }

  /**
   * Light impact - for subtle interactions
   */
  light() {
    if (!this.enabled) return;
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: false,
      ignoreAndroidSystemSettings: false,
    });
  }

  /**
   * Medium impact - for standard interactions
   */
  medium() {
    if (!this.enabled) return;
    ReactNativeHapticFeedback.trigger('impactMedium');
  }

  /**
   * Heavy impact - for significant interactions
   */
  heavy() {
    if (!this.enabled) return;
    ReactNativeHapticFeedback.trigger('impactHeavy');
  }

  /**
   * Success notification
   */
  success() {
    if (!this.enabled) return;
    ReactNativeHapticFeedback.trigger('notificationSuccess');
  }

  /**
   * Warning notification
   */
  warning() {
    if (!this.enabled) return;
    ReactNativeHapticFeedback.trigger('notificationWarning');
  }

  /**
   * Error notification
   */
  error() {
    if (!this.enabled) return;
    ReactNativeHapticFeedback.trigger('notificationError');
  }

  /**
   * Selection change
   */
  selection() {
    if (!this.enabled) return;
    ReactNativeHapticFeedback.trigger('selection');
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}

export const haptics = new HapticsManager();
