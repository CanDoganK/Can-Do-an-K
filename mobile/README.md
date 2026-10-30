# ConCity Mobil

ConCity Minecraft sunucusu (`con.city`) için topluluk yapımı mobil uygulama.
React Native + Expo (SDK 58) ve Expo Router ile yazıldı; Android ve iOS'ta çalışır.

## Ekranlar

| Sekme | İçerik | Veri kaynağı |
| --- | --- | --- |
| Durum | Açık/kapalı, çevrimiçi oyuncu, sürüm, MOTD, adresi kopyalama | [mcsrvstat.us](https://api.mcsrvstat.us) (herkese açık) |
| Haberler | Duyuru listesi ve detay sayfası | Şimdilik `src/data/news.ts`, API gelince `CONCITY_API_URL/news` |
| Profil | Kullanıcı adıyla arama, skin, UUID, sunucu istatistikleri | Mojang API + mc-heads.net; istatistikler `CONCITY_API_URL/players/:uuid` |
| Rehber | Bağlantılar ve Skyblock rehberleri | `src/config.ts`, `src/data/guides.ts` |

## Çalıştırma

```bash
npm install
npm start          # QR kodu telefondaki Expo Go ile okutun
npm run typecheck
```

## Bildirimler

Durum sekmesinin altındaki **Bildirimler** kartından açılır (yalnızca telefonda):
sunucu açılınca/kapanınca ve yeni duyuru gelince bildirim gösterir. Kontrol arka planda
`expo-background-task` ile yapılır; sıklığı telefon belirler (en sık 15 dakika).
Arka plan görevleri Expo Go'da sınırlıdır; güvenilir test için bir development build
(`npx eas-cli@latest build --profile development`) kullanın.

## Simge ve logo

`assets/brand/` içindeki ConCity görsellerinden `python3 scripts/make-icons.py` ile üretilir.
Daha yüksek çözünürlüklü bir kalp görseli (en az 1024 px) gelirse dosyayı değiştirip betiği
tekrar çalıştırın; şu anki kaynak 128 px olduğu için büyük simgeler biraz yumuşak görünür.

Uygulamayı mağazalara yüklemeden önce logo ve ad kullanımı için sunucu sahibinden izin alın.

## Sunucu ekibi API açarsa

`src/config.ts` içindeki `CONCITY_API_URL` değerini doldurmanız yeterli. Beklenen uç noktalar
[docs/API.md](../docs/API.md) dosyasında; hazır bir örnek Paper eklentisi `server-plugin/` klasöründe.

Discord ve mağaza linkleri `src/config.ts` içindeki `LINKS` listesine eklenir.
