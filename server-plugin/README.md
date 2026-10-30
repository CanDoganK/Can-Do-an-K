# ConCityAPI (örnek Paper eklentisi)

ConCity mobil uygulamasının beklediği API'yi ([docs/API.md](../docs/API.md)) sağlayan
küçük bir Paper eklentisi. Ek kütüphane gerektirmez; Java'nın yerleşik HTTP sunucusunu kullanır.

- `GET /news` → `config.yml` içindeki `news` listesi
- `GET /players/{uuid}` → `config.yml` içindeki `stats` eşlemesindeki PlaceholderAPI değerleri
- `GET /health`

## Kurulum

1. `pom.xml` içindeki `paper-api` sürümünü sunucunun sürümüne göre ayarlayın.
2. `mvn package` → `target/concity-api-0.1.0.jar` dosyasını `plugins/` klasörüne koyun.
3. Sunucuyu başlatın; `plugins/ConCityAPI/config.yml` oluşur.
4. `stats` bölümündeki placeholder'ları sunucuda kurulu eklentilere göre düzenleyin
   (ör. ada seviyesi için kullanılan Skyblock eklentisinin placeholder'ı).
   Değerlerin doğru geldiğini `/papi parse <oyuncu> %placeholder%` ile kontrol edebilirsiniz.
5. Portu (varsayılan 8085) HTTPS veren bir ters proxy arkasına alın ve adresi
   mobil uygulamadaki `CONCITY_API_URL` değerine yazın.

Duyuruları güncellemek için `config.yml` düzenlenip sunucu yeniden başlatılır.

## Durum

Bu bir başlangıç taslağıdır: gerçek Paper API'sine karşı derlenip bir test sunucusunda
denenmedi. Kullanmadan önce bir test sunucusunda deneyin.
