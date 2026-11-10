// store/notificationStore.ts
import { create } from 'zustand';
import { appStorage } from './storage';
import rawSeed from '../data/seed/notifications.json';

export interface AppNotification {
  id: string;
  kind: 'payment' | 'security' | 'system';
  title: string;
  body: string;
  sentAt: string;
  read: boolean;
}

const STORAGE_KEY = '@stack_notifications_v1';

function loadNotifications(): AppNotification[] {
  const stored = appStorage.getString(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  const items = (rawSeed as { notifications: any[] }).notifications;
  appStorage.set(STORAGE_KEY, JSON.stringify(items));
  return items;
}

interface NotificationState {
  notifications: AppNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: loadNotifications(),

  markAsRead: (id) => {
    const next = get().notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    appStorage.set(STORAGE_KEY, JSON.stringify(next));
    set({ notifications: next });
  },

  markAllAsRead: () => {
    const next = get().notifications.map((n) => ({ ...n, read: true }));
    appStorage.set(STORAGE_KEY, JSON.stringify(next));
    set({ notifications: next });
  },

  unreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },
}));

