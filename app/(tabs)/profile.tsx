// app/(tabs)/profile.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  User,
  Bell,
  Palette,
  CaretRight,
  Camera,
  X,
} from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import * as Haptics from '@/utils/haptics';

import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { StackMark } from '../../components/common/StackMark';
import { getTheme } from '../../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

  const { profile, updateProfile } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name || 'FrontendGeek');
  const [emailInput, setEmailInput] = useState(profile.email || 'frontendgeek@stack.app');
  const [handleInput, setHandleInput] = useState(profile.handle || '@frontendgeek');

  const unreadTotal = unreadCount();

  const handleOpenEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNameInput(profile.name);
    setEmailInput(profile.email);
    setHandleInput(profile.handle);
    setEditModalVisible(true);
  };

  const handleSaveProfile = () => {
    if (!nameInput.trim()) {
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    updateProfile({
      name: nameInput.trim(),
      email: emailInput.trim(),
      handle: handleInput.trim().startsWith('@') ? handleInput.trim() : `@${handleInput.trim()}`,
    });
    setEditModalVisible(false);
  };

  const currentThemeLabel =
    profile.themeMode === 'system'
      ? 'Auto'
      : profile.themeMode === 'dark'
      ? 'Dark'
      : 'Light';

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.ground },
      ]}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Header: Stack 3-slab brand logo */}
        <View style={styles.topLogoRow}>
          <StackMark size={28} color={theme.accent} />
        </View>

        {/* User Identity Section */}
        <View style={styles.userHeaderSection}>
          {/* Avatar Circle with Camera Badge */}
          <View style={styles.avatarWrapper}>
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: theme.accentSoft },
              ]}
            >
              <Text
                style={[
                  styles.avatarInitial,
                  { color: theme.accent },
                ]}
              >
                {profile.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View
              style={[
                styles.cameraBadge,
                {
                  backgroundColor: theme.raised,
                  borderColor: theme.rule,
                },
              ]}
            >
              <Camera
                size={12}
                color={theme.ink2}
                weight="bold"
              />
            </View>
          </View>

          {/* User Name & Email */}
          <View style={styles.userNameMeta}>
            <Text style={[styles.userName, { color: theme.ink }]}>
              {profile.name}
            </Text>
            <Text style={[styles.userEmail, { color: theme.ink2 }]}>
              {profile.email}
            </Text>
          </View>
        </View>

        {/* Section: ACCOUNT */}
        <View style={styles.sectionWrapper}>
          <Text style={[styles.sectionTitle, { color: theme.ink2 }]}>
            ACCOUNT
          </Text>

          <View
            style={[
              styles.groupCard,
              {
                backgroundColor: theme.raised,
                borderColor: theme.rule,
              },
            ]}
          >
            {/* Edit Profile */}
            <Pressable
              onPress={handleOpenEdit}
              style={({ pressed }) => [
                styles.rowItem,
                { opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <View style={styles.rowLeft}>
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: theme.raisedSubtle,
                      borderColor: theme.rule,
                    },
                  ]}
                >
                  <User
                    size={20}
                    color={theme.ink}
                    weight="bold"
                  />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={[styles.rowTitle, { color: theme.ink }]}>
                    Edit profile
                  </Text>
                  <Text style={[styles.rowSubtitle, { color: theme.ink2 }]}>
                    Name, email and handle
                  </Text>
                </View>
              </View>
              <CaretRight
                size={18}
                color={theme.ink2}
                weight="bold"
              />
            </Pressable>

            <View style={[styles.divider, { backgroundColor: theme.rule }]} />

            {/* Notifications */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/notifications');
              }}
              style={({ pressed }) => [
                styles.rowItem,
                { opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <View style={styles.rowLeft}>
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: theme.raisedSubtle,
                      borderColor: theme.rule,
                    },
                  ]}
                >
                  <Bell
                    size={20}
                    color={theme.ink}
                    weight="bold"
                  />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={[styles.rowTitle, { color: theme.ink }]}>
                    Notifications
                  </Text>
                  <Text style={[styles.rowSubtitle, { color: theme.ink2 }]}>
                    {unreadTotal} waiting for you
                  </Text>
                </View>
              </View>

              <View style={styles.rowRightBadgeGroup}>
                {unreadTotal > 0 && (
                  <View style={[styles.unreadCountBadge, { backgroundColor: theme.accent }]}>
                    <Text style={styles.unreadCountText}>
                      {unreadTotal}
                    </Text>
                  </View>
                )}
                <CaretRight
                  size={18}
                  color={theme.ink2}
                  weight="bold"
                />
              </View>
            </Pressable>
          </View>
        </View>

        {/* Section: APP */}
        <View style={styles.sectionWrapper}>
          <Text style={[styles.sectionTitle, { color: theme.ink2 }]}>
            APP
          </Text>

          <View
            style={[
              styles.groupCard,
              {
                backgroundColor: theme.raised,
                borderColor: theme.rule,
              },
            ]}
          >
            {/* Appearance / Theme Settings */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(auth)/demo-settings');
              }}
              style={({ pressed }) => [
                styles.rowItem,
                { opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <View style={styles.rowLeft}>
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: theme.raisedSubtle,
                      borderColor: theme.rule,
                    },
                  ]}
                >
                  <Palette
                    size={20}
                    color={theme.ink}
                    weight="bold"
                  />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={[styles.rowTitle, { color: theme.ink }]}>
                    Appearance
                  </Text>
                  <Text style={[styles.rowSubtitle, { color: theme.ink2 }]}>
                    {currentThemeLabel}
                  </Text>
                </View>
              </View>
              <CaretRight
                size={18}
                color={theme.ink2}
                weight="bold"
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal Sheet */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalRoot}>
          <Pressable
            style={styles.scrimBackdrop}
            onPress={() => setEditModalVisible(false)}
          />
          <SafeAreaView
            edges={['bottom']}
            style={[
              styles.modalSheet,
              {
                backgroundColor: theme.raised,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.ink }]}>
                Edit Profile
              </Text>
              <Pressable onPress={() => setEditModalVisible(false)}>
                <X size={20} color={theme.ink2} />
              </Pressable>
            </View>

            <View style={styles.inputsStack}>
              <View>
                <Text style={[styles.inputLabel, { color: theme.ink2 }]}>
                  Full Name
                </Text>
                <TextInput
                  value={nameInput}
                  onChangeText={setNameInput}
                  placeholder="Your Name"
                  placeholderTextColor={theme.ink3}
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.raised,
                      borderColor: theme.rule,
                      color: theme.ink,
                    },
                  ]}
                />
              </View>

              <View>
                <Text style={[styles.inputLabel, { color: theme.ink2 }]}>
                  Handle
                </Text>
                <TextInput
                  value={handleInput}
                  onChangeText={setHandleInput}
                  placeholder="@handle"
                  placeholderTextColor={theme.ink3}
                  autoCapitalize="none"
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.raised,
                      borderColor: theme.rule,
                      color: theme.ink,
                    },
                  ]}
                />
              </View>

              <View>
                <Text style={[styles.inputLabel, { color: theme.ink2 }]}>
                  Email
                </Text>
                <TextInput
                  value={emailInput}
                  onChangeText={setEmailInput}
                  placeholder="your.email@example.com"
                  placeholderTextColor={theme.ink3}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.raised,
                      borderColor: theme.rule,
                      color: theme.ink,
                    },
                  ]}
                />
              </View>
            </View>

            <Pressable
              onPress={handleSaveProfile}
              style={({ pressed }) => [
                styles.saveBtn,
                {
                  backgroundColor: theme.accent,
                  opacity: pressed ? 0.88 : 1,
                },
              ]}
            >
              <Text style={[styles.saveBtnText, { color: theme.onAccent }]}>Save Changes</Text>
            </Pressable>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 110,
  },
  topLogoRow: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  userHeaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 18,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 26,
    fontWeight: '800',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  userNameMeta: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  userEmail: {
    fontSize: 13.5,
    marginTop: 2,
  },
  sectionWrapper: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 8,
    paddingLeft: 4,
  },
  groupCard: {
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
  },
  rowTexts: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  rowSubtitle: {
    fontSize: 12.5,
    marginTop: 2,
  },
  rowRightBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadCountBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  scrimBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalSheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  inputsStack: {
    gap: 14,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  textInput: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    borderWidth: 1,
  },
  saveBtn: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
