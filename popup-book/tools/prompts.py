"""Write an art prompt pack for Codex (or any image tool) from a book's own prompt script.

A book's art/prompts.py does:

    import sys; sys.path.insert(0, '<repo>/tools')
    from prompts import Pack, SINGLE, OBJ, SHEET, STRIP
    STYLE = "..."                                    # the one style paragraph every image shares
    pack = Pack(title='汴京一日', batch='bianjing-art-1', style=STYLE, anchor='01-zhuque-gate')
    pack.add('01-zhuque-gate', '朱雀門（風格基準，先生成）', '1536x1024', "Subject: ...", [ARCH, SINGLE], section='城門晨開')
    pack.reject('a building is drawn in perspective instead of a flat front elevation')
    pack.write(os.path.dirname(__file__))           # -> <batch>-prompts.md + <batch>.json

Then send the .md file to Chimmy; he runs it in Codex and brings back <batch>.zip.

Rules the presentation blocks encode (why the art can become die-cut cards):
  * one subject per image, or a sheet of separate subjects with empty space between them
  * a flat front view (orthographic elevation) for anything that stands on the page; the page itself is the plan
  * no ground, no cast shadow, no background: the engine lights the cards itself
  * a plain pure white (or transparent) background with a margin; nothing touches the edges (except strips)
  * no writing at all: text belongs to the book, and generated lettering is wrong or garbled
  * moving parts drawn separately (doors, a mast, a lid), each on its own image
"""
import json, os

SINGLE = ("Presentation: one isolated subject for a die-cut pop-up book. Flat front elevation, straight-on orthographic view, no perspective, "
          "no ground plane, no cast shadow, no background scenery, even neutral daylight. Centred on a plain pure white background, "
          "with a generous empty margin all around; nothing touches the image edges.")
OBJ = ("Presentation: one isolated subject for a die-cut pop-up book, drawn at the viewing angle stated in the subject description. "
       "No ground plane, no cast shadow, no background scenery, even neutral daylight. Centred on a plain pure white background, "
       "with a generous empty margin all around; nothing touches the image edges.")
SHEET = ("Presentation: a sheet of separate subjects for a die-cut pop-up book, arranged in a loose grid with clear empty space between them; "
         "no subject overlaps another and each is fully visible. No ground plane, no cast shadows, no background scenery, even neutral daylight, "
         "plain pure white background, nothing touching the image edges.")
STRIP = ("Presentation: a long horizontal strip for a die-cut pop-up book, front elevation, no perspective, no cast shadow, no background scenery, "
         "even neutral daylight, plain pure white background above and below the strip. The strip runs the full width of the image and may "
         "touch the left and right edges.")
NEUTRAL_LIGHT = ("Draw everything in even neutral daylight colours even though the scene happens in the evening or at night; "
                 "lamplight and night colour are added later by the book.")
NOTEXT = ("Absolutely no writing anywhere: no Chinese characters, letters, numbers, seals, signatures, watermarks or frames. "
          "Every signboard, plaque and banner is blank.")


class Pack:
    def __init__(self, title, batch, style, anchor=None, anchor_dir=None, notext=NOTEXT):
        """anchor: the file (without .png) of the style anchor. In the first batch it is generated first;
        later batches attach it from anchor_dir (the first batch's folder) as a style reference."""
        self.title, self.batch, self.style, self.anchor, self.anchor_dir, self.notext = title, batch, style, anchor, anchor_dir, notext
        self.entries, self.rejects = [], []

    def add(self, fid, title, size, body, blocks, section='', transparent=True, ref=True, bleed=False):
        """bleed=True: a full-bleed picture (a cover) that is meant to touch the image edges"""
        self.entries.append({'file': f'{fid}.png', 'title': title, 'section': section, 'size': size,
                             'strip': STRIP in blocks or bleed, 'transparent_background': transparent,
                             'use_style_reference': bool(ref and self.anchor and fid != self.anchor),
                             'prompt': ' '.join([self.style] + list(blocks) + [body, self.notext])})

    def reject(self, rule):
        """a book-specific reason to regenerate, e.g. 'entry 30 shows a mast'"""
        self.rejects.append(rule)

    def write(self, folder):
        strips = [e['file'][:-4] for e in self.entries if e['strip']]
        ref = f'{self.anchor_dir}/{self.anchor}.png' if self.anchor_dir else f'{self.batch}/{self.anchor}.png'
        md = [f'# {self.title}：美術素材 {self.batch}', '', '## Instructions for Codex', '',
              f'Generate every image listed below and save them as PNG files in a new folder named `{self.batch}/`.', '',
              '1. Use each entry\'s prompt exactly as written, at its size, with the highest quality setting available. If a larger size with the same aspect ratio is available, use the larger one.',
              '2. When transparent_background is true and the image tool supports it, request a transparent background; otherwise keep the pure white background the prompt asks for.']
        if self.anchor:
            if self.anchor_dir:
                md.append(f'3. Style lock: attach `{ref}` as a reference image to every entry marked use_style_reference, if the tool accepts input images, and append: "Match the drawing style, line weight and colour palette of the reference image exactly; do not copy its subject."')
            else:
                md.append(f'3. Style lock: generate `{self.anchor}.png` first. Then attach it as a reference image to every other entry, if the tool accepts input images, and append: "Match the drawing style, line weight and colour palette of the reference image exactly; do not copy its subject."')
        md += ['4. Check every result by looking at it. Regenerate (up to 3 attempts per entry) when any of these is true:',
               '   - it contains any writing: characters, letters, numbers, seals, signatures or watermarks;',
               '   - the subject is cut off by or touches the image edge' + (f' (except {", ".join(strips)}, which are meant to reach the edges)' if strips else '') + ';',
               '   - a subject meant as a flat front elevation is drawn in perspective or three-quarter view, or there is ground, a cast shadow or background scenery;',
               '   - subjects on a sheet overlap each other;']
        md += [f'   - {r};' for r in self.rejects]
        md += ['5. Keep the exact file names. Do not crop, upscale, recolour or otherwise post-process.',
               f'6. When finished, write `{self.batch}/manifest.txt` listing each file, its final size and how many attempts it took, then zip the folder as `{self.batch}.zip`.',
               '', '## Images', '']
        cur = None
        for e in self.entries:
            if e['section'] != cur:
                cur = e['section']; md += [f'## {cur}', ''] if cur else []
            md += [f"### {e['file']}  ({e['title']})",
                   f"size: {e['size']} · transparent_background: {str(e['transparent_background']).lower()} · use_style_reference: {str(e['use_style_reference']).lower()}",
                   '', '```text', e['prompt'], '```', '']
        os.makedirs(folder, exist_ok=True)
        open(f'{folder}/{self.batch}-prompts.md', 'w', encoding='utf-8').write('\n'.join(md))
        json.dump({'output_dir': self.batch, 'style_reference': ref if self.anchor else None, 'images': self.entries},
                  open(f'{folder}/{self.batch}.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print(f'{len(self.entries)} images -> {folder}/{self.batch}-prompts.md; longest prompt {max(len(e["prompt"]) for e in self.entries)} chars')
