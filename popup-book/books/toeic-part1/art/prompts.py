"""Prompt packs for 多益 Part 1 看圖練習 (TOEIC Listening Part 1, Photographs).
toeic-art-1: six scenes from ETS's list of test settings; per scene: a back-wall elevation, a sheet of people caught
mid-action, and a sheet of objects (including the before / after states the book swaps between).
toeic-art-2: one more sheet per scene with the people and objects added in v0.2 (8–9 things per scene)."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'tools'))
from prompts import Pack, SINGLE, OBJ, SHEET, STRIP

STYLE = ("Contemporary editorial illustration for an English-learning pop-up book: clean ink outlines of even weight, flat gouache colour "
         "with a subtle paper texture, a muted palette of warm greys, navy, teal, ochre and soft brick red on off-white. Realistic adult "
         "proportions and believable present-day settings. Every action must be instantly readable: hands clearly holding or touching the "
         "object they act on, heads and eyes turned to what the person is doing. Not cartoonish, not anime, not 3D-rendered, no glossy highlights.")
PEOPLE = ("People: modern adults of different ages and ethnicities in clothes that suit the setting; each one caught in the middle of one "
          "clear action; full body visible including the feet; all figures on this sheet drawn at the same scale.")
SCREENS = ("Any screen, board, sign, label, menu or display shows only plain coloured shapes or bars, never letters, numbers or logos.")
BACKDROP = ("Presentation: a wide back-wall elevation for a die-cut pop-up book scene, straight-on front view, no perspective, no floor, "
            "no people, no cast shadow, even neutral daylight, plain pure white background around it; nothing touches the image edges.")

pack = Pack(title='多益 Part 1 看圖練習', batch='toeic-art-1', style=STYLE, anchor='01-office-people')
S = lambda fid, title, size, body, blocks, sec: pack.add(fid, title, size, body, blocks + [SCREENS], section=sec)

# ---------------- 1. Offices ----------------
sec = '1 辦公室 Offices'
S('01-office-people', '辦公室的人（風格基準，先生成）', '1536x1024',
  "Subject: five separate office scenes on one sheet: "
  "(1) a woman sitting at a desk typing on a computer keyboard, desk, chair and monitor drawn together with her as one piece; "
  "(2) a man standing at a large photocopier pressing a button on its panel, a few printed sheets coming out of the tray, drawn together as one piece; "
  "(3) a man standing and talking on a mobile phone held to his ear; "
  "(4) a woman standing in side view with one arm stretched out to her side, pointing at something next to her; "
  "(5) a man in shirt sleeves carrying a single office chair in both hands, walking.", [PEOPLE, SHEET], sec)
S('02-office-wall', '辦公室後牆', '1536x1024',
  "Subject: the back wall of an open-plan office: a large window with blinds half drawn, a wall-mounted whiteboard showing a simple bar chart "
  "made of coloured bars only, a round wall clock with plain tick marks and no numerals, and a low bookshelf with binders.", [BACKDROP], sec)
S('03-office-things', '辦公室物品（含之前／之後）', '1536x1024',
  "Subject: four separate objects: (1) a grey metal filing cabinet with its top drawer pulled open; (2) a tall potted plant; "
  "(3) a small meeting table with four chairs pushed neatly in around it; "
  "(4) the same meeting table with the four chairs scattered and pulled out at odd angles, one chair missing.", [SHEET], sec)

# ---------------- 2. Housing / construction ----------------
sec = '2 工地 Construction site'
S('04-site-people', '工地的人', '1536x1024',
  "Subject: five separate construction workers in high-visibility vests and work boots: "
  "(1) a worker wearing a hard hat climbing a straight ladder, the ladder drawn with him as one piece, seen from the front; "
  "(2) a worker in the act of putting a hard hat on his head with both hands; "
  "(3) a worker wearing a hard hat carrying several long wooden boards on his shoulder; "
  "(4) a worker pushing a wheelbarrow full of sand; "
  "(5) a painter holding a paint roller on a long pole, reaching up as if painting a wall to his side.", [PEOPLE, SHEET], sec)
S('05-site-wall', '工地背景：施工中的建築', '1536x1024',
  "Subject: the front elevation of a two-storey building under construction: concrete frame, some window openings without glass, "
  "metal scaffolding with planks along the front.", [BACKDROP], sec)
S('06-site-things', '工地物品（含之前／之後）', '1536x1024',
  "Subject: four separate objects: (1) a neat stack of red bricks on a wooden pallet; (2) three orange traffic cones standing in a row; "
  "(3) a rectangular section of plain wall, only its left half freshly painted pale green and the right half bare grey plaster; "
  "(4) the same rectangular wall section completely painted pale green.", [SHEET], sec)

# ---------------- 3. Travel ----------------
sec = '3 機場 Airport'
S('07-airport-people', '機場的人', '1536x1024',
  "Subject: five separate subjects: (1) three travellers standing in a line one behind another, seen from the side, all facing right, "
  "holding bags, drawn together as one piece; (2) an airline agent standing behind a check-in counter, examining a passport in her hands, "
  "counter included; (3) a woman walking while pulling a wheeled suitcase behind her; "
  "(4) a man standing with his head tilted up, looking up at something above him; "
  "(5) a baggage handler in a uniform lifting a suitcase with both hands.", [PEOPLE, SHEET], sec)
S('08-airport-wall', '機場背景：航廈', '1536x1024',
  "Subject: the back wall of an airport departure hall: tall glass windows with an airliner parked outside, and a large hanging "
  "flight-information display showing only rows of coloured bars.", [BACKDROP], sec)
S('09-airport-things', '機場物品（含之前／之後）', '1536x1024',
  "Subject: three separate objects: (1) a row of four empty connected waiting-area seats; "
  "(2) a luggage trolley with four suitcases loaded neatly on it; "
  "(3) an empty luggage trolley with four suitcases standing on the floor beside it.", [SHEET], sec)

# ---------------- 4. Dining out ----------------
sec = '4 餐廳 Restaurant'
S('10-restaurant-people', '餐廳的人', '1536x1024',
  "Subject: four separate subjects: (1) a server standing and pouring water from a glass pitcher into a drinking glass held in her other hand; "
  "(2) two diners sitting at a small table, each reading a menu held open in their hands, table and chairs drawn with them as one piece; "
  "(3) a chef in a white jacket and apron holding a frying pan; "
  "(4) a server leaning forward, placing a plate with both hands as if on a table in front of him.", [PEOPLE, SHEET], sec)
S('11-restaurant-wall', '餐廳後牆', '1536x1024',
  "Subject: the back wall of a small restaurant: an open-kitchen pass with a counter and shelves of plates and glasses, two pendant lamps, "
  "a framed picture showing only a simple landscape.", [BACKDROP], sec)
S('12-restaurant-things', '餐廳物品（含之前／之後）', '1536x1024',
  "Subject: three separate objects: (1) a table fully set for two, with plates, glasses, cutlery and folded napkins, two chairs, nobody at it; "
  "(2) the same bare table with only a stack of plates and a bundle of cutlery piled in the middle, two chairs; "
  "(3) a free-standing coat rack with two coats and a scarf hanging on it.", [SHEET], sec)

# ---------------- 5. Purchasing ----------------
sec = '5 商店 Store'
S('13-store-people', '商店的人', '1536x1024',
  "Subject: four separate subjects: (1) a woman putting one arm into the sleeve of a jacket she is trying on, standing beside a tall mirror, "
  "mirror included; (2) a cashier behind a counter with a till, handing a paper shopping bag to a customer, both people and the counter as one piece; "
  "(3) a man pushing a shopping cart; (4) a store clerk lifting a cardboard box with both hands as if putting it onto a high shelf beside him.", [PEOPLE, SHEET], sec)
S('14-store-wall', '商店後牆', '1536x1024',
  "Subject: the back wall of a small general store: wall shelves with jars and packages whose labels are plain colour blocks, a window, a wall lamp.", [BACKDROP], sec)
S('15-store-things', '商店物品（含之前／之後）', '1536x1024',
  "Subject: four separate objects: (1) a fruit stand with several wicker baskets of apples, oranges and pears; "
  "(2) a clothing rack with shirts hanging on hangers; "
  "(3) a freestanding shelf unit, mostly empty, with cardboard boxes stacked on the floor in front of it; "
  "(4) the same shelf unit fully stocked with the boxes on its shelves.", [SHEET], sec)

# ---------------- 6. Outdoors ----------------
sec = '6 公園 Park'
S('16-park-people', '公園的人', '1536x1024',
  "Subject: five separate subjects: (1) a man shoveling soil from a pile into a flower bed, shovel in both hands, pile and bed included; "
  "(2) a woman watering plants in a planter with a watering can, planter included; "
  "(3) a man sitting on a park bench reading a newspaper, bench included; "
  "(4) a woman walking a dog on a leash; (5) a gardener raking leaves with a garden rake.", [PEOPLE, SHEET], sec)
S('17-park-wall', '公園背景', '1536x1024',
  "Subject: a long park backdrop strip: a row of leafy trees and bushes behind a low iron fence, with a building rooftop line far behind.", [STRIP], sec)
S('18-park-things', '公園物品（含之前／之後）', '1536x1024',
  "Subject: three separate objects: (1) a bicycle parked upright next to a street lamppost, nobody near it, lamppost included; "
  "(2) a patch of lawn with fallen autumn leaves scattered across it; "
  "(3) the same patch of lawn with the leaves raked into one neat pile.", [SHEET], sec)

# ---------------- cover ----------------
pack.add('19-cover', '封面', '1024x1536',
         "Subject: a portrait book-cover illustration: a collage of everyday scenes stacked like a pop-up city — an office window, an airliner, "
         "a café table, a market stall, a crane over a building site and park trees — with small figures going about their work; "
         "leave a calm empty band across the upper third for the title, which the book adds itself.",
         ["Presentation: a full-bleed portrait illustration that fills the whole image; this one may touch the edges.", SCREENS],
         section='封面', transparent=False, bleed=True)

pack.reject('a person\'s hands are not on the object of their action, or the action could be read two ways')
pack.reject('a screen, board, sign, label or menu shows letters, numbers or a logo')
pack.reject('in the before / after pairs (03, 06, 09, 12, 15, 18) the two states are not clearly the same object, or the difference is hard to see')
pack.write(os.path.dirname(os.path.abspath(__file__)))


# ======================= toeic-art-2: the people and objects added in v0.2 =======================
pack2 = Pack(title='多益 Part 1 看圖練習（補充）', batch='toeic-art-2', style=STYLE, anchor='01-office-people', anchor_dir='toeic-art-1')
MIXED = ("People and objects share this sheet: draw the people at the same scale as in the reference image, full body including the feet, "
         "and the objects at their real size next to them.")
T = lambda fid, title, body: pack2.add(fid, title, '1536x1024', body, [PEOPLE, MIXED, SHEET, SCREENS], section='補充 More people and things')
T('20-office-more', '辦公室：再加三樣',
  "Subject: three separate subjects: (1) a man in a white shirt standing and reading a few printed documents held in both hands in front of his chest, head bowed toward them; "
  "(2) a woman standing and drinking from a mug held to her lips; "
  "(3) three cardboard boxes stacked on their own, two side by side on the bottom and one on top.")
T('21-site-more', '工地：再加兩樣',
  "Subject: two separate subjects: (1) a construction worker in a hard hat and high-visibility vest sweeping the ground with a wide push broom held in both hands; "
  "(2) five long plastic pipes lying stacked on their own, three underneath and two on top, seen from a three-quarter angle so their round open ends are visible.")
T('22-airport-more', '機場：再加三樣',
  "Subject: three separate subjects: (1) a man standing in side view wearing a backpack on his back, both straps over his shoulders, hands at his sides; "
  "(2) a woman standing and holding a large unfolded paper map open in both hands, looking down at it, the map showing only coloured lines and shapes; "
  "(3) an airport cleaner in a uniform mopping the floor with a mop held in both hands, a yellow wheeled mop bucket beside him, drawn together as one piece.")
T('23-restaurant-more', '餐廳：再加四樣',
  "Subject: four separate subjects: (1) a waiter walking while carrying a round tray with three drinks on it, the tray held up on one hand at shoulder height; "
  "(2) a waiter in an apron standing and writing on a small notepad with a pen; "
  "(3) a server leaning over a small café table and wiping it with a cloth, the table drawn together with her as one piece; "
  "(4) five wooden café chairs stacked on top of one another, standing on their own.")
T('24-store-more', '商店：再加四樣',
  "Subject: four separate subjects: (1) a woman walking and carrying a plastic shopping basket on her arm with a few groceries inside; "
  "(2) a man standing and reading the label on a jar held close in one hand, the label showing only coloured blocks; "
  "(3) a dress form on a stand displaying a dress, with no head and no face; "
  "(4) a low shelf unit with two shelves holding pairs of shoes lined up neatly in a row.")
T('25-park-more', '公園：再加三樣',
  "Subject: three separate subjects: (1) a woman standing and taking a photograph with a camera held up to her eye in both hands; "
  "(2) a man jogging in sportswear, mid-stride, one foot off the ground; "
  "(3) a checked picnic blanket spread out flat on a small oval patch of grass, a wicker picnic basket on one corner, nobody on it.")
pack2.reject('a person\'s hands are not on the object of their action, or the action could be read two ways')
pack2.reject('the people are drawn at a clearly different scale or in a different style from the reference image')
pack2.reject('a screen, board, sign, label or map shows letters, numbers or a logo')
pack2.write(os.path.dirname(os.path.abspath(__file__)))
