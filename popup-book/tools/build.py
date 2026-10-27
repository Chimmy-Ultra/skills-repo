"""Build one book into <book>/dist/: index.html (engine + spreads + data + embedded fonts) and a/*.webp.

usage: python3 tools/build.py examples/bianjing

Reads  <book>/book.json            the book's settings (title, binding, colours, fonts, cover, UI strings)
       <book>/spreads/*.js         the spreads; one of them defines `const SPREADS = [...]` (load order = file order)
       <book>/build/pieces.json    written by tools/cut.py
       <book>/build/a/*.webp       written by tools/cut.py
Only the art the code actually references is shipped.
"""
import base64, glob, io, json, os, re, shutil, sys
import logging
from fontTools import subset, ttLib
logging.getLogger('fontTools').setLevel(logging.ERROR)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VENDOR = os.path.join(ROOT, 'vendor')
BRUSH = os.path.join(VENDOR, 'fonts', 'wt071.ttf')          # 王漢宗中行書 (GPL), fetched by tools/setup.sh


def main(book_dir):
    book_dir = os.path.abspath(book_dir)
    BOOK = json.load(open(f'{book_dir}/book.json', encoding='utf-8'))
    eng = sorted(glob.glob(f'{ROOT}/engine/*.js'))
    pre = [f for f in eng if os.path.basename(f) < '50']
    post = [f for f in eng if os.path.basename(f) >= '50']
    spreads = sorted(glob.glob(f'{book_dir}/spreads/*.js'))
    if not spreads:
        sys.exit('no spreads in ' + book_dir + '/spreads')
    js = '\n'.join(open(f, encoding='utf-8').read() for f in pre + spreads + post)
    P = json.load(open(f'{book_dir}/build/pieces.json')) if os.path.exists(f'{book_dir}/build/pieces.json') else {}

    # which art does the code reference? quoted ids, a/<id>.webp paths, 'name' + i frame sequences, plan images, the cover
    def used(key):
        if re.search(r"""['"`]%s['"`]""" % re.escape(key), js) or f'a/{key}.webp' in js:
            return True
        m = re.match(r'(.+?)(\d+)$', key)
        return bool(m and re.search(r"""['"`]%s['"`]\s*\+""" % re.escape(m.group(1)), js))
    # s: the scale the cutter applied to the source image (texture px / source px), for books that size cards
    # by their source pixels so everything drawn at one scale stays at one scale
    pieces = {k: {'w': v['w'], 'h': v['h'], 's': v['src'][2], 'rings': v['rings']} for k, v in P.get('pieces', {}).items() if used(k)}
    sprites = {k: v for k, v in P.get('sprites', {}).items() if used(k)}
    plan_ids = set(BOOK.get('planImages', []))
    for grp in re.findall(r"planImages:\s*\[([^\]]*)\]", js):
        plan_ids |= {x.strip(" '\"\n") for x in grp.split(',') if x.strip(" '\"\n")}
    cover = (BOOK.get('cover') or {}).get('image', 'cover')
    ship = set(pieces) | set(sprites) | plan_ids | {cover} | set(BOOK.get('assets', []))
    for k in list(P.get('flats', {})):
        if used(k): ship.add(k)

    data = ('const BOOK = ' + json.dumps(BOOK, ensure_ascii=False) + ';\n'
            'const PIECES = ' + json.dumps(pieces, separators=(',', ':')) + ';\n'
            'const SPRITES = ' + json.dumps(sprites, separators=(',', ':')) + ';\n'
            'const INFO = ' + json.dumps(P.get('info', {}), separators=(',', ':')) + ';\n'
            'const ATLAS = ' + json.dumps(P.get('atlas', {}), separators=(',', ':')) + ';')
    assert '/*%%DATA%%*/' in js
    js = js.replace('/*%%DATA%%*/', data, 1)

    # fonts: the brush font, subset to the characters used, minus glyphs it draws empty (they fall back);
    # plus a Latin face when the book asks for one
    html = open(f'{ROOT}/engine/index.html', encoding='utf-8').read()
    ui_text = json.dumps(BOOK, ensure_ascii=False)
    chars = set(c for c in (js + html + ui_text) if ord(c) > 0x2000) | set('﹁﹂﹃﹄︽︾︵︶')
    f = ttLib.TTFont(BRUSH)
    cmap = f.getBestCmap()
    glyf = f['glyf'] if 'glyf' in f else None
    empty = {c for c in chars if glyf is not None and not c.isspace() and ord(c) in cmap and glyf[cmap[ord(c)]].numberOfContours == 0}
    missing = sorted(c for c in chars if 0x4e00 <= ord(c) <= 0x9fff and ord(c) not in cmap)
    keep = chars - empty
    o = subset.Options(); o.flavor = 'woff2'; o.notdef_outline = True
    s = subset.Subsetter(o); s.populate(text=''.join(sorted(keep))); s.subset(f)
    buf = io.BytesIO(); f.flavor = 'woff2'; f.save(buf)
    css = [f"@font-face{{font-family:'HWXing';font-weight:400;font-style:normal;font-display:block;src:url(data:font/woff2;base64,{base64.b64encode(buf.getvalue()).decode()}) format('woff2');}}"]
    latin = BOOK.get('latinFont')
    if latin:
        slug = latin.lower().replace(' ', '-')
        for weight, style in [(400, 'normal'), (400, 'italic'), (700, 'normal')]:
            p = f'{VENDOR}/node_modules/@fontsource/{slug}/files/{slug}-latin-{weight}-{style}.woff2'
            if not os.path.exists(p):
                print('latin font file missing:', p, '(npm install --prefix vendor @fontsource/%s)' % slug); continue
            b64 = base64.b64encode(open(p, 'rb').read()).decode()
            css.append(f"@font-face{{font-family:'{latin}';font-weight:{weight};font-style:{style};font-display:block;src:url(data:font/woff2;base64,{b64}) format('woff2');}}")
    ui_font = (f'"{latin}", ' if latin else '') + '"HWXing", "Kaiti TC", "STKaiti", serif'
    fill = {'%%FONTS%%': '\n'.join(css), '%%UIFONT%%': ui_font, '%%TITLE%%': BOOK['title'],
            '%%ARIA%%': BOOK.get('aria', BOOK['title'] + '：可以用手指翻頁的立體書'),
            '%%LOADER%%': BOOK.get('loader', '研墨中'), '%%TURNHINT%%': BOOK.get('turnHint', '橫拿手機，書會更大')}
    for k, v in fill.items():
        html = html.replace(k, v)
    out = html.replace('%%APP%%', js)

    dist = f'{book_dir}/dist'
    shutil.rmtree(f'{dist}/a', ignore_errors=True); os.makedirs(f'{dist}/a', exist_ok=True)
    open(f'{dist}/index.html', 'w', encoding='utf-8').write(out)
    lost = []
    for k in sorted(ship):
        src = f'{book_dir}/build/a/{k}.webp'
        if os.path.exists(src): shutil.copy(src, f'{dist}/a/')
        else: lost.append(k)
    size = sum(os.path.getsize(p) for p in glob.glob(f'{dist}/a/*.webp'))
    print('index.html %.0f KB, brush font %.0f KB (%d glyphs), assets %d (%.1f MB)' % (
        len(out.encode()) / 1024, len(buf.getvalue()) / 1024, len(keep), len(glob.glob(f'{dist}/a/*.webp')), size / 1e6))
    if empty: print('drawn by a fallback font (empty in the brush font):', ''.join(sorted(empty)))
    if missing: print('NOT IN THE BRUSH FONT (fallback):', ''.join(missing))
    if lost: print('MISSING ART (referenced, not cut):', lost)
    unused = sorted(set(P.get('pieces', {})) - set(pieces))
    if unused: print('cut but unused:', ' '.join(unused))
    # the map the Artifact publish needs: {"a/x.webp": "<book>/dist/a/x.webp"}
    files = {f'a/{os.path.basename(p)}': os.path.relpath(p, os.getcwd()) for p in sorted(glob.glob(f'{dist}/a/*.webp'))}
    json.dump(files, open(f'{dist}/files.json', 'w'), ensure_ascii=False)
    print('publish map:', os.path.relpath(f'{dist}/files.json', os.getcwd()), f'({len(files)} files)')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '.')
