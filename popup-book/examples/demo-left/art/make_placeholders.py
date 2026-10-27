"""Placeholder art for the left-bound test book, drawn by code (a real book gets its art from the prompt pack)."""
import math, os
from PIL import Image, ImageDraw, ImageFilter
OUT = os.path.join(os.path.dirname(__file__), '..', 'art-src')
INK = (52, 40, 30, 255)

def canvas(w, h): return Image.new('RGBA', (w, h), (0, 0, 0, 0))

def battery():
    im = canvas(600, 900); d = ImageDraw.Draw(im)
    d.rounded_rectangle([150, 160, 450, 820], 40, fill=(70, 96, 120, 255), outline=INK, width=8)
    d.rectangle([150, 160, 450, 380], fill=(184, 72, 52, 255), outline=INK, width=8)
    d.rounded_rectangle([250, 100, 350, 165], 14, fill=(190, 180, 160, 255), outline=INK, width=8)
    for y in range(420, 800, 34): d.line([170, y, 430, y], fill=(255, 255, 255, 40), width=3)
    im.save(f'{OUT}/battery.png')

def resistor():
    im = canvas(1200, 520); d = ImageDraw.Draw(im)
    d.line([40, 400, 1160, 400], fill=(150, 140, 125, 255), width=14)
    for x0 in (60, 1110): d.rectangle([x0, 400, x0 + 30, 500], fill=(150, 140, 125, 255))
    d.rounded_rectangle([300, 300, 900, 500], 90, fill=(214, 196, 160, 255), outline=INK, width=8)
    for x, c in [(400, (120, 70, 40)), (480, (30, 30, 30)), (560, (190, 40, 30)), (760, (200, 160, 40))]:
        d.rectangle([x, 302, x + 36, 498], fill=c + (255,))
    im.save(f'{OUT}/resistor.png')

def lamp():
    im = canvas(560, 900); d = ImageDraw.Draw(im)
    d.ellipse([90, 80, 470, 460], fill=(236, 230, 210, 235), outline=INK, width=8)
    d.polygon([(200, 430), (360, 430), (330, 560), (230, 560)], fill=(236, 230, 210, 235), outline=INK)
    d.line([(240, 520), (250, 300), (280, 260), (310, 300), (320, 520)], fill=(120, 80, 40, 255), width=6)
    d.rectangle([220, 560, 340, 690], fill=(160, 150, 130, 255), outline=INK, width=8)
    for y in range(580, 690, 22): d.line([220, y, 340, y + 8], fill=INK, width=4)
    d.rectangle([150, 690, 410, 840], fill=(110, 80, 60, 255), outline=INK, width=8)
    im.save(f'{OUT}/lamp.png')

def knob():
    im = canvas(300, 500); d = ImageDraw.Draw(im)
    d.rectangle([135, 160, 165, 480], fill=(110, 80, 60, 255), outline=INK, width=5)
    d.rounded_rectangle([60, 40, 240, 200], 40, fill=(184, 72, 52, 255), outline=INK, width=8)
    im.save(f'{OUT}/knob.png')

def student():
    im = canvas(500, 1000); d = ImageDraw.Draw(im)
    d.ellipse([180, 60, 320, 200], fill=(232, 200, 170, 255), outline=INK, width=6)
    d.polygon([(150, 230), (350, 230), (390, 640), (110, 640)], fill=(80, 110, 140, 255), outline=INK)
    d.rectangle([150, 640, 220, 940], fill=(60, 55, 50, 255)); d.rectangle([280, 640, 350, 940], fill=(60, 55, 50, 255))
    d.line([(350, 260), (440, 160)], fill=(232, 200, 170, 255), width=34)
    im.save(f'{OUT}/student.png')

def cover():
    im = Image.new('RGB', (1024, 1536), (52, 70, 86)); d = ImageDraw.Draw(im)
    for i in range(0, 1536, 48):
        d.line([0, i, 1024, i + 300], fill=(64, 84, 102), width=2)
    for r in range(80, 900, 70):
        d.ellipse([512 - r, 1100 - r, 512 + r, 1100 + r], outline=(84, 108, 128), width=3)
    im = im.filter(ImageFilter.GaussianBlur(0.6)); im.save(f'{OUT}/cover.png')

os.makedirs(OUT, exist_ok=True)
for f in (battery, resistor, lamp, knob, student, cover): f()
print('placeholders written to', os.path.abspath(OUT))
