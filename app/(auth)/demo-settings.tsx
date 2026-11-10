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
import { getTheme } from '../../constants/theme';

export default function DemoSettingsScreen() {
  const router = useRouter();
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

  const { profile, setThemeMode, toggleDemoHints, resetAll, setAuthenticated } = useAuthStore();
  const resetWallet = useWalletStore((s) => s.resetToSeed);
  const resetTx = useTransactionStore((s) => s.resetToSeed);
  const resetRecipients = useRecipientStore((s) => s.resetToSeed);

  const activeMode = profile.themeMode || 'system';

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
          {
            backgroundColor: theme.raised,
          },
        ]}
      >
        {/* Sheet Handle */}
        <View style={[styles.dragHandle, { backgroundColor: theme.rule }]} />

        {/* Icon Badge */}
        <View style={[styles.iconBadge, { backgroundColor: theme.accentSoft }]}>
          <Faders
            size={22}
            color={theme.accent}
            weight="bold"
          />
        </View>

        {/* Title */}
        <Text style={[styles.sheetTitle, { color: theme.ink }]}>
          Demo settings
        </Text>

        {/* Appearance Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.ink2 }]}>
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
              {
                backgroundColor: activeMode === 'system' ? theme.accentSoft : theme.raisedSubtle,
                borderColor: activeMode === 'system' ? theme.accent : theme.rule,
              },
            ]}
          >
            <CircleHalf
              size={22}
              color={activeMode === 'system' ? theme.accent : theme.ink2}
              weight="fill"
            />
            <Text
              style={[
                styles.themeCardText,
                {
                  color: activeMode === 'system' ? theme.accent : theme.ink2,
                  fontWeight: activeMode === 'system' ? '700' : '600',
                },
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
              {
                backgroundColor: activeMode === 'light' ? theme.accentSoft : theme.raisedSubtle,
                borderColor: activeMode === 'light' ? theme.accent : theme.rule,
              },
            ]}
          >
            <Sun
              size={22}
              color={activeMode === 'light' ? theme.accent : theme.ink2}
              weight="bold"
            />
            <Text
              style={[
                styles.themeCardText,
                {
                  color: activeMode === 'light' ? theme.accent : theme.ink2,
                  fontWeight: activeMode === 'light' ? '700' : '600',
                },
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
              {
                backgroundColor: activeMode === 'dark' ? theme.accentSoft : theme.raisedSubtle,
                borderColor: activeMode === 'dark' ? theme.accent : theme.rule,
              },
            ]}
          >
            <Moon
              size={22}
              color={activeMode === 'dark' ? theme.accent : theme.ink2}
              weight="bold"
            />
            <Text
              style={[
                styles.themeCardText,
                {
                  color: activeMode === 'dark' ? theme.accent : theme.ink2,
                  fontWeight: activeMode === 'dark' ? '700' : '600',
                },
              ]}
            >
              Dark
            </Text>
          </Pressable>
        </View>

        {/* Demo Preferences Container Card */}
        <View
          style={[
            styles.preferencesCard,
            {
              backgroundColor: theme.raisedSubtle,
              borderColor: theme.rule,
            },
          ]}
        >
          {/* Row 1: Demo Hints Toggle */}
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceIconCol}>
              <Lightbulb size={20} color={theme.ink2} weight="bold" />
            </View>

            <View style={styles.preferenceTextCol}>
              <Text style={[styles.preferenceTitle, { color: theme.ink }]}>
                Demo hints
              </Text>
              <Text style={[styles.preferenceSubtitle, { color: theme.ink2 }]}>
                Showing prefilled credentials and codes
              </Text>
            </View>

            <Switch
              value={profile.showDemoHints}
              onValueChange={handleToggleHints}
              trackColor={{ false: theme.rule, true: theme.accent }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.preferenceDivider, { backgroundColor: theme.rule }]} />

          {/* Row 2: Reset Demo Data */}
          <Pressable onPress={handleResetData} style={styles.preferenceRow}>
            <View style={styles.preferenceIconCol}>
              <ArrowCounterClockwise size={20} color="#D97706" weight="bold" />
            </View>

            <View style={styles.preferenceTextCol}>
              <Text style={[styles.preferenceTitle, { color: '#D97706' }]}>
                Reset demo data
              </Text>
              <Text style={[styles.preferenceSubtitle, { color: theme.ink2 }]}>
                Restore everything and replay the intro
              </Text>
            </View>

            <CaretRight size={18} color={theme.ink2} />
          </Pressable>
        </View>

        {/* Close Action Button */}
        <Pressable
          onPress={handleClose}
          style={({ pressed }) => [
            styles.closeButton,
            {
              backgroundColor: theme.raised,
              borderColor: theme.rule,
              opacity: pressed ? 0.88 : 1,
            },
          ]}
        >
          <Text style={[styles.closeButtonText, { color: theme.ink }]}>
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
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 18,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  themeCard: {
    flex: 1,
    height: 74,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    gap: 6,
  },
  themeCardText: {
    fontSize: 13,
  },
  preferencesCard: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    marginBottom: 20,
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
    marginBottom: 2,
  },
  preferenceSubtitle: {
    fontSize: 12.5,
    lineHeight: 16,
  },
  preferenceDivider: {
    height: 1,
    marginVertical: 10,
  },
  closeButton: {
    borderWidth: 1,
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
  closeButtonText: {
    fontSize: 15.5,
    fontWeight: '700',
  },
});
