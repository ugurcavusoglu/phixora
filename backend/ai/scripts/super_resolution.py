"""
Super resolution using Real-ESRGAN + optional GFPGAN face enhancement.
Usage: python super_resolution.py <input_path> <output_path> [scale] [face_enhance]
  scale: 2 | 4 (default: 4)
  face_enhance: true | false (default: false)
"""
import sys
import os

def main():
    if len(sys.argv) < 3:
        print('Usage: super_resolution.py <input> <output> [scale] [face_enhance]', file=sys.stderr)
        sys.exit(1)

    input_path  = sys.argv[1]
    output_path = sys.argv[2]
    scale       = int(sys.argv[3]) if len(sys.argv) > 3 else 4
    face_enhance = (sys.argv[4].lower() == 'true') if len(sys.argv) > 4 else False

    script_dir     = os.path.dirname(os.path.abspath(__file__))
    realesrgan_dir = os.path.normpath(os.path.join(script_dir, '..', 'Real-ESRGAN'))
    models_dir     = os.path.join(realesrgan_dir, 'experiments', 'pretrained_models')

    model_name = 'RealESRGAN_x4plus' if scale >= 4 else 'RealESRGAN_x2plus'
    model_path = os.path.join(models_dir, f'{model_name}.pth')

    if not os.path.exists(model_path):
        print(f'Model not found: {model_path}. Download it first.', file=sys.stderr)
        sys.exit(2)

    try:
        import cv2
        import torch
        from basicsr.archs.rrdbnet_arch import RRDBNet
        from realesrgan import RealESRGANer
    except ImportError as e:
        print(f'Missing dependency: {e}', file=sys.stderr)
        sys.exit(2)

    # Use 2-block model for 2x, 23-block for 4x
    num_block = 23 if scale >= 4 else 23
    model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64,
                    num_block=num_block, num_grow_ch=32, scale=scale)

    use_half = torch.cuda.is_available()

    upsampler = RealESRGANer(
        scale=scale,
        model_path=model_path,
        model=model,
        tile=0,
        tile_pad=10,
        pre_pad=0,
        half=use_half,
        gpu_id=None,
    )

    img = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        print(f'Cannot read image: {input_path}', file=sys.stderr)
        sys.exit(1)

    if face_enhance:
        try:
            from gfpgan import GFPGANer
        except ImportError:
            print('gfpgan not installed. Run: pip install gfpgan', file=sys.stderr)
            sys.exit(2)

        gfpgan_model = os.path.join(models_dir, 'GFPGANv1.3.pth')
        if not os.path.exists(gfpgan_model):
            # Fall back to auto-download URL
            gfpgan_model = 'https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.3.pth'

        face_enhancer = GFPGANer(
            model_path=gfpgan_model,
            upscale=scale,
            arch='clean',
            channel_multiplier=2,
            bg_upsampler=upsampler,
        )
        _, _, output = face_enhancer.enhance(
            img, has_aligned=False, only_center_face=False, paste_back=True
        )
    else:
        output, _ = upsampler.enhance(img, outscale=scale)

    cv2.imwrite(output_path, output)
    print(output_path)

if __name__ == '__main__':
    main()
