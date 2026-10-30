// Web'de bildirim ve arka plan görevi yok; ayarlar kartı gizlenir.
export type NotificationPrefs = { serverStatus: boolean; news: boolean };

export async function getPrefs(): Promise<NotificationPrefs> {
  return { serverStatus: false, news: false };
}

export async function savePrefs(_prefs: NotificationPrefs): Promise<boolean> {
  return false;
}

export function useOpenNewsFromNotification(_ready: boolean) {}
