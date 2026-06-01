"""
Remove image background using rembg.
Usage: python remove_background.py <input_path> <output_path>
Output is a PNG with transparency.
"""
import sys

def main():
    if len(sys.argv) < 3:
        print('Usage: remove_background.py <input> <output>', file=sys.stderr)
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    try:
        from rembg import remove
        from PIL import Image
        import io

        with open(input_path, 'rb') as f:
            input_data = f.read()

        output_data = remove(input_data)

        img = Image.open(io.BytesIO(output_data))
        img.save(output_path, 'PNG')
        print(output_path)
    except ImportError:
        print('rembg not installed. Run: pip install rembg', file=sys.stderr)
        sys.exit(2)

if __name__ == '__main__':
    main()
