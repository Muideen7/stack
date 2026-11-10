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
import { getTheme } from '../constants/theme';

export default function NotificationsScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getTheme(isDark);

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
      <Pressable style={styles.scrimBackdrop} onPress={handleClose} />

      <SafeAreaView
        edges={['bottom']}
        style={[
          styles.sheetContainer,
          {
            backgroundColor: theme.raised,
          },
        ]}
      >
        {/* Drag Handle */}
        <View style={[styles.dragHandle, { backgroundColor: theme.rule }]} />

        {/* Badge Icon */}
        <View style={[styles.iconBadge, { backgroundColor: theme.accentSoft }]}>
          <Bell
            size={22}
            color={theme.accent}
            weight="fill"
          />
        </View>

        {/* Title */}
        <Text style={[styles.sheetTitle, { color: theme.ink }]}>
          Notifications
        </Text>

        {/* Subtitle */}
        <Text style={[styles.sheetSubtitle, { color: theme.ink2 }]}>
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
                  {
                    backgroundColor: isUnread ? theme.raised : theme.raisedSubtle,
                    borderColor: isUnread ? theme.accent : theme.rule,
                    shadowOpacity: isUnread ? 0.06 : 0,
                  },
                ]}
              >
                {/* Header Row */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cardHeaderLeft}>
                    <IconComp
                      size={18}
                      color={isUnread ? theme.accent : theme.ink2}
                      weight="bold"
                    />
                    <Text
                      style={[
                        styles.notificationTitle,
                        { color: theme.ink },
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
                          { backgroundColor: theme.accent },
                        ]}
                      />
                    )}
                    <Text style={[styles.timeText, { color: theme.ink3 }]}>
                      {timeLabel}
                    </Text>
                  </View>
                </View>

                {/* Body Text */}
                <Text
                  style={[
                    styles.notificationBody,
                    { color: theme.ink2 },
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
              {
                backgroundColor: theme.accent,
                opacity: pressed ? 0.88 : 1,
              },
            ]}
          >
            <Text style={[styles.primaryBtnText, { color: theme.onAccent }]}>Mark all as read</Text>
          </Pressable>

          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [
              styles.secondaryBtn,
              {
                backgroundColor: theme.raised,
                borderColor: theme.rule,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text style={[styles.secondaryBtnText, { color: theme.ink }]}>
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
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 13.5,
    marginBottom: 16,
  },
  scrollList: {
    maxHeight: 380,
  },
  scrollContent: {
    gap: 10,
    paddingBottom: 16,
  },
  notificationCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    flex: 1,
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
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  notificationBody: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionsStack: {
    gap: 10,
    marginTop: 8,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 15.5,
    fontWeight: '700',
  },
  secondaryBtn: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 15.5,
    fontWeight: '700',
  },
});
