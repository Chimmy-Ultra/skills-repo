"""Bring a batch of generated art into a book: unzip (or copy a folder), convert every image to a
high-quality WebP in <book>/art-src/ (alpha kept), and write a contact sheet to look at.

usage: python3 tools/import_art.py <book> <batch.zip | folder>
"""
import glob, os, shutil, sys, tempfile, zipfile
from concurrent.futures import ProcessPoolExecutor
from PIL import Image, ImageDraw


def convert(args):
    src, dst = args
    Image.open(src).save(dst, quality=94, method=4)
    return dst


def main(book, src):
    book = os.path.abspath(book)
    out = f'{book}/art-src'; os.makedirs(out, exist_ok=True)
    tmp = None
    if src.endswith('.zip'):
        tmp = tempfile.mkdtemp(); zipfile.ZipFile(src).extractall(tmp); src = tmp
    files = sorted(p for p in glob.glob(f'{src}/**/*', recursive=True) if p.lower().endswith(('.png', '.webp', '.jpg', '.jpeg')))
    jobs = [(p, f'{out}/{os.path.splitext(os.path.basename(p))[0]}.webp') for p in files]
    with ProcessPoolExecutor() as ex:
        done = list(ex.map(convert, jobs))
    if tmp: shutil.rmtree(tmp)
    # contact sheet of what came in
    W = 300; cols = 6; rows = (len(done) + cols - 1) // cols
    sheet = Image.new('RGB', (W * cols, (W + 22) * rows), '#8a8a8a'); d = ImageDraw.Draw(sheet)
    for i, p in enumerate(done):
        im = Image.open(p).convert('RGBA'); size = im.size; im.thumbnail((W - 8, W - 8))
        x, y = (i % cols) * W, (i // cols) * (W + 22)
        sheet.paste(im, (x + 4, y + 4), im); d.text((x + 4, y + W), f'{os.path.basename(p)[:-5]} {size[0]}x{size[1]}', fill='black')
    os.makedirs(f'{book}/build/measure', exist_ok=True)
    sheet.save(f'{book}/build/measure/import-contact.png')
    print(f'{len(done)} images -> {out}; contact sheet: {book}/build/measure/import-contact.png')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
