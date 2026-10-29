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

## Sunucu ekibi API açarsa

`src/config.ts` içindeki `CONCITY_API_URL` değerini doldurmanız yeterli. Uygulama şu uç noktaları bekler:

- `GET /news` → `NewsItem[]` (`src/data/news.ts` içindeki tip)
- `GET /players/:uuid` → `ConCityStats` (`src/api/player.ts` içindeki tip), oyuncu yoksa 404

Discord ve mağaza linkleri `src/config.ts` içindeki `LINKS` listesine eklenir.
