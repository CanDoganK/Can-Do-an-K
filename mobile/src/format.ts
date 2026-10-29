import Colors from '@/constants/Colors';
import type { NewsItem } from './data/news';

export const TAG_COLORS: Record<NewsItem['tag'], string> = {
  Güncelleme: Colors.tint,
  Etkinlik: Colors.warning,
  Duyuru: '#4DA3FF',
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}
