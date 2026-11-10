// utils/haptics.ts
import * as ExpoHaptics from 'expo-haptics';
import { Platform } from 'react-native';

export const ImpactFeedbackStyle = ExpoHaptics.ImpactFeedbackStyle;
export const NotificationFeedbackType = ExpoHaptics.NotificationFeedbackType;

export const impactAsync = async (style?: ExpoHaptics.ImpactFeedbackStyle): Promise<void> => {
  if (Platform.OS === 'web') return;
  try {
    await ExpoHaptics.impactAsync(style);
  } catch {
    // Graceful fallback on web or unsupported devices
  }
};

export const selectionAsync = async (): Promise<void> => {
  if (Platform.OS === 'web') return;
  try {
    await ExpoHaptics.selectionAsync();
  } catch {
    // Graceful fallback on web or unsupported devices
  }
};

export const notificationAsync = async (type?: ExpoHaptics.NotificationFeedbackType): Promise<void> => {
  if (Platform.OS === 'web') return;
  try {
    await ExpoHaptics.notificationAsync(type);
  } catch {
    // Graceful fallback on web or unsupported devices
  }
};

export default {
  ImpactFeedbackStyle,
  NotificationFeedbackType,
  impactAsync,
  selectionAsync,
  notificationAsync,
};
