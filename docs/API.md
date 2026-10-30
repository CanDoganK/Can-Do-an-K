# ConCity Mobil API taslağı

Bu belge, ConCity mobil uygulamasının sunucudan beklediği API'yi tanımlar.
Sunucu ekibine iletilmek üzere hazırlandı. Hazır bir örnek uygulama
`server-plugin/` klasöründe (Paper eklentisi) bulunur, ama API başka bir
yöntemle (ör. sitenin mevcut backend'i) de sağlanabilir: önemli olan aşağıdaki
uç noktalar ve JSON biçimidir.

## Genel

- Tüm uç noktalar **salt okunur** (`GET`) ve herkese açıktır; oturum açma gerekmez.
- Yanıtlar `application/json; charset=utf-8`.
- HTTPS önerilir (ör. `https://api.con.city`). Eklenti düz HTTP dinler; önüne
  nginx/Caddy/Cloudflare gibi bir ters proxy konulmalıdır.
- Uygulama, adres `mobile/src/config.ts` içindeki `CONCITY_API_URL` değerine
  yazıldığında bu API'yi kullanmaya başlar.

## Uç noktalar

### `GET /news`

Uygulamanın Haberler sekmesinde gösterilen duyurular.

```json
[
  {
    "id": "season-3",
    "title": "Season 3 başladı",
    "summary": "Yeni görev sistemi, yenilenen adalar ve güncellenen ekonomi.",
    "body": "Uzun metin. Satır sonları \n ile.",
    "tag": "Güncelleme",
    "date": "2026-10-29"
  }
]
```

| Alan | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- |
| `id` | string | evet | Benzersiz ve kalıcı. Bildirimler "yeni duyuru"yu bu alanla anlar; yayınlandıktan sonra değiştirmeyin. |
| `title` | string | evet | Başlık |
| `summary` | string | evet | Listede ve bildirimde görünen kısa özet |
| `body` | string | evet | Detay sayfasındaki metin |
| `tag` | `"Güncelleme"` \| `"Etkinlik"` \| `"Duyuru"` | evet | Etiket rengi buna göre seçilir |
| `date` | string (`YYYY-AA-GG`) | hayır | Liste bu alana göre yeniden eskiye sıralanır |

### `GET /players/{uuid}`

Profil sekmesindeki istatistikler. `{uuid}` tireli veya tiresiz Minecraft UUID'sidir
(uygulama Mojang'dan aldığı tiresiz biçimi gönderir).

```json
{
  "rank": "VIP",
  "islandLevel": 152,
  "balance": 48250.5,
  "kills": 37,
  "playTimeHours": 210
}
```

Tüm alanlar isteğe bağlıdır; olmayanlar uygulamada gösterilmez.

| Durum | Anlamı |
| --- | --- |
| `200` | İstatistikler |
| `400` | UUID geçersiz |
| `404` | Oyuncu sunucuya hiç girmemiş (uygulama "yakında" metnini gösterir) |

### `GET /health`

`{"ok": true}`. İzleme için.

## Sonraki adım: push bildirimleri (isteğe bağlı)

Uygulama şu an bildirimleri kendisi üretiyor: arka planda en sık 15 dakikada bir
sunucu durumunu ve `/news` listesini kontrol edip değişiklik varsa yerel bildirim
gösteriyor. Anlık bildirim (ör. etkinlik başlarken herkese) için ileride şunlar eklenebilir:

- `POST /devices` — gövde `{"expoPushToken": "ExponentPushToken[...]", "topics": ["news", "status"]}`;
  uygulama bildirim izni alınca jetonunu kaydeder.
- `DELETE /devices/{token}` — kullanıcı bildirimleri kapatınca.
- Sunucu, duyuru yayınlarken kayıtlı jetonlara [Expo Push API](https://docs.expo.dev/push-notifications/sending-notifications/)
  üzerinden bildirim gönderir.

Bu adım bir veritabanı ve kötüye kullanıma karşı istek sınırlaması gerektirdiği için
ilk sürüme dahil edilmedi.
