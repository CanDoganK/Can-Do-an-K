import { CONCITY_API_URL } from '../config';
import { SAMPLE_NEWS, type NewsItem } from '../data/news';

export type { NewsItem };

// API varsa oradan, yoksa uygulama içindeki örnek duyurulardan okur.
export async function fetchNews(): Promise<NewsItem[]> {
  if (!CONCITY_API_URL) return SAMPLE_NEWS;
  const res = await fetch(`${CONCITY_API_URL}/news`);
  if (!res.ok) throw new Error(`Duyurular alınamadı (HTTP ${res.status})`);
  return res.json();
}

export async function fetchNewsItem(id: string): Promise<NewsItem | undefined> {
  const items = await fetchNews();
  return items.find((item) => item.id === id);
}
