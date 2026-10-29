import { CONCITY_API_URL } from '../config';

export type MojangProfile = { id: string; name: string };

// Sunucuya özel istatistikler. Alanlar sunucu ekibinin API'sine göre
// netleşecek; şimdilik Skyblock için olası alanlar.
export type ConCityStats = {
  islandLevel?: number;
  balance?: number;
  kills?: number;
  playTimeHours?: number;
  rank?: string;
};

// Kullanıcı adını Mojang profiline çevirir. Hesap bulunamazsa null döner.
export async function fetchMojangProfile(username: string): Promise<MojangProfile | null> {
  const res = await fetch(
    `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`
  );
  if (res.status === 404 || res.status === 204) return null;
  if (!res.ok) throw new Error(`Oyuncu aranamadı (HTTP ${res.status})`);
  return res.json();
}

export function avatarUrl(uuidOrName: string, size = 128) {
  return `https://mc-heads.net/avatar/${uuidOrName}/${size}`;
}

export function bodyUrl(uuidOrName: string, size = 256) {
  return `https://mc-heads.net/body/${uuidOrName}/${size}`;
}

// ConCity API'si henüz yoksa null döner; ekran bunu "yakında" olarak gösterir.
export async function fetchConCityStats(uuid: string): Promise<ConCityStats | null> {
  if (!CONCITY_API_URL) return null;
  const res = await fetch(`${CONCITY_API_URL}/players/${uuid}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`İstatistikler alınamadı (HTTP ${res.status})`);
  return res.json();
}
