import os
import urllib.request

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'Real-ESRGAN', 'experiments', 'pretrained_models')

MODELS = [
    ('RealESRGAN_x4plus.pth', 'https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth'),
    ('RealESRGAN_x2plus.pth', 'https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.1/RealESRGAN_x2plus.pth'),
    ('GFPGANv1.3.pth',        'https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.3.pth'),
]

os.makedirs(MODELS_DIR, exist_ok=True)

def show_progress(name):
    def reporthook(count, block_size, total_size):
        if total_size <= 0:
            return
        pct = min(count * block_size * 100 // total_size, 100)
        mb_done = count * block_size / (1024 * 1024)
        mb_total = total_size / (1024 * 1024)
        print(f'\r  {name}: {pct}%  ({mb_done:.1f} / {mb_total:.1f} MB)', end='', flush=True)
    return reporthook

for filename, url in MODELS:
    dest = os.path.join(MODELS_DIR, filename)
    if os.path.exists(dest):
        print(f'  {filename} already exists, skipping.')
        continue
    print(f'Downloading {filename}...')
    urllib.request.urlretrieve(url, dest, reporthook=show_progress(filename))
    print()

print('\nAll models ready.')
