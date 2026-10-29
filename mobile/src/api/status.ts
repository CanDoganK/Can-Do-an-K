import { SERVER } from '../config';

export type ServerStatus = {
  online: boolean;
  playersOnline: number;
  playersMax: number;
  version?: string;
  motd: string[];
  iconDataUri?: string;
  checkedAt: Date;
};

type McSrvStatResponse = {
  online: boolean;
  version?: string;
  icon?: string;
  players?: { online: number; max: number };
  motd?: { clean?: string[] };
};

// Herkese açık mcsrvstat.us API'si ile sunucuyu pingler. Sonuçlar
// mcsrvstat tarafında birkaç dakika önbelleğe alınır.
export async function fetchServerStatus(): Promise<ServerStatus> {
  const res = await fetch(`https://api.mcsrvstat.us/3/${SERVER.address}`, {
    headers: { 'User-Agent': 'ConCityMobile/1.0' },
  });
  if (!res.ok) {
    throw new Error(`Durum alınamadı (HTTP ${res.status})`);
  }
  const data: McSrvStatResponse = await res.json();
  return {
    online: data.online,
    playersOnline: data.players?.online ?? 0,
    playersMax: data.players?.max ?? 0,
    version: data.version,
    motd: data.motd?.clean?.map((line) => line.trim()).filter(Boolean) ?? [],
    iconDataUri: data.icon,
    checkedAt: new Date(),
  };
}
