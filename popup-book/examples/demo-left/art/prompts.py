"""Prompt pack for the left-bound test book — a template for physics books (the test book itself uses
code-drawn placeholders; run this and hand the .md to Codex to get real art)."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'tools'))
from prompts import Pack, SINGLE, OBJ, SHEET

STYLE = ("Scientific illustration in the manner of a 19th-century physics textbook (Ganot's 'Elements of Physics'): fine steel-engraving "
         "line work with cross-hatching, lightly hand-coloured in faded watercolour washes (brass, mahogany, porcelain white, muted red and "
         "slate blue) on warm off-white paper tone. Precise, restrained, instructive; not glossy, not 3D-rendered, no cartoon outlines.")
APPARATUS = ("Laboratory apparatus as it really looks and works: correct proportions, visible terminals, screws and wires; no invented parts.")

pack = Pack(title='電流與電阻', batch='demo-art-1', style=STYLE, anchor='01-battery')
pack.add('01-battery', '電池（風格基準，先生成）', '1024x1536',
         "Subject: a single large dry-cell battery standing upright, cylindrical zinc can with a paper wrapper, brass positive cap on top and a terminal screw.",
         [APPARATUS, SINGLE], section='歐姆定律')
pack.add('02-resistor', '電阻（大）', '1536x1024',
         "Subject: a large ceramic carbon resistor lying horizontally, colour bands painted around its body, straight wire leads to both sides.",
         [APPARATUS, SINGLE], section='歐姆定律')
pack.add('03-lamp', '小燈泡與燈座', '1024x1536',
         "Subject: a small incandescent bulb in a brass screw socket on a little wooden base, the filament visible inside the clear glass.",
         [APPARATUS, SINGLE], section='歐姆定律')
pack.add('04-people', '學生們', '1536x1024',
         "Subject: five separate students in plain present-day clothes, full body, three-quarter front view: one pointing, one writing in a notebook, "
         "one holding a multimeter probe, one leaning in to look, one with arms crossed thinking.",
         [SHEET], section='人物')
pack.reject('a wire, terminal or part is invented or physically impossible')
pack.write(os.path.dirname(os.path.abspath(__file__)))
