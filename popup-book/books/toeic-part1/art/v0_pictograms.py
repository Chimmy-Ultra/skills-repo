"""Stand-in art for 多益 Part 1 看圖練習 v0: flat pictogram figures and props drawn by code, one image per card,
with the same ids the Codex art will be cut into. Run: python3 art/v0_pictograms.py  -> art-src-v0/*.png"""
import math, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'art-src-v0')
SS = 2                                   # supersampling
INK = (52, 46, 44, 255)
SKIN = [(226, 184, 150, 255), (196, 146, 108, 255), (150, 104, 74, 255), (236, 200, 168, 255)]
HAIR = [(48, 40, 36, 255), (92, 64, 44, 255), (30, 28, 30, 255), (150, 120, 90, 255)]
NAVY, TEAL, OCHRE, BRICK, GREY, SAGE, PLUM = (52, 70, 104, 255), (46, 116, 118, 255), (204, 152, 64, 255), (176, 76, 58, 255), (128, 126, 122, 255), (120, 146, 110, 255), (120, 80, 110, 255)
DARK, WHITE, VEST = (60, 62, 68, 255), (244, 240, 232, 255), (232, 160, 40, 255)
WOOD, METAL, PAPER = (164, 118, 74, 255), (150, 156, 162, 255), (248, 246, 238, 255)


def shade(c, k=0.78): return tuple(int(v * k) for v in c[:3]) + (255,)


class Pc:
    """a piece canvas in 1x units; drawn at SS x"""
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.im = Image.new('RGBA', (w * SS, h * SS), (0, 0, 0, 0)); self.d = ImageDraw.Draw(self.im)

    def P(self, p): return (p[0] * SS, p[1] * SS)

    def line(self, pts, w, col):
        pts = [self.P(p) for p in pts]
        self.d.line(pts, fill=col, width=int(w * SS), joint='curve')
        r = w * SS / 2
        for x, y in (pts[0], pts[-1]): self.d.ellipse([x - r, y - r, x + r, y + r], fill=col)

    def poly(self, pts, col, outline=None, w=3):
        self.d.polygon([self.P(p) for p in pts], fill=col, outline=outline, width=int(w * SS) if outline else 0)

    def rect(self, x0, y0, x1, y1, col, outline=INK, w=3, r=0):
        if r: self.d.rounded_rectangle([x0 * SS, y0 * SS, x1 * SS, y1 * SS], r * SS, fill=col, outline=outline, width=int(w * SS) if outline else 0)
        else: self.d.rectangle([x0 * SS, y0 * SS, x1 * SS, y1 * SS], fill=col, outline=outline, width=int(w * SS) if outline else 0)

    def circ(self, c, r, col, outline=None, w=3):
        self.d.ellipse([(c[0] - r) * SS, (c[1] - r) * SS, (c[0] + r) * SS, (c[1] + r) * SS], fill=col, outline=outline, width=int(w * SS) if outline else 0)

    def save(self, name):
        im = self.im.resize((self.w, self.h), Image.LANCZOS)
        os.makedirs(OUT, exist_ok=True); im.save(f'{OUT}/{name}.png')


def ik(A, T, l1, l2, bend):
    dx, dy = T[0] - A[0], T[1] - A[1]; dist = math.hypot(dx, dy) or 1e-6
    d = min(max(dist, abs(l1 - l2) + 1e-3), l1 + l2 - 1e-3)
    a = (l1 * l1 - l2 * l2 + d * d) / (2 * d); h = math.sqrt(max(0.0, l1 * l1 - a * a))
    ux, uy = dx / dist, dy / dist
    mx, my = A[0] + a * ux, A[1] + a * uy
    E = (mx - bend * h * uy, my + bend * h * ux)
    # the far end, l2 from E toward T
    ex, ey = T[0] - E[0], T[1] - E[1]; el = math.hypot(ex, ey) or 1e-6
    return E, (E[0] + ex / el * l2, E[1] + ey / el * l2)


def person(c, hip, torso=0.0, head=0.0, f=1, feet=None, hands=None, top=NAVY, pants=DARK, skin=0, hair=0, skirt=False,
           hat=None, sleeves=True, bun=False, vest=False, apron=False):
    """hip: (x, y). torso: lean in degrees (positive = forward). feet = (far, near) points; hands = (far, near) points."""
    sk, hr = SKIN[skin], HAIR[hair]
    t = math.radians(torso) * f
    S = (hip[0] + 300 * math.sin(t), hip[1] - 300 * math.cos(t))
    th = t + math.radians(head) * f
    Hc = (S[0] + 88 * math.sin(th), S[1] - 88 * math.cos(th))
    if feet is None: feet = ((hip[0] - 18, hip[1] + 418), (hip[0] + 22, hip[1] + 418))
    if hands is None: hands = ((S[0] - 22 * f, S[1] + 282), (S[0] + 26 * f, S[1] + 282))
    legs = [ik(hip, F, 212, 212, f) for F in feet]
    arms = [ik((S[0], S[1] + 18), Hd, 150, 142, -f) for Hd in hands]

    def leg(i, col):
        K, F = legs[i]
        c.line([hip, K, F], 48, col)
        c.line([F, (F[0] + 46 * f, F[1] + 4)], 26, shade(DARK, 0.6))

    def arm(i, col):
        E, W = arms[i]
        c.line([(S[0], S[1] + 18), E], 38, col)
        c.line([E, W], 34, col if sleeves else sk)
        c.circ(W, 18, sk)
    # far limbs
    leg(0, shade(pants)); arm(0, shade(top))
    # torso
    nx, ny = math.cos(t), math.sin(t)
    if skirt:
        c.poly([(hip[0] - 70, hip[1] + 170), (hip[0] + 70, hip[1] + 170), (hip[0] + 46 * nx, hip[1] + 46 * ny), (hip[0] - 46 * nx, hip[1] - 46 * ny)], pants)
    leg(1, pants)
    body = [(hip[0] - 48 * nx, hip[1] - 48 * ny), (hip[0] + 48 * nx, hip[1] + 48 * ny), (S[0] + 60 * nx, S[1] + 60 * ny), (S[0] - 60 * nx, S[1] - 60 * ny)]
    c.poly(body, top)
    c.circ(S, 60, top)
    if vest: c.poly([(hip[0] - 46 * nx, hip[1] - 46 * ny - 10), (hip[0] + 46 * nx, hip[1] + 46 * ny - 10), (S[0] + 54 * nx, S[1] + 54 * ny + 30), (S[0] - 54 * nx, S[1] - 54 * ny + 30)], VEST)
    if apron: c.poly([(hip[0] - 40 * nx, hip[1] + 120), (hip[0] + 60 * nx, hip[1] + 120), (S[0] + 40 * nx, S[1] + 70), (S[0] - 30 * nx, S[1] + 70)], WHITE)
    # head
    c.line([S, Hc], 34, sk)
    c.circ(Hc, 50, sk)
    c.d.chord([(Hc[0] - 52) * SS, (Hc[1] - 54) * SS, (Hc[0] + 52) * SS, (Hc[1] + 46) * SS], 180 + (-20 if f > 0 else 20), 360 + (-20 if f > 0 else 20), fill=hr)
    if bun: c.circ((Hc[0] - 50 * f, Hc[1] - 20), 24, hr)
    if hat == 'hard': c.d.chord([(Hc[0] - 60) * SS, (Hc[1] - 66) * SS, (Hc[0] + 60) * SS, (Hc[1] + 30) * SS], 180, 360, fill=VEST); c.line([(Hc[0] - 64, Hc[1] - 16), (Hc[0] + 64, Hc[1] - 16)], 10, VEST)
    if hat == 'chef': c.rect(Hc[0] - 40, Hc[1] - 120, Hc[0] + 40, Hc[1] - 36, WHITE, outline=GREY, w=2, r=20)
    # near arm last
    arm(1, top)
    return {'S': S, 'H': Hc, 'hands': [a[1] for a in arms], 'feet': feet}


def W(c, *a, **k): return person(c, *a, **k)


# ---------------------------------------------------------------- people
def typing():
    c = Pc(760, 1000); g = 960
    c.rect(330, 560, 740, 590, WOOD); c.rect(350, 590, 370, g, WOOD, outline=None); c.rect(700, 590, 720, g, WOOD, outline=None)
    c.rect(500, 380, 690, 520, DARK, r=6); c.rect(512, 392, 678, 508, (110, 150, 170, 255), outline=None); c.rect(585, 520, 605, 560, DARK, outline=None)
    c.rect(430, 548, 560, 560, GREY, w=2)                              # keyboard
    c.rect(120, 600, 300, 630, GREY); c.rect(200, 630, 216, g, GREY, outline=None); c.rect(110, 380, 140, 620, GREY)   # chair
    person(c, (220, 610), torso=6, f=1, feet=((390, g - 6), (420, g - 6)), hands=((470, 548), (520, 548)), top=TEAL, pants=DARK, skin=0, hair=1, bun=True)
    c.save('of-typing')


def copier():
    c = Pc(860, 1000); g = 960
    c.rect(470, 470, 820, g, (210, 210, 204, 255), r=10); c.rect(470, 430, 820, 480, (190, 190, 186, 255), r=6)
    c.rect(480, 440, 560, 468, (90, 150, 120, 255), w=2)               # panel
    c.rect(800, 610, 850, 640, PAPER, w=2); c.rect(805, 590, 852, 616, PAPER, w=2)    # copies
    person(c, (300, g - 418), f=1, hands=((440, 470), (520, 452)), top=BRICK, pants=NAVY, skin=1, hair=0)
    c.save('of-copier')


def phone():
    c = Pc(520, 1000); g = 960
    s = person(c, (250, g - 418), f=1, top=SAGE, pants=DARK, skin=2, hair=2, hands=((230, g - 140), (0, 0)))
    c2 = Pc(520, 1000)
    hc = s['H']
    person(c2, (250, g - 418), f=1, top=SAGE, pants=DARK, skin=2, hair=2, hands=((230, g - 140), (hc[0] + 36, hc[1] + 6)))
    c2.rect(hc[0] + 26, hc[1] - 30, hc[0] + 48, hc[1] + 26, DARK, w=2, r=4)
    c2.save('of-phone')


def pointing():
    c = Pc(700, 1000); g = 960
    s = person(c, (220, g - 418), f=1, top=PLUM, pants=DARK, skin=3, hair=1, skirt=True, bun=True,
               hands=((200, g - 150), (220 + 300, g - 418 - 260)))
    c.save('of-pointing')


def chair_carrier():
    c = Pc(700, 1000); g = 960
    c.rect(330, 400, 560, 430, GREY); c.rect(340, 430, 356, 640, GREY, outline=None); c.rect(530, 430, 546, 640, GREY, outline=None); c.rect(540, 230, 570, 420, GREY)
    person(c, (240, g - 418), torso=6, f=1, feet=((180, g), (330, g)), hands=((380, 420), (520, 410)), top=WHITE, pants=NAVY, skin=1, hair=0)
    c.save('of-chair-carrier')


def ladder_climber():
    c = Pc(600, 1100); g = 1060
    for x in (190, 410): c.line([(x, g), (x + 40, 60)], 22, WOOD)
    for i in range(1, 10):
        y = g - i * 105; c.line([(195 + (g - y) / 1000 * 40, y), (405 + (g - y) / 1000 * 40, y)], 14, WOOD)
    person(c, (310, 560), f=1, torso=-2, feet=((290, g - 3 * 105 - 10), (330, g - 5 * 105 - 10)), hands=((230, 230), (420, 140)), top=GREY, pants=NAVY, skin=1, hat='hard', vest=True)
    c.save('si-ladder')


def helmet():
    c = Pc(520, 1000); g = 960
    s = person(c, (260, g - 418), f=1, top=GREY, pants=NAVY, skin=0, hands=((0, 0), (0, 0)))
    c2 = Pc(520, 1000); hc = s['H']
    person(c2, (260, g - 418), f=1, top=GREY, pants=NAVY, skin=0, vest=True, hands=((hc[0] - 70, hc[1] - 60), (hc[0] + 70, hc[1] - 60)))
    c2.d.chord([(hc[0] - 64) * SS, (hc[1] - 130) * SS, (hc[0] + 64) * SS, (hc[1] - 30) * SS], 180, 360, fill=VEST)
    c2.line([(hc[0] - 70, hc[1] - 80), (hc[0] + 70, hc[1] - 80)], 10, VEST)
    c2.save('si-helmet')


def boards():
    c = Pc(820, 1000); g = 960
    s = person(c, (380, g - 418), f=1, top=GREY, pants=NAVY, skin=2, hat='hard', vest=True, hands=((340, g - 150), (460, 300)))
    for k in range(3): c.line([(60, 330 + k * 14), (800, 230 + k * 14)], 14, (196, 150, 98, 255))
    c.save('si-boards')


def barrow():
    c = Pc(900, 1000); g = 960
    c.circ((760, g - 50), 50, DARK); c.circ((760, g - 50), 18, METAL)
    c.poly([(470, 700), (820, 640), (790, 860), (560, 870)], (90, 120, 150, 255), outline=INK)
    c.d.chord([480 * SS, 600 * SS, 800 * SS, 760 * SS], 180, 360, fill=(214, 186, 130, 255))
    c.line([(380, 660), (560, 820)], 14, DARK); c.line([(560, 860), (600, g)], 12, DARK)
    person(c, (250, g - 400), torso=24, f=1, feet=((200, g), (330, g)), hands=((380, 660), (392, 668)), top=GREY, pants=NAVY, skin=1, hat='hard', vest=True)
    c.save('si-barrow')


def painter():
    c = Pc(700, 1000); g = 960
    s = person(c, (200, g - 418), f=1, top=WHITE, pants=(140, 140, 150, 255), skin=3, hat=None, hands=((360, 470), (420, 380)))
    c.line([(330, 520), (640, 90)], 12, DARK); c.rect(600, 40, 690, 100, (140, 190, 150, 255), r=10)
    c.save('si-painter')


def queue():
    c = Pc(1100, 1000); g = 960
    for i, (x, top, sk, hr) in enumerate([(220, NAVY, 0, 1), (520, OCHRE, 2, 2), (820, TEAL, 3, 0)]):
        person(c, (x, g - 418), f=1, top=top, pants=DARK, skin=sk, hair=hr, skirt=(i == 1), bun=(i == 1), hands=((x - 30, g - 150), (x + 50, g - 160)))
        c.rect(x + 30, g - 170, x + 110, g - 90, BRICK if i != 1 else GREY, r=8)
    c.save('ap-line')


def agent():
    c = Pc(800, 1000); g = 960
    person(c, (300, g - 418), f=1, head=14, top=NAVY, pants=DARK, skin=3, hair=0, bun=True, hands=((390, 520), (430, 515)))
    c.rect(380, 470, 450, 520, (60, 90, 70, 255), w=2)                 # passport
    c.rect(60, 600, 780, g, (200, 196, 186, 255), r=6); c.rect(60, 590, 780, 620, (160, 150, 140, 255))
    c.save('ap-agent')


def suitcase():
    c = Pc(820, 1000); g = 960
    c.rect(40, 640, 230, g - 20, BRICK, r=16); c.circ((70, g - 10), 14, DARK); c.circ((200, g - 10), 14, DARK)
    c.line([(200, 640), (300, 470)], 10, METAL)
    person(c, (440, g - 418), f=1, feet=((380, g), (520, g)), hands=((300, 470), (520, g - 160)), top=OCHRE, pants=NAVY, skin=0, hair=1, skirt=True, bun=True)
    c.save('ap-suitcase')


def lookup():
    c = Pc(520, 1000); g = 960
    person(c, (250, g - 418), f=1, head=-32, top=DARK, pants=GREY, skin=1, hair=0)
    c.save('ap-lookup')


def handler():
    c = Pc(700, 1000); g = 960
    c.rect(330, 500, 520, 640, NAVY, r=14); c.line([(390, 500), (460, 500)], 10, DARK)
    person(c, (220, 560), torso=14, f=1, feet=((160, g), (300, g)), hands=((340, 560), (510, 560)), top=(200, 130, 50, 255), pants=DARK, skin=2, vest=True)
    c.save('ap-handler')


def pour():
    c = Pc(700, 1000); g = 960
    s = person(c, (250, g - 418), f=1, top=DARK, pants=DARK, skin=0, hair=1, skirt=True, bun=True, apron=True, hands=((410, 520), (420, 380)))
    c.poly([(400, 330), (470, 330), (490, 440), (380, 440)], (200, 220, 230, 200), outline=INK)
    c.line([(470, 340), (500, 330)], 8, INK)
    c.rect(395, 480, 445, 560, (210, 230, 240, 180), w=2)
    c.line([(492, 334), (430, 482)], 5, (120, 170, 220, 255))
    c.save('re-pour')


def menus():
    c = Pc(1100, 1000); g = 960
    c.rect(360, 600, 740, 630, WOOD); c.rect(530, 630, 570, g, WOOD, outline=None)
    for x, f, top, sk, hr in [(200, 1, TEAL, 0, 0), (900, -1, BRICK, 2, 1)]:
        c.rect(x - 90 * f - 20, 640, x - 90 * f + 20, g, GREY, outline=None)
        person(c, (x, 640), f=f, torso=4, feet=((x + 180 * f, g - 4), (x + 210 * f, g - 4)), hands=((x + 150 * f, 470), (x + 175 * f, 480)), top=top, pants=DARK, skin=sk, hair=hr, bun=(f < 0))
        c.rect(min(x + 120 * f, x + 200 * f), 380, max(x + 120 * f, x + 200 * f), 520, PAPER, w=2)
    c.save('re-menus')


def chef():
    c = Pc(760, 1000); g = 960
    person(c, (250, g - 418), f=1, top=WHITE, pants=DARK, skin=1, hat='chef', apron=True, hands=((240, g - 150), (420, 470)))
    c.line([(420, 470), (520, 470)], 14, DARK); c.d.ellipse([500 * SS, 440 * SS, 700 * SS, 500 * SS], fill=DARK)
    c.save('re-chef')


def server_plate():
    c = Pc(700, 1000); g = 960
    person(c, (230, g - 418), torso=22, f=1, top=DARK, pants=DARK, skin=3, apron=True, hands=((470, 560), (520, 560)))
    c.d.ellipse([430 * SS, 540 * SS, 600 * SS, 580 * SS], fill=WHITE, outline=GREY, width=4)
    c.save('re-server')


def jacket():
    c = Pc(820, 1000); g = 960
    c.rect(520, 200, 760, g, (190, 210, 220, 255), outline=WOOD, w=12, r=6)
    s = person(c, (300, g - 418), f=1, top=WHITE, pants=DARK, skin=0, hair=1, bun=True, hands=((200, 380), (330, 600)))
    c.poly([(240, 330), (370, 330), (380, 700), (250, 700)], (150, 110, 70, 230), outline=INK)   # jacket on one side
    c.line([(250, 360), (180, 390)], 36, (150, 110, 70, 255))                                    # sleeve on far arm
    c.save('st-jacket')


def cashier():
    c = Pc(1100, 1000); g = 960
    c.rect(80, 560, 600, g, (190, 176, 160, 255), r=6); c.rect(160, 470, 300, 560, DARK, r=6)
    person(c, (380, 480), f=1, top=TEAL, pants=DARK, skin=2, hair=2, hands=((430, 420), (560, 430)))
    person(c, (860, g - 418), f=-1, top=OCHRE, pants=NAVY, skin=0, hair=1, skirt=True, bun=True, hands=((760, 430), (690, 420)))
    c.poly([(560, 380), (700, 380), (720, 540), (550, 540)], (196, 160, 110, 255), outline=INK)
    c.save('st-cashier')


def cart():
    c = Pc(900, 1000); g = 960
    c.poly([(420, 520), (820, 520), (790, 760), (450, 760)], (200, 204, 210, 120), outline=METAL, w=6)
    for x in range(450, 800, 40): c.line([(x, 524), (x + 4, 756)], 3, METAL)
    c.line([(380, 500), (450, 760)], 10, METAL); c.circ((480, g - 20), 20, DARK); c.circ((760, g - 20), 20, DARK)
    c.line([(470, 760), (480, g - 20)], 8, METAL); c.line([(770, 760), (760, g - 20)], 8, METAL)
    person(c, (220, g - 410), torso=12, f=1, feet=((170, g), (290, g)), hands=((380, 500), (390, 505)), top=NAVY, pants=GREY, skin=3, hair=0)
    c.save('st-cart')


def clerk():
    c = Pc(640, 1000); g = 960
    c.rect(300, 90, 470, 220, (196, 160, 110, 255))
    person(c, (240, g - 418), f=1, top=SAGE, pants=DARK, skin=1, hair=2, apron=True, hands=((300, 200), (470, 200)))
    c.save('st-clerk')


def shovel():
    c = Pc(940, 1000); g = 960
    c.d.chord([520 * SS, 820 * SS, 900 * SS, 1100 * SS], 180, 360, fill=(120, 90, 62, 255))
    c.rect(560, 900, 920, g, (100, 74, 50, 255), outline=None)
    c.line([(380, 540), (640, 860)], 12, WOOD); c.poly([(620, 850), (690, 840), (700, 910), (640, 920)], METAL, outline=INK)
    person(c, (240, g - 400), torso=30, f=1, feet=((180, g), (330, g)), hands=((420, 590), (500, 690)), top=SAGE, pants=DARK, skin=2, hair=1)
    c.save('pk-shovel')


def watering():
    c = Pc(860, 1000); g = 960
    c.rect(500, 800, 840, g, (150, 110, 80, 255), r=6)
    for x in (560, 640, 720, 790): c.line([(x, 800), (x - 10, 700)], 10, (90, 140, 80, 255)); c.circ((x - 10, 700), 22, (110, 160, 90, 255))
    person(c, (250, g - 418), f=1, top=OCHRE, pants=NAVY, skin=0, hair=3, bun=True, skirt=True, hands=((240, g - 150), (420, 560)))
    c.rect(400, 540, 500, 620, (90, 140, 150, 255), r=10); c.line([(500, 560), (580, 520)], 10, (90, 140, 150, 255))
    for k in range(4): c.line([(585 + k * 8, 530), (600 + k * 14, 640)], 3, (120, 170, 220, 255))
    c.save('pk-water')


def bench():
    c = Pc(900, 1000); g = 960
    c.rect(150, 640, 800, 670, WOOD); c.rect(150, 520, 800, 548, WOOD)
    for x in (190, 760): c.rect(x - 10, 670, x + 10, g, DARK, outline=None)
    person(c, (380, 640), f=1, torso=-4, feet=((560, g - 4), (590, g - 4)), hands=((470, 470), (500, 480)), top=BRICK, pants=DARK, skin=1, hair=0)
    c.rect(450, 330, 660, 520, PAPER, w=2)
    for y in range(350, 510, 22): c.line([(470, y), (640, y)], 4, (180, 176, 168, 255))
    c.save('pk-bench')


def dog():
    c = Pc(860, 1000); g = 960
    person(c, (250, g - 418), f=1, feet=((190, g), (330, g)), top=TEAL, pants=DARK, skin=3, hair=1, bun=True, hands=((210, g - 150), (380, 560)))
    c.line([(380, 560), (660, 790)], 4, BRICK)
    c.d.ellipse([600 * SS, 800 * SS, 800 * SS, 880 * SS], fill=(150, 110, 70, 255))
    c.circ((800, 800), 40, (150, 110, 70, 255))
    for x in (620, 660, 750, 780): c.line([(x, 860), (x, g)], 14, (150, 110, 70, 255))
    c.line([(600, 830), (560, 800)], 10, (150, 110, 70, 255))
    c.save('pk-dog')


def raker():
    c = Pc(860, 1000); g = 960
    c.line([(390, 500), (700, g - 20)], 10, WOOD); c.line([(640, g - 10), (780, g - 30)], 10, DARK)
    for x in range(650, 780, 18): c.line([(x, g - 12 - (x - 650) * 0.14), (x - 6, g + 4 - (x - 650) * 0.14)], 4, DARK)
    person(c, (250, g - 410), torso=16, f=1, feet=((190, g), (320, g)), hands=((430, 560), (520, 690)), top=BRICK, pants=DARK, skin=2, hair=2)
    c.save('pk-raker')


# ---------------------------------------------------------------- people added in v0.2
def reading_docs():
    c = Pc(520, 1000); g = 960
    s = person(c, (230, g - 418), f=1, head=16, top=WHITE, pants=NAVY, skin=1, hair=0, hands=((330, 395), (360, 388)))
    c.rect(300, 330, 410, 410, PAPER, w=3); c.rect(312, 322, 420, 400, PAPER, w=3)
    for y in range(340, 395, 14): c.line([(326, y), (404, y)], 3, (170, 166, 158, 255))
    c.save('of-reading')


def mug():
    c = Pc(520, 1000); g = 960
    s = person(c, (240, g - 418), f=1, top=OCHRE, pants=DARK, skin=0, hair=3, skirt=True, bun=True, hands=((230, g - 150), (0, 0)))
    hc = s['H']
    c2 = Pc(520, 1000)
    person(c2, (240, g - 418), f=1, top=OCHRE, pants=DARK, skin=0, hair=3, skirt=True, bun=True, hands=((230, g - 150), (hc[0] + 62, hc[1] + 46)))
    c2.rect(hc[0] + 52, hc[1] + 6, hc[0] + 96, hc[1] + 62, (60, 120, 130, 255), w=3, r=6)
    c2.save('of-mug')


def sweeper():
    c = Pc(720, 1000); g = 960
    c.line([(330, 470), (560, 900)], 12, WOOD); c.poly([(500, 900), (640, 880), (650, 945), (500, 960)], (150, 120, 70, 255), outline=INK)
    person(c, (230, g - 412), torso=12, f=1, feet=((180, g), (300, g)), hands=((360, 520), (440, 660)), top=GREY, pants=NAVY, skin=2, hat='hard', vest=True)
    c.save('si-sweep')


def backpack():
    c = Pc(560, 1000); g = 960
    s = person(c, (280, g - 418), f=1, top=SAGE, pants=DARK, skin=0, hair=1, feet=((230, g), (350, g)))
    S = s['S']
    c.rect(S[0] - 150, S[1] + 10, S[0] - 50, S[1] + 230, NAVY, r=22); c.rect(S[0] - 140, S[1] + 120, S[0] - 60, S[1] + 200, shade(NAVY, 0.85), r=12)
    c.line([(S[0] - 60, S[1] + 20), (S[0] + 30, S[1] + 40), (S[0] + 10, S[1] + 210)], 10, shade(NAVY, 0.7))
    c.save('ap-backpack')


def map_reader():
    c = Pc(600, 1000); g = 960
    person(c, (230, g - 418), f=1, head=18, top=BRICK, pants=DARK, skin=3, hair=1, bun=True, hands=((320, 400), (450, 395)))
    c.rect(300, 300, 480, 420, PAPER, w=3)
    for x in (360, 420): c.line([(x, 300), (x, 420)], 2, (180, 176, 168, 255))
    c.line([(310, 400), (360, 340), (420, 370), (470, 320)], 5, (90, 140, 170, 255)); c.circ((420, 370), 9, BRICK)
    c.save('ap-map')


def mopper():
    c = Pc(820, 1000); g = 960
    c.poly([(650, 800), (780, 800), (765, g), (665, g)], (230, 196, 60, 255), outline=INK)            # bucket
    c.line([(340, 470), (520, 920)], 12, METAL)
    for k in range(9): c.line([(470 + k * 12, 915), (462 + k * 13, g)], 8, (170, 166, 156, 255))
    person(c, (230, g - 412), torso=10, f=1, feet=((170, g), (300, g)), hands=((370, 540), (440, 700)), top=(70, 110, 140, 255), pants=DARK, skin=1, hair=2)
    c.save('ap-mop')


def tray():
    c = Pc(600, 1000); g = 960
    s = person(c, (240, g - 418), f=1, top=DARK, pants=DARK, skin=2, hair=0, apron=True, feet=((190, g), (310, g)), hands=((230, g - 150), (400, 250)))
    c.d.ellipse([310 * SS, 228 * SS, 500 * SS, 252 * SS], fill=METAL, outline=INK, width=4)
    for x in (340, 400, 450): c.rect(x, 170, x + 34, 234, (210, 230, 240, 200), w=2)
    c.save('re-tray')


def notepad():
    c = Pc(520, 1000); g = 960
    person(c, (230, g - 418), f=1, head=14, top=WHITE, pants=DARK, skin=0, hair=2, apron=True, hands=((330, 420), (360, 395)))
    c.rect(310, 370, 380, 450, PAPER, w=3); c.line([(350, 400), (395, 360)], 6, NAVY)
    c.save('re-notepad')


def wiper():
    c = Pc(880, 1000); g = 960
    c.rect(400, 600, 840, 632, WOOD); c.rect(440, 632, 460, g, WOOD, outline=None); c.rect(780, 632, 800, g, WOOD, outline=None)
    person(c, (220, g - 410), torso=28, f=1, feet=((160, g), (290, g)), hands=((440, 590), (540, 588)), top=PLUM, pants=DARK, skin=1, hair=1, bun=True, apron=True)
    c.rect(510, 576, 590, 598, (220, 230, 236, 255), w=2, r=6)
    c.save('re-wipe')


def basket_carrier():
    c = Pc(560, 1000); g = 960
    person(c, (250, g - 418), f=1, top=TEAL, pants=DARK, skin=2, hair=1, skirt=True, bun=True, hands=((230, g - 150), (320, 560)))
    c.line([(290, 560), (320, 540), (350, 560)], 8, BRICK)
    c.poly([(270, 580), (380, 580), (370, 680), (280, 680)], BRICK, outline=INK)
    for x in (295, 325, 355): c.line([(x, 590), (x, 672)], 3, shade(BRICK, 0.7))
    c.rect(290, 560, 320, 584, (150, 190, 90, 255), w=2, r=6)
    c.save('st-basket')


def label_reader():
    c = Pc(520, 1000); g = 960
    person(c, (230, g - 418), f=1, head=18, top=NAVY, pants=GREY, skin=3, hair=0, hands=((330, 420), (360, 410)))
    c.rect(318, 340, 392, 430, (220, 140, 60, 255), w=3, r=6); c.rect(326, 368, 384, 404, PAPER, w=2)
    c.save('st-label')


def photographer():
    c = Pc(560, 1000); g = 960
    s = person(c, (230, g - 418), f=1, top=PAPER, pants=NAVY, skin=0, hair=3, hands=((0, 0), (0, 0)))
    hc = s['H']
    c2 = Pc(560, 1000)
    person(c2, (230, g - 418), f=1, top=(196, 206, 214, 255), pants=NAVY, skin=0, hair=3, hands=((hc[0] + 70, hc[1] + 30), (hc[0] + 96, hc[1] + 26)))
    c2.rect(hc[0] + 44, hc[1] - 26, hc[0] + 118, hc[1] + 30, DARK, w=2, r=8); c2.circ((hc[0] + 104, hc[1] + 2), 18, GREY, outline=INK, w=2)
    c2.save('pk-photo')


def jogger():
    c = Pc(640, 1000); g = 960
    person(c, (300, g - 405), torso=10, f=1, feet=((170, g - 40), (420, g)), hands=((230, 470), (430, 430)), top=TEAL, pants=DARK, skin=2, hair=0)
    c.save('pk-jog')


# ---------------------------------------------------------------- objects
def cabinet():
    c = Pc(360, 760)
    c.rect(40, 80, 300, 740, (150, 156, 160, 255), r=6)
    for y in (300, 520): c.rect(60, y, 280, y + 200, (160, 166, 170, 255)); c.rect(140, y + 80, 200, y + 100, DARK, outline=None)
    c.poly([(60, 100), (280, 100), (330, 160), (110, 160)], (176, 182, 186, 255), outline=INK)
    c.rect(110, 160, 330, 290, (166, 172, 176, 255)); c.rect(190, 210, 250, 230, DARK, outline=None)
    for k in range(4): c.rect(130 + k * 44, 120, 160 + k * 44, 165, PAPER, w=2)
    c.save('of-cabinet')


def plant():
    c = Pc(420, 820)
    c.poly([(130, 600), (290, 600), (270, 790), (150, 790)], BRICK, outline=INK)
    for a, l in [(-40, 300), (-15, 420), (10, 380), (35, 320), (-60, 220), (55, 240)]:
        r = math.radians(a); x1, y1 = 210 + l * math.sin(r), 600 - l * math.cos(r)
        c.line([(210, 600), (x1, y1)], 8, (80, 120, 70, 255)); c.d.ellipse([(x1 - 46) * SS, (y1 - 22) * SS, (x1 + 46) * SS, (y1 + 22) * SS], fill=(110, 160, 96, 255))
    c.save('of-plant')


def meeting_table(neat, name):
    c = Pc(1000, 640); g = 610
    c.rect(220, 330, 780, 362, WOOD); c.rect(260, 362, 280, g, WOOD, outline=None); c.rect(720, 362, 740, g, WOOD, outline=None)
    spots = [(150, 0), (850, 0), (380, 0), (620, 0)] if neat else [(80, -18), (900, 14), (440, 26), None]
    for s in spots:
        if s is None: continue
        x, rot = s; r = math.radians(rot)
        seat_y = 420
        c.rect(x - 70, seat_y, x + 70, seat_y + 26, GREY)
        c.line([(x - 55, seat_y + 26), (x - 55 + 20 * math.sin(r), g)], 12, DARK); c.line([(x + 55, seat_y + 26), (x + 55 + 20 * math.sin(r), g)], 12, DARK)
        bx = x + (60 if x < 500 else -60)
        c.line([(bx, seat_y), (bx + 30 * math.sin(r), 260)], 22, GREY)
    c.save(name)


def bricks():
    c = Pc(700, 520)
    c.rect(60, 440, 640, 490, WOOD)
    for row in range(5):
        y = 440 - (row + 1) * 62
        for k in range(4): x = 80 + k * 136 + (68 if row % 2 else 0) * 0; c.rect(x, y, x + 126, y + 56, BRICK, w=3, r=4)
    c.save('si-bricks')


def cones():
    c = Pc(760, 420)
    for x in (130, 380, 630):
        c.poly([(x - 30, 60), (x + 30, 60), (x + 90, 360), (x - 90, 360)], (226, 120, 40, 255), outline=INK)
        c.poly([(x - 48, 160), (x + 48, 160), (x + 60, 220), (x - 60, 220)], WHITE)
        c.rect(x - 120, 360, x + 120, 390, (226, 120, 40, 255))
    c.save('si-cones')


def wall_section(done, name):
    c = Pc(900, 560)
    c.rect(40, 40, 860, 520, (176, 172, 166, 255), r=4)
    c.rect(40, 40, 860 if done else 450, 520, (170, 200, 170, 255), outline=None)
    if not done:
        for y in range(60, 520, 40): c.line([(448, y), (458 + (y % 80) / 8, y + 20)], 8, (170, 200, 170, 255))
    c.rect(40, 40, 860, 520, None, r=4)
    c.save(name)


def seats():
    c = Pc(1000, 520)
    c.rect(40, 300, 960, 330, DARK)
    for k in range(4):
        x = 60 + k * 225
        c.rect(x, 250, x + 200, 300, (70, 110, 150, 255), r=10); c.rect(x + 10, 80, x + 190, 250, (80, 122, 162, 255), r=14)
    for x in (100, 900): c.rect(x - 12, 330, x + 12, 500, DARK, outline=None)
    c.save('ap-seats')


def luggage_cart(loaded, name):
    c = Pc(1000, 640); g = 610
    cx0 = 100 if loaded else 60
    c.rect(cx0, 470, cx0 + 420, 490, METAL); c.line([(cx0 + 420, 480), (cx0 + 470, 200)], 12, METAL)
    c.circ((cx0 + 60, g - 30), 30, DARK); c.circ((cx0 + 360, g - 30), 30, DARK)
    bags = [(NAVY, 180, 150), (BRICK, 140, 120), (OCHRE, 160, 100), (TEAL, 120, 90)]
    if loaded:
        x = cx0 + 20; y = 470
        for col, w, h in bags[:2]: c.rect(x, y - h, x + w, y, col, r=12); x += w + 10
        x = cx0 + 40; y = 470 - 150
        for col, w, h in bags[2:]: c.rect(x, y - h, x + w, y, col, r=12); x += w + 20
    else:
        x = cx0 + 520
        for col, w, h in bags: c.rect(x, g - h - 120, x + w * 0.6, g, col, r=12); x += w * 0.6 + 10
    c.save(name)


def table_set(done, name):
    c = Pc(900, 640); g = 610
    c.rect(200, 340, 700, 370, WHITE); c.rect(230, 370, 670, 420, (230, 226, 216, 255), w=2); c.rect(440, 420, 460, g, WOOD, outline=None)
    for x in (110, 790):
        c.rect(x - 60, 420, x + 60, 446, WOOD); c.line([(x - 50, 446), (x - 50, g)], 12, WOOD); c.line([(x + 50, 446), (x + 50, g)], 12, WOOD)
        bx = x + (-50 if x < 450 else 50); c.line([(bx, 420), (bx, 230)], 20, WOOD)
    if done:
        for x in (330, 570):
            c.d.ellipse([(x - 70) * SS, 318 * SS, (x + 70) * SS, 346 * SS], fill=WHITE, outline=GREY, width=4)
            c.rect(x + 80, 250, x + 110, 336, (210, 230, 240, 200), w=2); c.line([(x - 100, 300), (x - 100, 340)], 6, GREY)
            c.poly([(x - 30, 330), (x + 30, 330), (x + 20, 300), (x - 20, 300)], (200, 120, 100, 255))
    else:
        for k in range(5): c.d.ellipse([380 * SS, (300 - k * 12) * SS, 520 * SS, (330 - k * 12) * SS], fill=WHITE, outline=GREY, width=4)
        for k in range(4): c.line([(540 + k * 8, 336), (600 + k * 8, 300)], 6, GREY)
    c.save(name)


def coat_rack():
    c = Pc(420, 1000); g = 960
    c.line([(210, 80), (210, g - 30)], 20, DARK); c.line([(120, g), (300, g)], 20, DARK)
    for a in (-1, 1): c.line([(210, 120), (210 + 70 * a, 90)], 10, DARK)
    c.poly([(80, 110), (180, 110), (200, 560), (60, 560)], (120, 90, 70, 255), outline=INK)
    c.poly([(240, 110), (340, 110), (360, 500), (230, 500)], (70, 90, 120, 255), outline=INK)
    c.line([(190, 120), (170, 420)], 26, BRICK)
    c.save('re-coats')


def fruit_stand():
    c = Pc(900, 720); g = 690
    c.poly([(80, 400), (820, 400), (780, g), (120, g)], WOOD, outline=INK)
    cols = [(196, 60, 50, 255), (230, 150, 50, 255), (170, 190, 70, 255), (196, 60, 50, 255)]
    for k, col in enumerate(cols):
        x = 110 + k * 180
        c.d.ellipse([x * SS, 300 * SS, (x + 160) * SS, 420 * SS], fill=(190, 150, 90, 255), outline=INK, width=4)
        for j in range(6): c.circ((x + 30 + (j % 3) * 50, 320 - (j // 3) * 36), 26, col)
    c.save('st-fruit')


def clothes_rack():
    c = Pc(820, 900); g = 870
    c.line([(80, 120), (740, 120)], 14, METAL)
    for x in (90, 730): c.line([(x, 120), (x, g)], 14, METAL)
    for k, col in enumerate([NAVY, BRICK, SAGE, OCHRE, PLUM, TEAL]):
        x = 150 + k * 95
        c.line([(x, 120), (x, 150)], 4, DARK); c.poly([(x - 50, 150), (x + 50, 150), (x + 45, 470), (x - 45, 470)], col, outline=INK)
    c.save('st-rack')


def shelf(full, name):
    c = Pc(900, 960); g = 930
    c.rect(150, 80, 750, g, None, outline=WOOD, w=16)
    for y in (300, 520, 740): c.line([(150, y), (750, y)], 14, WOOD)
    boxes = [(170, 300), (330, 300), (490, 300), (170, 520), (330, 520), (490, 520)]
    if full:
        for x, y in boxes: c.rect(x, y - 150, x + 140, y - 8, (196, 160, 110, 255))
        for x in (170, 330, 490): c.rect(x, 740 - 150, x + 140, 732, (196, 160, 110, 255))
    else:
        c.rect(170, 740 - 150, 310, 732, (196, 160, 110, 255))
        for k, (x, y) in enumerate([(60, g), (210, g), (360, g), (140, g - 150)]): c.rect(x, y - 150, x + 140, y, (196, 160, 110, 255))
    c.save(name)


def bike_lamp():
    c = Pc(820, 1100); g = 1070
    c.line([(640, 120), (640, g - 20)], 22, DARK); c.rect(580, g - 30, 700, g, DARK); c.rect(600, 60, 680, 140, (240, 220, 160, 255), r=10)
    for x in (180, 500): c.circ((x, g - 110), 105, None, outline=DARK, w=10); c.circ((x, g - 110), 10, DARK)
    c.line([(180, g - 110), (300, g - 300), (470, g - 300), (500, g - 110)], 12, BRICK); c.line([(300, g - 300), (330, g - 110), (180, g - 110)], 12, BRICK)
    c.line([(330, g - 110), (470, g - 300)], 12, BRICK); c.line([(470, g - 300), (450, g - 360), (420, g - 380)], 10, DARK)
    c.rect(270, g - 330, 340, g - 310, DARK, r=6)
    c.save('pk-bike')


def leaves(piled, name):
    c = Pc(900, 440); g = 420
    c.d.ellipse([20 * SS, 260 * SS, 880 * SS, 430 * SS], fill=(150, 176, 110, 255))
    import random
    rnd = random.Random(3); cols = [(206, 120, 50, 255), (220, 170, 60, 255), (180, 80, 50, 255)]
    if piled:
        c.d.chord([300 * SS, 160 * SS, 640 * SS, 460 * SS], 180, 360, fill=(200, 130, 56, 255))
        for k in range(60):
            x, y = rnd.uniform(320, 620), rnd.uniform(200, 320)
            if (x - 470) ** 2 / 150 ** 2 + (y - 310) ** 2 / 140 ** 2 < 1: c.circ((x, y), 12, cols[k % 3])
    else:
        for k in range(70): c.circ((rnd.uniform(80, 820), rnd.uniform(290, 400)), 12, cols[k % 3])
    c.save(name)


# ---------------------------------------------------------------- objects added in v0.2
def boxes():
    c = Pc(620, 560); g = 540
    BOX = (196, 160, 110, 255)
    for x0, y1, w, h in [(40, g, 260, 200), (310, g, 260, 200), (160, g - 200, 280, 190)]:
        c.rect(x0, y1 - h, x0 + w, y1, BOX); c.line([(x0 + w / 2, y1 - h), (x0 + w / 2, y1 - h + 60)], 10, (230, 210, 170, 255))
    c.save('of-boxes')


def pipes():
    c = Pc(780, 360); g = 340
    # five pipes lying on the ground, seen at an angle: three below, two on top; the round ends face the reader
    spots = [(40, g), (150, g), (260, g), (95, g - 92), (205, g - 92)]
    for k, (x, y) in enumerate(spots):
        col = (214, 214, 206, 255) if k < 3 else (196, 120, 70, 255)
        c.poly([(x + 50, y - 100), (x + 50 + 420, y - 100 - 70), (x + 50 + 420, y - 70), (x + 50, y)], col, outline=INK, w=3)
        c.circ((x + 50, y - 50), 50, col, outline=INK, w=3); c.circ((x + 50, y - 50), 30, shade(DARK, 0.9))
    c.save('si-pipes')


def stacked_chairs():
    c = Pc(460, 980); g = 960
    WD = (176, 120, 80, 255)
    for x in (96, 314): c.line([(x, 628), (x, g)], 14, shade(WD, 0.7))
    for k in range(5):
        dy, dx = k * 62, k * 10
        for x in (96 + dx, 314 + dx): c.line([(x, 628 - dy), (x, 660 - dy)], 12, shade(WD, 0.7))
        c.rect(80 + dx, 600 - dy, 330 + dx, 628 - dy, WD)
        c.line([(310 + dx, 600 - dy), (330 + dx, 360 - dy)], 16, WD); c.line([(316 + dx, 470 - dy), (328 + dx, 470 - dy)], 10, WD)
    c.save('re-chairs')


def mannequin():
    c = Pc(380, 1000); g = 960
    c.line([(190, 760), (190, g - 20)], 14, DARK); c.d.ellipse([110 * SS, (g - 40) * SS, 270 * SS, g * SS], fill=DARK)
    c.circ((190, 120), 34, (226, 214, 196, 255), outline=INK, w=2); c.line([(190, 150), (190, 190)], 20, (226, 214, 196, 255))
    c.poly([(130, 200), (250, 200), (260, 330), (330, 760), (50, 760), (120, 330)], (60, 110, 120, 255), outline=INK)
    c.line([(120, 330), (260, 330)], 10, shade((60, 110, 120, 255), 0.7))
    c.save('st-dress')


def shoe_shelf():
    c = Pc(780, 580); g = 560
    c.rect(40, 120, 740, g, None, outline=WOOD, w=14)
    for y in (300, g - 14): c.line([(40, y), (740, y)], 12, WOOD)
    cols = [BRICK, NAVY, OCHRE, DARK]
    for row, y in enumerate((294, g - 20)):
        for k in range(4):
            x = 80 + k * 165; col = cols[(k + row) % 4]
            for dx in (0, 62): c.poly([(x + dx, y), (x + dx + 56, y), (x + dx + 56, y - 30), (x + dx + 20, y - 60), (x + dx, y - 60)], col, outline=INK, w=2)
    c.save('st-shoes')


def blanket():
    c = Pc(820, 320); g = 300
    c.d.ellipse([10 * SS, 100 * SS, 810 * SS, 310 * SS], fill=(150, 176, 110, 255))
    c.poly([(150, 140), (690, 140), (760, 270), (80, 270)], (230, 226, 216, 255), outline=INK)
    for k in range(1, 6):
        t = k / 6
        c.line([(150 + 540 * t - 70 * t * 0, 140), (80 + 680 * t, 270)], 8, BRICK)
        y = 140 + 130 * t; c.line([(150 - 70 * t, y), (690 + 70 * t, y)], 8, BRICK)
    c.rect(560, 60, 700, 170, (180, 130, 70, 255), r=10); c.line([(580, 60), (630, 20), (680, 60)], 8, (140, 96, 50, 255))
    c.save('pk-blanket')


# ---------------------------------------------------------------- backdrops
def office_wall():
    c = Pc(1500, 500)
    c.rect(20, 20, 1480, 480, (226, 222, 214, 255), r=4)
    c.rect(80, 70, 560, 420, (180, 206, 222, 255)); [c.line([(80, y), (560, y)], 6, (200, 200, 196, 255)) for y in range(70, 240, 22)]
    c.rect(680, 90, 1180, 380, WHITE, w=6)
    for k, h in enumerate([120, 180, 90, 220, 150]): c.rect(740 + k * 85, 340 - h, 800 + k * 85, 340, [TEAL, OCHRE, BRICK, NAVY, SAGE][k], outline=None)
    c.circ((1340, 150), 70, WHITE, outline=INK, w=6); c.line([(1340, 150), (1340, 100)], 6, INK); c.line([(1340, 150), (1380, 150)], 6, INK)
    c.rect(1240, 300, 1450, 470, WOOD); [c.rect(1260 + k * 38, 320, 1290 + k * 38, 460, [NAVY, BRICK, TEAL, OCHRE, GREY][k], outline=None) for k in range(5)]
    c.save('of-wall')


def site_wall():
    c = Pc(1500, 500)
    c.rect(100, 60, 1400, 480, (190, 186, 178, 255))
    for x in range(160, 1400, 300): c.rect(x, 110, x + 160, 250, (90, 96, 104, 255)); c.rect(x, 300, x + 160, 440, (90, 96, 104, 255))
    for x in range(60, 1460, 140): c.line([(x, 20), (x, 480)], 8, METAL)
    for y in (90, 270, 460): c.line([(40, y), (1460, y)], 10, METAL); c.rect(40, y - 18, 1460, y - 4, WOOD, outline=None)
    c.save('si-wall')


def airport_wall():
    c = Pc(1500, 500)
    c.rect(20, 20, 1480, 480, (214, 218, 222, 255))
    for x in range(40, 1480, 180): c.rect(x, 120, x + 170, 470, (188, 210, 226, 255))
    c.poly([(300, 360), (900, 330), (980, 350), (900, 380), (320, 390)], WHITE, outline=INK); c.poly([(560, 350), (640, 260), (680, 260), (640, 350)], WHITE, outline=INK)
    c.rect(1000, 30, 1440, 160, DARK, r=6)
    for r in range(5): c.rect(1020, 44 + r * 22, 1200, 56 + r * 22, [TEAL, OCHRE, WHITE, TEAL, BRICK][r], outline=None); c.rect(1220, 44 + r * 22, 1420, 56 + r * 22, GREY, outline=None)
    c.save('ap-wall')


def restaurant_wall():
    c = Pc(1500, 500)
    c.rect(20, 20, 1480, 480, (200, 176, 150, 255))
    c.rect(500, 120, 1300, 360, (120, 100, 84, 255)); c.rect(480, 340, 1320, 380, WOOD)
    for y in (180, 260): c.line([(520, y), (1280, y)], 8, WOOD)
    for x in range(540, 1280, 60): c.d.ellipse([x * SS, 140 * SS, (x + 40) * SS, 176 * SS], fill=WHITE)
    for x in (300, 1400): c.line([(x, 20), (x, 140)], 4, DARK); c.d.chord([(x - 50) * SS, 120 * SS, (x + 50) * SS, 200 * SS], 180, 360, fill=OCHRE)
    c.rect(80, 160, 260, 300, (140, 170, 160, 255), w=8)
    c.save('re-wall')


def store_wall():
    c = Pc(1500, 500)
    c.rect(20, 20, 1480, 480, (222, 214, 196, 255))
    for y in (160, 300, 440): c.line([(60, y), (1000, y)], 10, WOOD)
    import random
    rnd = random.Random(5)
    for y in (160, 300, 440):
        x = 70
        while x < 980:
            w, h = rnd.randint(40, 80), rnd.randint(60, 110); c.rect(x, y - h, x + w, y - 6, [TEAL, OCHRE, BRICK, SAGE, NAVY, PLUM][rnd.randint(0, 5)], w=2, r=4); x += w + 10
    c.rect(1100, 80, 1420, 340, (188, 210, 226, 255), w=6)
    c.save('st-wall')


def park_wall():
    c = Pc(1600, 420)
    c.rect(0, 120, 1600, 200, (196, 192, 186, 255), outline=None)
    for x in range(40, 1600, 150):
        c.line([(x, 410), (x, 260)], 22, (110, 84, 60, 255)); c.circ((x, 210), 95, (100, 140, 90, 255)); c.circ((x + 50, 240), 70, (120, 160, 100, 255))
    c.line([(0, 330), (1600, 330)], 6, DARK)
    for x in range(10, 1600, 30): c.line([(x, 330), (x, 410)], 5, DARK)
    c.save('pk-wall')


# ---------------------------------------------------------------- UI cards and cover
def ui_cards():
    serif = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
    brush = os.path.join(HERE, '..', '..', '..', 'vendor', 'fonts', 'wt071.ttf')
    for L, col in zip('abcd', [NAVY, TEAL, OCHRE, BRICK]):
        im = Image.new('RGBA', (300, 340), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        d.rounded_rectangle([10, 10, 290, 330], 26, fill=(246, 240, 226, 255), outline=col, width=10)
        d.text((150, 170), L.upper(), font=ImageFont.truetype(serif, 190), fill=col, anchor='mm')
        os.makedirs(OUT, exist_ok=True); im.save(f'{OUT}/ui-{L}.png')
    im = Image.new('RGBA', (520, 420), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rectangle([250, 250, 270, 410], fill=(110, 84, 60, 255))
    d.rounded_rectangle([10, 10, 510, 270], 24, fill=(176, 76, 58, 255), outline=(120, 40, 30, 255), width=8)
    d.text((260, 112), '考我', font=ImageFont.truetype(brush, 120), fill=(250, 240, 220, 255), anchor='mm')
    d.text((260, 216), 'Test me', font=ImageFont.truetype(serif, 60), fill=(250, 240, 220, 255), anchor='mm')
    im.save(f'{OUT}/ui-quiz.png')


def cover():
    im = Image.new('RGB', (1024, 1536), (58, 72, 86)); d = ImageDraw.Draw(im)
    import random
    rnd = random.Random(7)
    for k in range(40):
        x, w = rnd.randint(-40, 1000), rnd.randint(80, 220); h = rnd.randint(200, 700)
        col = rnd.choice([(70, 88, 104), (84, 104, 120), (96, 120, 130), (64, 80, 96)])
        d.rectangle([x, 1536 - h, x + w, 1536], fill=col)
        for y in range(1536 - h + 30, 1536, 50):
            for xx in range(x + 16, x + w - 20, 40): d.rectangle([xx, y, xx + 18, y + 26], fill=(214, 190, 120) if rnd.random() < 0.3 else (90, 110, 126))
    d.ellipse([700, 120, 860, 280], fill=(236, 214, 160))
    im.save(f'{OUT}/cover.png')


if __name__ == '__main__':
    for fn in [typing, copier, phone, pointing, chair_carrier, ladder_climber, helmet, boards, barrow, painter, queue, agent, suitcase, lookup,
               handler, pour, menus, chef, server_plate, jacket, cashier, cart, clerk, shovel, watering, bench, dog, raker,
               cabinet, plant, bricks, cones, seats, coat_rack, fruit_stand, clothes_rack, bike_lamp,
               reading_docs, mug, sweeper, backpack, map_reader, mopper, tray, notepad, wiper, basket_carrier, label_reader, photographer, jogger,
               boxes, pipes, stacked_chairs, mannequin, shoe_shelf, blanket,
               office_wall, site_wall, airport_wall, restaurant_wall, store_wall, park_wall, ui_cards, cover]:
        fn()
    meeting_table(True, 'of-table-after'); meeting_table(False, 'of-table-before')
    wall_section(False, 'si-wall-before'); wall_section(True, 'si-wall-after')
    luggage_cart(True, 'ap-cart-after'); luggage_cart(False, 'ap-cart-before')
    table_set(True, 're-table-after'); table_set(False, 're-table-before')
    shelf(False, 'st-shelf-before'); shelf(True, 'st-shelf-after')
    leaves(False, 'pk-leaves-before'); leaves(True, 'pk-leaves-after')
    print(len(os.listdir(OUT)), 'images in', os.path.abspath(OUT))
