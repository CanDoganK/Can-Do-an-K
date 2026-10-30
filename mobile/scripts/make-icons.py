"""ConCity marka görsellerinden uygulama simgelerini ve logoyu üretir.

Kaynaklar: assets/brand/heart-source.png (kalp), assets/brand/logo-source.png (yazı logosu).
Daha yüksek çözünürlüklü kaynak gelirse dosyaları değiştirip tekrar çalıştırın:
    python3 scripts/make-icons.py   (mobile/ klasöründen)
"""
from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BRAND = ROOT / 'assets' / 'brand'
OUT = ROOT / 'assets' / 'images'
BG = (16, 20, 24, 255)


def remove_white_background(img, tolerance=40):
    """Kenarlardan başlayarak beyaza yakın arka planı şeffaf yapar (iç kısımlar korunur)."""
    img = img.convert('RGBA')
    w, h = img.size
    px = img.load()
    near_white = lambda p: all(c >= 255 - tolerance for c in p[:3])
    queue = deque((x, y) for x in range(w) for y in (0, h - 1))
    queue.extend((x, y) for y in range(h) for x in (0, w - 1))
    seen = set()
    while queue:
        x, y = queue.popleft()
        if (x, y) in seen or not (0 <= x < w and 0 <= y < h):
            continue
        seen.add((x, y))
        if not near_white(px[x, y]):
            continue
        px[x, y] = (255, 255, 255, 0)
        queue.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    return img.crop(img.getbbox())


def place(content, size, fill_ratio, bg=(0, 0, 0, 0)):
    """İçeriği size x size tuvalin ortasına, kenarın fill_ratio kadarını kaplayacak şekilde koyar."""
    canvas = Image.new('RGBA', (size, size), bg)
    target = int(size * fill_ratio)
    scale = target / max(content.size)
    resized = content.resize(
        (round(content.width * scale), round(content.height * scale)), Image.LANCZOS
    )
    canvas.alpha_composite(resized, ((size - resized.width) // 2, (size - resized.height) // 2))
    return canvas


heart = Image.open(BRAND / 'heart-source.png').convert('RGBA')
heart = heart.crop(heart.getbbox())

place(heart, 1024, 0.72, BG).convert('RGB').save(OUT / 'icon.png')
place(heart, 1024, 0.9).save(OUT / 'splash-icon.png')
place(heart, 48, 0.85, BG).save(OUT / 'favicon.png')
# Android uyarlanabilir simge: içerik merkezdeki güvenli alanda (~%60) kalmalı.
place(heart, 512, 0.58).save(OUT / 'android-icon-foreground.png')
Image.new('RGBA', (512, 512), BG).save(OUT / 'android-icon-background.png')
mono = place(heart, 432, 0.58)
alpha = mono.getchannel('A')
Image.merge('RGBA', (alpha.point(lambda _: 255),) * 3 + (alpha,)).save(
    OUT / 'android-icon-monochrome.png'
)

remove_white_background(Image.open(BRAND / 'logo-source.png')).save(OUT / 'logo.png')
print('Görseller üretildi:', OUT)
