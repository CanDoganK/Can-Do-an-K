export type Guide = { id: string; title: string; steps: string[] };

export const GUIDES: Guide[] = [
  {
    id: 'join',
    title: 'Sunucuya nasıl girilir?',
    steps: [
      'Minecraft Java Edition\'ı açın.',
      'Çok Oyunculu → Sunucu Ekle\'ye dokunun.',
      'Adres olarak con.city yazın ve kaydedin.',
      'Sunucuyu seçip Bağlan\'a basın.',
      'İlk girişte kayıt için resmi sitedeki adımları izleyin.',
    ],
  },
  {
    id: 'skyblock-start',
    title: 'Skyblock\'a başlangıç',
    steps: [
      'İlk iş olarak bir ağaç dikin ve fidan biriktirin; odun her şeyin temelidir.',
      'Su ve lavı yan yana getirerek bir kırıktaş (cobblestone) üreteci kurun.',
      'Adanızı genişletmeden önce düşmeyi önlemek için kenarlara blok koyun.',
      'Görevleri takip edin; erken ödüller ilerlemeyi hızlandırır.',
    ],
  },
  {
    id: 'team',
    title: 'Arkadaşlarla ada paylaşmak',
    steps: [
      'Arkadaşlarınızı adanıza davet ederek birlikte oynayabilirsiniz.',
      'Ada üyelerinin yetkilerini dikkatli verin.',
      'Kesin komutlar için oyun içi yardım menüsüne bakın.',
    ],
  },
];
