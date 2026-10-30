import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import * as TaskManager from 'expo-task-manager';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { fetchNews } from './api/news';
import { fetchServerStatus } from './api/status';
import { SERVER } from './config';

// Sunucu ekibi push bildirimi gönderebilene kadar uygulama, arka planda
// belirli aralıklarla sunucuyu ve duyuruları kontrol edip yerel bildirim
// gösterir. Sistem bu kontrolü en erken 15 dakikada bir çalıştırır.
const TASK_NAME = 'concity-background-check';
const PREFS_KEY = 'notifications/prefs';
const STATE_KEY = 'notifications/state';

export type NotificationPrefs = { serverStatus: boolean; news: boolean };
type CheckState = { lastOnline?: boolean; seenNewsIds?: string[] };

const DEFAULT_PREFS: NotificationPrefs = { serverStatus: false, news: false };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
}

export function getPrefs() {
  return readJson(PREFS_KEY, DEFAULT_PREFS);
}

async function notify(title: string, body: string, data?: Record<string, string>) {
  await Notifications.scheduleNotificationAsync({ content: { title, body, data }, trigger: null });
}

// Son kontrolden bu yana değişenleri bildirir. İlk çalıştırmada yalnızca
// mevcut durumu kaydeder, böylece eski duyurular için bildirim gelmez.
export async function checkForUpdates() {
  const prefs = await getPrefs();
  const state = await readJson<CheckState>(STATE_KEY, {});

  if (prefs.serverStatus) {
    const status = await fetchServerStatus();
    if (state.lastOnline !== undefined && state.lastOnline !== status.online) {
      await notify(
        status.online ? `${SERVER.name} tekrar açık 🟢` : `${SERVER.name} kapandı 🔴`,
        status.online
          ? `${status.playersOnline} oyuncu çevrimiçi. Hemen katıl: ${SERVER.address}`
          : 'Sunucuya şu anda bağlanılamıyor.'
      );
    }
    state.lastOnline = status.online;
  }

  if (prefs.news) {
    const items = await fetchNews();
    if (state.seenNewsIds) {
      for (const item of items.filter((i) => !state.seenNewsIds?.includes(i.id))) {
        await notify(item.title, item.summary, { newsId: item.id });
      }
    }
    state.seenNewsIds = items.map((i) => i.id);
  }

  await AsyncStorage.setItem(STATE_KEY, JSON.stringify(state));
}

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    await checkForUpdates();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

// Tercihleri kaydeder; en az bir bildirim açıksa izin ister ve arka plan
// görevini kaydeder. İzin verilmezse false döner ve hiçbir şey değişmez.
export async function savePrefs(prefs: NotificationPrefs): Promise<boolean> {
  const anyEnabled = prefs.serverStatus || prefs.news;

  if (anyEnabled) {
    const { granted } = await Notifications.requestPermissionsAsync();
    if (!granted) return false;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Sunucu ve duyurular',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  }

  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  // Yeni açılan bildirim türü için başlangıç durumunu sıfırla.
  const state = await readJson<CheckState>(STATE_KEY, {});
  if (!prefs.serverStatus) delete state.lastOnline;
  if (!prefs.news) delete state.seenNewsIds;
  await AsyncStorage.setItem(STATE_KEY, JSON.stringify(state));

  const registered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
  if (anyEnabled && !registered) {
    await BackgroundTask.registerTaskAsync(TASK_NAME, { minimumInterval: 15 });
  } else if (!anyEnabled && registered) {
    await BackgroundTask.unregisterTaskAsync(TASK_NAME);
  }

  if (anyEnabled) {
    // İlk durumu hemen kaydet; hata olursa bir sonraki kontrolde tekrar denenir.
    await checkForUpdates().catch(() => {});
  }
  return true;
}

// Duyuru bildirimine dokunulunca ilgili duyuruyu açar.
export function useOpenNewsFromNotification(ready: boolean) {
  const lastResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    const newsId = lastResponse?.notification.request.content.data?.newsId;
    if (ready && typeof newsId === 'string') {
      router.push({ pathname: '/news/[id]', params: { id: newsId } });
    }
  }, [ready, lastResponse]);
}
