// app/notifications.tsx
import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Bell,
  ArrowDown,
  Shield,
  FileText,
} from 'phosphor-react-native';
import { useColorScheme } from 'nativewind';
import * as Haptics from '@/utils/haptics';

import { useNotificationStore } from '../store/notificationStore';

export default function NotificationsScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();

  const handleMarkAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    markAllAsRead();
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const getRelativeTime = (sentAt: string) => {
    const diffMs = new Date().getTime() - new Date(sentAt).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 24) {
      return `${Math.max(1, diffHours)}h`;
    }
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  };

  const getIcon = (kind: string, title: string) => {
    if (kind === 'security' || title.toLowerCase().includes('sign-in')) {
      return Shield;
    }
    if (kind === 'system' || title.toLowerCase().includes('statement')) {
      return FileText;
    }
    return ArrowDown;
  };

  const unreadTotal = unreadCount();

  return (
    <View style={styles.modalRoot}>
      {/* Scrim backdrop */}
      <Pressable style={styles.scrimBackdrop} onPress={handleClose} />

      {/* Bottom Sheet Container */}
      <SafeAreaView
        edges={['bottom']}
        style={[
          styles.sheetContainer,
          isDark ? styles.sheetDark : styles.sheetLight,
        ]}
      >
        {/* Handle */}
        <View style={[styles.dragHandle, isDark && styles.dragHandleDark]} />

        {/* Badge Icon */}
        <View style={[styles.iconBadge, isDark && styles.iconBadgeDark]}>
          <Bell
            size={22}
            color={isDark ? '#4ADE80' : '#204E35'}
            weight="fill"
          />
        </View>

        {/* Title */}
        <Text style={[styles.sheetTitle, isDark && styles.sheetTitleDark]}>
          Notifications
        </Text>

        {/* Subtitle */}
        <Text style={[styles.sheetSubtitle, isDark && styles.sheetSubtitleDark]}>
          {unreadTotal} unread. Tap to read in full, swipe to delete.
        </Text>

        {/* Notifications Scroll List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollList}
          contentContainerStyle={styles.scrollContent}
        >
          {notifications.map((n) => {
            const IconComp = getIcon(n.kind, n.title);
            const isUnread = !n.read;
            const timeLabel = getRelativeTime(n.sentAt);

            return (
              <Pressable
                key={n.id}
                onPress={() => {
                  Haptics.selectionAsync();
                  markAsRead(n.id);
                }}
                style={[
                  styles.notificationCard,
                  isUnread
                    ? (isDark ? styles.cardUnreadDark : styles.cardUnreadLight)
                    : (isDark ? styles.cardReadDark : styles.cardReadLight),
                ]}
              >
                {/* Header Row */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cardHeaderLeft}>
                    <IconComp
                      size={18}
                      color={isDark ? '#4ADE80' : '#204E35'}
                      weight="bold"
                    />
                    <Text
                      style={[
                        styles.notificationTitle,
                        isDark && styles.notificationTitleDark,
                      ]}
                      numberOfLines={1}
                    >
                      {n.title}
                    </Text>
                  </View>

                  <View style={styles.cardHeaderRight}>
                    {isUnread && (
                      <View
                        style={[
                          styles.unreadDot,
                          isDark && styles.unreadDotDark,
                        ]}
                      />
                    )}
                    <Text
                      style={[
                        styles.timeText,
                        isDark && styles.timeTextDark,
                      ]}
                    >
                      {timeLabel}
                    </Text>
                  </View>
                </View>

                {/* Body Text */}
                <Text
                  style={[
                    styles.notificationBody,
                    isDark && styles.notificationBodyDark,
                  ]}
                  numberOfLines={2}
                >
                  {n.body}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionsStack}>
          <Pressable
            onPress={handleMarkAll}
            style={({ pressed }) => [
              styles.primaryBtn,
              isDark ? styles.primaryBtnDark : styles.primaryBtnLight,
              { opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Text style={styles.primaryBtnText}>Mark all as read</Text>
          </Pressable>

          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [
              styles.secondaryBtn,
              isDark ? styles.secondaryBtnDark : styles.secondaryBtnLight,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={[styles.secondaryBtnText, isDark && styles.secondaryBtnTextDark]}>
              Close
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  scrimBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    maxHeight: '88%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 16,
  },
  sheetLight: {
    backgroundColor: '#FFFFFF',
  },
  sheetDark: {
    backgroundColor: '#16201B',
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
    marginBottom: 4,
  },
  sheetTitleDark: {
    color: '#F2F7F4',
  },
  sheetSubtitle: {
    fontSize: 13.5,
    color: '#5C6A61',
    lineHeight: 18,
    marginBottom: 16,
  },
  sheetSubtitleDark: {
    color: '#8A9C91',
  },
  scrollList: {
    maxHeight: 380,
  },
  scrollContent: {
    gap: 10,
    paddingBottom: 8,
  },
  notificationCard: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
  },
  cardUnreadLight: {
    backgroundColor: '#E2EDE6',
    borderColor: '#D4E2D9',
  },
  cardUnreadDark: {
    backgroundColor: '#1A3326',
    borderColor: '#244533',
  },
  cardReadLight: {
    backgroundColor: '#EBE9E2',
    borderColor: '#DFDCD4',
  },
  cardReadDark: {
    backgroundColor: '#202A24',
    borderColor: '#2D3931',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0E1A13',
  },
  notificationTitleDark: {
    color: '#F2F7F4',
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#204E35',
  },
  unreadDotDark: {
    backgroundColor: '#4ADE80',
  },
  timeText: {
    fontSize: 12.5,
    color: '#5C6A61',
    fontWeight: '600',
  },
  timeTextDark: {
    color: '#8A9C91',
  },
  notificationBody: {
    fontSize: 13,
    color: '#4B574F',
    lineHeight: 18,
    marginLeft: 26,
  },
  notificationBodyDark: {
    color: '#95A69B',
  },
  actionsStack: {
    gap: 10,
    marginTop: 16,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnLight: {
    backgroundColor: '#204E35',
  },
  primaryBtnDark: {
    backgroundColor: '#225B3C',
  },
  primaryBtnText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryBtnLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8D7D1',
  },
  secondaryBtnDark: {
    backgroundColor: '#202B24',
    borderColor: '#35463C',
  },
  secondaryBtnText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#0E1A13',
  },
  secondaryBtnTextDark: {
    color: '#F2F7F4',
  },
});
