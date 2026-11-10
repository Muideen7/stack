// app/(auth)/demo-settings.tsx
import React from 'react';
import { View, Text, Pressable, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Faders,
  CircleHalf,
  Sun,
  Moon,
  Lightbulb,
  ArrowCounterClockwise,
  CaretRight,
} from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import * as Haptics from '@/utils/haptics';

import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import { useTransactionStore } from '../../store/transactionStore';
import { useRecipientStore } from '../../store/recipientStore';

export default function DemoSettingsScreen() {
  const router = useRouter();
  const { colorScheme, setColorScheme } = useColorScheme();

  const { profile, setThemeMode, toggleDemoHints, resetAll, setAuthenticated } = useAuthStore();
  const resetWallet = useWalletStore((s) => s.resetToSeed);
  const resetTx = useTransactionStore((s) => s.resetToSeed);
  const resetRecipients = useRecipientStore((s) => s.resetToSeed);

  const activeMode = profile.themeMode || 'system';
  const isDark = colorScheme === 'dark';

  const handleSelectTheme = (mode: 'system' | 'light' | 'dark') => {
    Haptics.selectionAsync();
    setThemeMode(mode);
    setColorScheme(mode);
  };

  const handleToggleHints = () => {
    Haptics.selectionAsync();
    toggleDemoHints();
  };

  const handleResetData = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    resetAll();
    resetWallet();
    resetTx();
    resetRecipients();
    router.replace('/(auth)/onboarding');
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAuthenticated(true);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.modalRoot}>
      {/* Dimmed backdrop dismiss area */}
      <Pressable
        style={styles.scrimBackdrop}
        onPress={handleClose}
      />

      {/* Bottom Sheet Container */}
      <SafeAreaView
        edges={['bottom']}
        style={[
          styles.sheetContainer,
          isDark && styles.sheetContainerDark,
        ]}
      >
        {/* Sheet Handle */}
        <View style={[styles.dragHandle, isDark && styles.dragHandleDark]} />

        {/* Icon Badge */}
        <View style={[styles.iconBadge, isDark && styles.iconBadgeDark]}>
          <Faders
            size={22}
            color={isDark ? '#4ADE80' : '#204E35'}
            weight="bold"
          />
        </View>

        {/* Title */}
        <Text style={[styles.sheetTitle, isDark && styles.sheetTitleDark]}>
          Demo settings
        </Text>

        {/* Appearance Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            APPEARANCE
          </Text>
        </View>

        {/* 3 Theme Selector Cards */}
        <View style={styles.themeRow}>
          {/* Auto (System) */}
          <Pressable
            onPress={() => handleSelectTheme('system')}
            style={[
              styles.themeCard,
              isDark && styles.themeCardDark,
              activeMode === 'system' && (isDark ? styles.themeCardActiveDark : styles.themeCardActive),
            ]}
          >
            <CircleHalf
              size={22}
              color={
                activeMode === 'system'
                  ? (isDark ? '#4ADE80' : '#204E35')
                  : (isDark ? '#8B9B90' : '#4C5850')
              }
              weight="fill"
            />
            <Text
              style={[
                styles.themeCardText,
                isDark && styles.themeCardTextDark,
                activeMode === 'system' && (isDark ? styles.themeCardTextActiveDark : styles.themeCardTextActive),
              ]}
            >
              Auto
            </Text>
          </Pressable>

          {/* Light */}
          <Pressable
            onPress={() => handleSelectTheme('light')}
            style={[
              styles.themeCard,
              isDark && styles.themeCardDark,
              activeMode === 'light' && (isDark ? styles.themeCardActiveDark : styles.themeCardActive),
            ]}
          >
            <Sun
              size={22}
              color={
                activeMode === 'light'
                  ? (isDark ? '#4ADE80' : '#204E35')
                  : (isDark ? '#8B9B90' : '#4C5850')
              }
              weight="bold"
            />
            <Text
              style={[
                styles.themeCardText,
                isDark && styles.themeCardTextDark,
                activeMode === 'light' && (isDark ? styles.themeCardTextActiveDark : styles.themeCardTextActive),
              ]}
            >
              Light
            </Text>
          </Pressable>

          {/* Dark */}
          <Pressable
            onPress={() => handleSelectTheme('dark')}
            style={[
              styles.themeCard,
              isDark && styles.themeCardDark,
              activeMode === 'dark' && (isDark ? styles.themeCardActiveDark : styles.themeCardActive),
            ]}
          >
            <Moon
              size={22}
              color={
                activeMode === 'dark'
                  ? (isDark ? '#4ADE80' : '#204E35')
                  : (isDark ? '#8B9B90' : '#4C5850')
              }
              weight="bold"
            />
            <Text
              style={[
                styles.themeCardText,
                isDark && styles.themeCardTextDark,
                activeMode === 'dark' && (isDark ? styles.themeCardTextActiveDark : styles.themeCardTextActive),
              ]}
            >
              Dark
            </Text>
          </Pressable>
        </View>

        {/* Preferences Group Card */}
        <View style={[styles.preferencesCard, isDark && styles.preferencesCardDark]}>
          {/* Demo hints toggle */}
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceIconCol}>
              <Lightbulb size={20} color={isDark ? '#A1B5A8' : '#3E4B43'} />
            </View>

            <View style={styles.preferenceTextCol}>
              <Text style={[styles.preferenceTitle, isDark && styles.preferenceTitleDark]}>
                Demo hints
              </Text>
              <Text style={[styles.preferenceSubtitle, isDark && styles.preferenceSubtitleDark]}>
                Showing prefilled credentials and codes
              </Text>
            </View>

            <Switch
              value={Boolean(profile.showDemoHints)}
              onValueChange={handleToggleHints}
              trackColor={{ false: isDark ? '#3D4F44' : '#D4D3CC', true: '#204E35' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.preferenceDivider, isDark && styles.preferenceDividerDark]} />

          {/* Reset demo data action */}
          <Pressable
            onPress={handleResetData}
            style={({ pressed }) => [
              styles.preferenceRow,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <View style={styles.preferenceIconCol}>
              <ArrowCounterClockwise size={20} color={isDark ? '#FBBF24' : '#7E6A47'} />
            </View>

            <View style={styles.preferenceTextCol}>
              <Text style={[styles.preferenceTitle, { color: isDark ? '#FBBF24' : '#6A583A' }]}>
                Reset demo data
              </Text>
              <Text style={[styles.preferenceSubtitle, isDark && styles.preferenceSubtitleDark]}>
                Restore everything and replay the intro
              </Text>
            </View>

            <CaretRight size={18} color={isDark ? '#6B7E73' : '#8F9A92'} />
          </Pressable>
        </View>

        {/* Close Action Button */}
        <Pressable
          onPress={handleClose}
          style={({ pressed }) => [
            styles.closeButton,
            isDark && styles.closeButtonDark,
            { opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={[styles.closeButtonText, isDark && styles.closeButtonTextDark]}>
            Close
          </Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  scrimBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 20,
  },
  sheetContainerDark: {
    backgroundColor: '#161F1A',
    shadowOpacity: 0.35,
  },
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DCDAD3',
    alignSelf: 'center',
    marginBottom: 16,
  },
  dragHandleDark: {
    backgroundColor: '#35463C',
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E2EDE6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBadgeDark: {
    backgroundColor: '#1E3527',
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0E1A13',
    letterSpacing: -0.3,
    marginBottom: 18,
  },
  sheetTitleDark: {
    color: '#F2F7F4',
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#556159',
    letterSpacing: 1.2,
  },
  sectionTitleDark: {
    color: '#8A9B90',
  },
  themeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  themeCard: {
    flex: 1,
    height: 74,
    borderRadius: 16,
    backgroundColor: '#EBEAE4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 6,
  },
  themeCardDark: {
    backgroundColor: '#202C25',
  },
  themeCardActive: {
    backgroundColor: '#E2EDE6',
    borderColor: '#204E35',
  },
  themeCardActiveDark: {
    backgroundColor: '#1D3B2B',
    borderColor: '#4ADE80',
  },
  themeCardText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4C5850',
  },
  themeCardTextDark: {
    color: '#8A9B90',
  },
  themeCardTextActive: {
    color: '#204E35',
    fontWeight: '700',
  },
  themeCardTextActiveDark: {
    color: '#4ADE80',
    fontWeight: '700',
  },
  preferencesCard: {
    backgroundColor: '#EBEAE4',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  preferencesCardDark: {
    backgroundColor: '#202C25',
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  preferenceIconCol: {
    width: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  preferenceTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  preferenceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A241E',
    marginBottom: 2,
  },
  preferenceTitleDark: {
    color: '#F2F7F4',
  },
  preferenceSubtitle: {
    fontSize: 12.5,
    color: '#5C6961',
    lineHeight: 16,
  },
  preferenceSubtitleDark: {
    color: '#8A9B90',
  },
  preferenceDivider: {
    height: 1,
    backgroundColor: '#DEDCD4',
    marginVertical: 10,
  },
  preferenceDividerDark: {
    backgroundColor: '#2E3D34',
  },
  closeButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8D7D1',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  closeButtonDark: {
    backgroundColor: '#202C25',
    borderColor: '#35463C',
  },
  closeButtonText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#0E1A13',
  },
  closeButtonTextDark: {
    color: '#F2F7F4',
  },
});
