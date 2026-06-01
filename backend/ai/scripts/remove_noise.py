"""
Remove noise from an image using OpenCV Non-local Means Denoising.
Usage: python remove_noise.py <input_path> <output_path> [intensity]
intensity: low | medium | high (default: medium)
"""
import sys
import cv2

def get_params(intensity: str):
    if intensity == 'low':
        return 5, 5, 7, 15
    elif intensity == 'high':
        return 15, 15, 7, 21
    else:  # medium
        return 10, 10, 7, 21

def main():
    if len(sys.argv) < 3:
        print('Usage: remove_noise.py <input> <output> [intensity]', file=sys.stderr)
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]
    intensity = sys.argv[3] if len(sys.argv) > 3 else 'medium'

    h, hColor, template_size, search_size = get_params(intensity)

    img = cv2.imread(input_path)
    if img is None:
        print(f'Cannot read image: {input_path}', file=sys.stderr)
        sys.exit(1)

    denoised = cv2.fastNlMeansDenoisingColored(img, None, h, hColor, template_size, search_size)
    cv2.imwrite(output_path, denoised)
    print(output_path)

if __name__ == '__main__':
    main()
