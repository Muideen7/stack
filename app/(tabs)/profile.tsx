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

export default function ProfileScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

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
        isDark ? styles.canvasDark : styles.canvasLight,
      ]}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Header: Stack 3-slab brand logo */}
        <View style={styles.topLogoRow}>
          <StackMark size={28} color={isDark ? '#4ADE80' : '#204E35'} />
        </View>

        {/* User Identity Section */}
        <View style={styles.userHeaderSection}>
          {/* Avatar Circle with Camera Badge */}
          <View style={styles.avatarWrapper}>
            <View
              style={[
                styles.avatarCircle,
                isDark ? styles.avatarCircleDark : styles.avatarCircleLight,
              ]}
            >
              <Text
                style={[
                  styles.avatarInitial,
                  isDark ? styles.avatarInitialDark : styles.avatarInitialLight,
                ]}
              >
                {profile.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View
              style={[
                styles.cameraBadge,
                isDark ? styles.cameraBadgeDark : styles.cameraBadgeLight,
              ]}
            >
              <Camera
                size={12}
                color={isDark ? '#8A9C91' : '#5C6A61'}
                weight="bold"
              />
            </View>
          </View>

          {/* User Name & Email */}
          <View style={styles.userNameMeta}>
            <Text style={[styles.userName, isDark && styles.userNameDark]}>
              {profile.name}
            </Text>
            <Text style={[styles.userEmail, isDark && styles.userEmailDark]}>
              {profile.email}
            </Text>
          </View>
        </View>

        {/* Section: ACCOUNT */}
        <View style={styles.sectionWrapper}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            ACCOUNT
          </Text>

          <View
            style={[
              styles.groupCard,
              isDark ? styles.groupCardDark : styles.groupCardLight,
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
                    isDark ? styles.iconBoxDark : styles.iconBoxLight,
                  ]}
                >
                  <User
                    size={20}
                    color={isDark ? '#F2F7F4' : '#0E1A13'}
                    weight="regular"
                  />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={[styles.rowTitle, isDark && styles.rowTitleDark]}>
                    Edit profile
                  </Text>
                  <Text style={[styles.rowSubtitle, isDark && styles.rowSubtitleDark]}>
                    Name, email and handle
                  </Text>
                </View>
              </View>

              <CaretRight
                size={16}
                color={isDark ? '#8A9C91' : '#5C6A61'}
                weight="bold"
              />
            </Pressable>

            <View style={[styles.divider, isDark && styles.dividerDark]} />

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
                    isDark ? styles.iconBoxDark : styles.iconBoxLight,
                  ]}
                >
                  <Bell
                    size={20}
                    color={isDark ? '#F2F7F4' : '#0E1A13'}
                    weight="regular"
                  />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={[styles.rowTitle, isDark && styles.rowTitleDark]}>
                    Notifications
                  </Text>
                  <Text style={[styles.rowSubtitle, isDark && styles.rowSubtitleDark]}>
                    {unreadTotal} waiting for you
                  </Text>
                </View>
              </View>

              <View style={styles.rowRightBadgeGroup}>
                {unreadTotal > 0 && (
                  <View
                    style={[
                      styles.unreadCountBadge,
                      isDark && styles.unreadCountBadgeDark,
                    ]}
                  >
                    <Text style={styles.unreadCountText}>{unreadTotal}</Text>
                  </View>
                )}
                <CaretRight
                  size={16}
                  color={isDark ? '#8A9C91' : '#5C6A61'}
                  weight="bold"
                />
              </View>
            </Pressable>
          </View>
        </View>

        {/* Section: APP */}
        <View style={styles.sectionWrapper}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            APP
          </Text>

          <View
            style={[
              styles.groupCard,
              isDark ? styles.groupCardDark : styles.groupCardLight,
            ]}
          >
            {/* Appearance */}
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
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
                    isDark ? styles.iconBoxDark : styles.iconBoxLight,
                  ]}
                >
                  <Palette
                    size={20}
                    color={isDark ? '#F2F7F4' : '#0E1A13'}
                    weight="regular"
                  />
                </View>
                <View style={styles.rowTexts}>
                  <Text style={[styles.rowTitle, isDark && styles.rowTitleDark]}>
                    Appearance
                  </Text>
                  <Text style={[styles.rowSubtitle, isDark && styles.rowSubtitleDark]}>
                    {currentThemeLabel}
                  </Text>
                </View>
              </View>

              <CaretRight
                size={16}
                color={isDark ? '#8A9C91' : '#5C6A61'}
                weight="bold"
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
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
              isDark ? styles.modalSheetDark : styles.modalSheetLight,
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
                Edit profile
              </Text>
              <Pressable onPress={() => setEditModalVisible(false)}>
                <X size={20} color={isDark ? '#8A9C91' : '#5C6A61'} />
              </Pressable>
            </View>

            <View style={styles.inputsStack}>
              <View>
                <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                  Name
                </Text>
                <TextInput
                  value={nameInput}
                  onChangeText={setNameInput}
                  style={[
                    styles.textInput,
                    isDark ? styles.textInputDark : styles.textInputLight,
                  ]}
                />
              </View>

              <View>
                <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                  Email
                </Text>
                <TextInput
                  value={emailInput}
                  onChangeText={setEmailInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[
                    styles.textInput,
                    isDark ? styles.textInputDark : styles.textInputLight,
                  ]}
                />
              </View>

              <View>
                <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                  Handle
                </Text>
                <TextInput
                  value={handleInput}
                  onChangeText={setHandleInput}
                  autoCapitalize="none"
                  style={[
                    styles.textInput,
                    isDark ? styles.textInputDark : styles.textInputLight,
                  ]}
                />
              </View>
            </View>

            <Pressable
              onPress={handleSaveProfile}
              style={[styles.saveBtn, styles.saveBtnLight]}
            >
              <Text style={styles.saveBtnText}>Save</Text>
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
  canvasLight: {
    backgroundColor: '#F4F3EF',
  },
  canvasDark: {
    backgroundColor: '#0E1612',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 110,
  },
  topLogoRow: {
    paddingTop: 16,
    paddingBottom: 24,
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
  avatarCircleLight: {
    backgroundColor: '#D6E6DC',
  },
  avatarCircleDark: {
    backgroundColor: '#1E3527',
  },
  avatarInitial: {
    fontSize: 26,
    fontWeight: '800',
  },
  avatarInitialLight: {
    color: '#204E35',
  },
  avatarInitialDark: {
    color: '#4ADE80',
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
  cameraBadgeLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECEAE4',
  },
  cameraBadgeDark: {
    backgroundColor: '#26342B',
    borderColor: '#16201B',
  },
  userNameMeta: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0E1A13',
    letterSpacing: -0.3,
  },
  userNameDark: {
    color: '#F2F7F4',
  },
  userEmail: {
    fontSize: 13.5,
    color: '#5C6A61',
    marginTop: 2,
  },
  userEmailDark: {
    color: '#8A9C91',
  },
  sectionWrapper: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#556159',
    letterSpacing: 1.2,
    marginBottom: 8,
    paddingLeft: 4,
  },
  sectionTitleDark: {
    color: '#8A9B90',
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
  groupCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECEAE4',
  },
  groupCardDark: {
    backgroundColor: '#16201B',
    borderColor: '#26342B',
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
  },
  iconBoxLight: {
    backgroundColor: '#EBE9E2',
  },
  iconBoxDark: {
    backgroundColor: '#202B24',
  },
  rowTexts: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0E1A13',
  },
  rowTitleDark: {
    color: '#F2F7F4',
  },
  rowSubtitle: {
    fontSize: 12.5,
    color: '#5C6A61',
    marginTop: 2,
  },
  rowSubtitleDark: {
    color: '#8A9C91',
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
    backgroundColor: '#204E35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCountBadgeDark: {
    backgroundColor: '#225B3C',
  },
  unreadCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#ECEAE4',
  },
  dividerDark: {
    backgroundColor: '#26342B',
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  scrimBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalSheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },
  modalSheetLight: {
    backgroundColor: '#FFFFFF',
  },
  modalSheetDark: {
    backgroundColor: '#16201B',
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
    color: '#0E1A13',
  },
  modalTitleDark: {
    color: '#F2F7F4',
  },
  inputsStack: {
    gap: 14,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5C6A61',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  inputLabelDark: {
    color: '#8A9C91',
  },
  textInput: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    borderWidth: 1,
  },
  textInputLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E0D8',
    color: '#0E1A13',
  },
  textInputDark: {
    backgroundColor: '#202B24',
    borderColor: '#2D3C33',
    color: '#F2F7F4',
  },
  saveBtn: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnLight: {
    backgroundColor: '#204E35',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
