// Sunucuya ait sabit bilgiler. Discord/mağaza linklerini buradan güncelle.
export const SERVER = {
  name: 'ConCity',
  address: 'con.city',
  port: 25565,
};

export type LinkItem = { title: string; description: string; url: string };

export const LINKS: LinkItem[] = [
  { title: 'Resmi site', description: 'Kayıt ve hesap işlemleri', url: 'https://con.city' },
  // TODO: Doğru linkler netleşince ekle:
  // { title: 'Discord', description: 'Topluluk ve destek', url: 'https://discord.gg/...' },
  // { title: 'Mağaza', description: 'KCoin ve paketler', url: 'https://...' },
];

// Sunucu ekibi bir API açtığında buraya yazılacak (ör. 'https://api.con.city').
// Boş kaldığı sürece haberler uygulama içi örnek verilerden, oyuncu
// istatistikleri ise "henüz yok" olarak gösterilir.
export const CONCITY_API_URL = '';
