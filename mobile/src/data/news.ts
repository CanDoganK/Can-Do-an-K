export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  body: string;
  tag: 'Güncelleme' | 'Etkinlik' | 'Duyuru';
  date?: string; // ISO tarih; bilinmiyorsa boş
};

// Örnek içerik: sunucu ekibinin API'si gelene kadar gösterilir.
export const SAMPLE_NEWS: NewsItem[] = [
  {
    id: 'season-3',
    title: 'Season 3 başladı',
    summary: 'Yeni görev sistemi, yenilenen adalar ve güncellenen ekonomi.',
    body:
      'Season 3 ile birlikte gelen başlıca değişiklikler:\n\n' +
      '• Yeni görev sistemi\n' +
      '• Yeniden düzenlenen ada sistemi\n' +
      '• Güncellenen ekonomi ve kasalar\n' +
      '• Performans iyileştirmeleri\n\n' +
      'Ayrıntılar için resmi site ve Discord duyurularını takip edin.',
    tag: 'Güncelleme',
  },
  {
    id: 'mobil-uygulama',
    title: 'Mobil uygulama test sürümünde',
    summary: 'Sunucu durumunu, duyuruları ve rehberleri telefondan takip edin.',
    body:
      'Bu uygulama ConCity oyuncuları için hazırlanan topluluk yapımı bir uygulamadır. ' +
      'Oyuncu istatistikleri, sunucu ekibiyle yapılacak API entegrasyonundan sonra eklenecektir.',
    tag: 'Duyuru',
    date: '2026-10-29',
  },
];
