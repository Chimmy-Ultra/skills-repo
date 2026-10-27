import json
STYLE = ("Northern Song dynasty Bianjing (Kaifeng), early 12th century, early spring around the Qingming festival. "
 "Painted in the manner of Zhang Zeduan's original 'Along the River During the Qingming Festival' (Palace Museum, Beijing), NOT the Qing court version (Qingyuan ben). "
 "Fine ruled-line ink drawing (jiehua) with light, faded colours on a warm silk tone: mostly ink line and pale ochre / earth tones, sparing soft blue-green (azurite, malachite) and muted red-ochre. "
 "Delicate, documentary and restrained; not saturated, not glossy, no heavy black outlines.")
ARCH = ("Song architecture as described in the Yingzao Fashi (1103): gently pitched roofs with deep overhanging eaves; the eave line rises slightly toward the corners; "
 "short columns carrying large, widely spaced bracket sets (dougong) on important buildings; plain grey tile roofs; Song fish-tail ridge ornaments (chiwei) only on important buildings, ordinary buildings have plain ridges; "
 "red-ochre or natural-wood columns; vertical-bar windows (pozi lingchuang) and simple lattice doors; wooden railings (goulan). "
 "Avoid Ming and Qing features: no white marble terraces or balustrades, no Qing dragon-head ridge beasts, no dense Qing painted decoration (hexi or xuanzi caihua), no round-arched brick gate tunnels, no brick crenellated battlements; no Japanese machiya look, no fantasy game-asset look.")
PEOPLE = ("Figures and clothing accurate to Northern Song townspeople as painted by Zhang Zeduan: men in cloth headwraps or futou caps, short jackets and trousers for workers, long round-collared robes for scholars and officials; "
 "women in beizi jackets over long skirts with hair in high buns. Natural proportions, lively but small gestures.")
SINGLE = ("Presentation: one isolated subject for a die-cut pop-up book. Flat front elevation, straight-on orthographic view, no perspective, no ground plane, no cast shadow, no background scenery, even neutral daylight. "
 "Centred on a plain pure white background, with a generous empty margin all around; nothing touches the image edges.")
OBJ = ("Presentation: one isolated subject for a die-cut pop-up book, drawn at the viewing angle stated in the subject description. No ground plane, no cast shadow, no background scenery, even neutral daylight. "
 "Centred on a plain pure white background, with a generous empty margin all around; nothing touches the image edges.")
SHEET = ("Presentation: a sheet of separate subjects for a die-cut pop-up book, arranged in a loose grid with clear empty space between them; no subject overlaps another and each is fully visible. "
 "No ground plane, no cast shadows, no background scenery, even neutral daylight, plain pure white background, nothing touching the image edges.")
STRIP = ("Presentation: a long horizontal strip for a die-cut pop-up book, front elevation, no perspective, no cast shadow, no background scenery, even neutral daylight, plain pure white background above and below the strip. "
 "The strip runs the full width of the image and may touch the left and right edges.")
NOTEXT = "Absolutely no writing anywhere: no Chinese characters, letters, numbers, seals, signatures, watermarks or frames. Every signboard, plaque and banner is blank."

E = []
def add(fid, title, size, body, blocks, transparent=True, ref=True):
    E.append({'file': f'{fid}.png', 'title': title, 'size': size, 'transparent_background': transparent, 'use_style_reference': ref,
              'prompt': ' '.join([STYLE] + blocks + [body, NOTEXT])})

# ---------- spread 1: 城門晨開 ----------
add('01-zhuque-gate', '朱雀門（風格基準，先生成）', '1536x1024',
 "Subject: Zhuque Gate, the main south gate of Bianjing's inner city, modelled on the city gate in Zhang Zeduan's scroll. "
 "A tall, wide gate platform with sloping (battered) sides of rammed earth: plain warm loess surface with faint horizontal tamping layers and a timber-edged top. "
 "Through its centre runs ONE trapezoid-shaped gate passage (wide at the bottom, sloped sides, flat top) lined on both sides with closely spaced vertical timber posts (paicha zhu) that carry a timber lintel. "
 "The passage is open and empty, and its interior is filled with solid flat black (the doors are drawn separately). "
 "On top of the platform: a timber balcony platform (pingzuo) with a wooden railing all round, and a five-bay gate tower hall with red-ochre columns, vertical-bar windows, large bracket sets and a single-eave hip roof (wudian) of grey tiles with gentle curves and fish-tail ridge ornaments; a blank horizontal name plaque under the eaves.",
 [ARCH, SINGLE], ref=False)
add('02-zhuque-doors', '朱雀門門板（兩扇，關著）', '1024x1024',
 "Subject: the pair of closed timber gate doors for the Zhuque Gate passage, flat front view: two tall plank doors (banmen) side by side forming a rectangle a little taller than wide, "
 "dark red-ochre lacquer worn with age, horizontal rows of round iron door studs, iron hinge straps and a pair of iron ring knockers. Nothing else.", [SINGLE])
add('03-city-wall', '城牆（土牆、無城垛，會橫向拼接）', '1536x1024',
 "Subject: a long straight section of Bianjing's city wall as painted in Zhang Zeduan's scroll: rammed-earth wall with sloping (battered) faces, warm loess colour, faint horizontal tamping layers, gentle weathering, "
 "a flat top with sparse grass and two or three small young trees. No battlements, no crenellations, no brick facing, no towers. The wall strip is about one quarter of the image height.", [STRIP])
add('04-zhengdian', '正店（大酒樓，有彩樓歡門）', '1536x1024',
 "Subject: a large licensed wine house (zhengdian) of Bianjing. Two storeys, timber frame, hip-and-gable (xieshan) grey tile roof, upper floor with open windows and a railing. "
 "In front of the entrance a tall festive gateway (cailou huanmen) made of bound wooden poles rising in tiers above the door, decorated with coloured silk festoons and silk flowers, exactly as on the big taverns in Zhang Zeduan's scroll; "
 "a long blank cloth wine banner (jiupei) hanging from a tall pole beside it; a few lanterns; benches and wine jars at the open ground floor.", [ARCH, SINGLE])
add('05-jiaodian', '腳店（小酒店）', '1536x1024',
 "Subject: a small single-storey wine shop (jiaodian) with an overhanging-gable (xuanshan) grey tile roof, open front with tables and benches, "
 "a modest festive gateway of bound poles (cailou huanmen) over the door with a little silk decoration, and a small blank wine flag on a pole.", [ARCH, SINGLE])
add('06-teahouse', '茶坊', '1536x1024',
 "Subject: a single-storey Song tea house: overhanging-gable (xuanshan) grey tile roof, wide open front, square tables, long benches and a tea stove; in front, a flat cloth sunshade stretched on bamboo poles.", [ARCH, SINGLE])
add('07-shop-awning', '街邊商舖（遮陽棚）', '1536x1024',
 "Subject: a small Song street shop: single storey, overhanging-gable tile roof, open front with goods on shelves and a counter, a large slanted reed-mat awning on wooden poles in front, and a free-standing blank vertical signboard by the door.", [ARCH, SINGLE])
add('08-house-thatched', '草頂民宅', '1536x1024',
 "Subject: a modest commoner's house with a thatched straw gable roof, mud-plastered walls, a plain plank door, a small vertical-bar window and a low woven-wattle fence on one side.", [ARCH, SINGLE])
add('09-house-tiled', '瓦頂民宅（有院門）', '1536x1024',
 "Subject: an urban dwelling: single storey, grey tile overhanging-gable roof, timber frame with plastered infill walls, vertical-bar windows and a small roofed courtyard gate beside it.", [ARCH, SINGLE])
add('10-two-storey-shop', '兩層樓店舖', '1536x1024',
 "Subject: a two-storey street building: a shop on the ground floor with an open front and goods, living quarters above with a balcony railing and rolled bamboo blinds, grey tile roof, timber frame.", [ARCH, SINGLE])
add('11-temple-hall', '佛寺大殿（遠景地標）', '1536x1024',
 "Subject: the main hall of a Buddhist temple: five bays, single-eave hip-and-gable (xieshan) roof with fish-tail ridge ornaments, large bracket sets, red-ochre columns and lattice doors, on a low plain stone platform with simple steps and no balustrade.", [ARCH, SINGLE])
add('12-chazi-fence', '御街朱漆杈子（會橫向拼接）', '1536x1024',
 "Subject: a straight section of the red-lacquered wooden barrier fence (zhuqi chazi) that stood along the middle of Bianjing's Imperial Way, built as the 'chazi' barrier of the Yingzao Fashi: "
 "square posts with simple finials, two horizontal rails and rows of closely spaced vertical pickets with cloud-shaped pointed tops, all in worn red lacquer. The fence strip is low, about one sixth of the image height.", [STRIP])
add('13-camels', '駝隊（三匹駱駝與牽駝人）', '1536x1024',
 "Subject: a merchant camel caravan as in Zhang Zeduan's scroll, where camels walk out through the city gate: three two-humped Bactrian camels, each loaded with bundles of goods and rolled felt, "
 "and one camel driver in a felt hat and long belted coat holding a lead rope. Every camel and the driver drawn separately, each in three-quarter front view walking toward the viewer.", [PEOPLE, SHEET])
add('14-people-street', '街上人物（守門兵、挑夫、文人等）', '1536x1024',
 "Subject: ten separate figures, full body, three-quarter front view: two city gate guards in Song soldier dress (red-ochre robe, cloth headwrap, holding a spear); a gatekeeper leaning as if pushing open a heavy door; "
 "a porter with loads on a shoulder pole; a street vendor with a tray of food; a scholar in a futou cap and long round-collared robe; an official on horseback with a groom leading the horse; "
 "a woman in a beizi jacket; a small child; a Buddhist monk.", [PEOPLE, SHEET])
add('15-vehicles', '車輛與牲口', '1536x1024',
 "Subject: separate vehicles and animals in side view, as in Zhang Zeduan's scroll: a heavy ox-drawn cart (taiping che) with its driver; a wheelbarrow pushed by a man and pulled by a donkey; "
 "a sedan chair (jiaozi) with a small roof and curtains carried by two bearers; a man riding a donkey; a pack donkey with loads.", [PEOPLE, SHEET])
# ---------- trees ----------
add('16-tree-willow-a', '垂柳 A（老樹）', '1024x1536',
 "Subject: a large old weeping willow in early spring: short gnarled trunk splitting into a few thick boughs, long thin drooping branches with fresh pale yellow-green young leaves, airy and graceful, like the willows along the Bian River in Zhang Zeduan's scroll.", [SINGLE])
add('17-tree-willow-b', '垂柳 B（斜長的年輕柳）', '1024x1536',
 "Subject: a slimmer, younger weeping willow leaning to one side, long hanging branches with light new green leaves, early spring.", [SINGLE])
add('18-tree-elm', '老榆樹（早春枯枝）', '1024x1536',
 "Subject: a tall old elm tree in early spring, like the old trees in the opening section of Zhang Zeduan's scroll: thick rough trunk, angular twisting branches that are still almost bare with only the first tiny buds, crisp ink outlines and dry-brush bark texture.", [SINGLE])
add('19-tree-apricot', '杏花樹', '1024x1536',
 "Subject: a flowering apricot tree in early spring (apricot and peach trees were planted along Bianjing's Imperial Way): medium height, dark angular branches covered in pale pink-white blossoms, very few leaves.", [SINGLE])
# ---------- spread 2: 汴河虹橋 ----------
add('20-rainbow-bridge', '虹橋（不畫人）', '1536x1024',
 "Subject: the Rainbow Bridge over the Bian River, in side elevation, as in Zhang Zeduan's scroll: a single-span arched timber bridge with no piers. The arch is built from many long logs laid side by side in overlapping, interlocking groups and tied with transverse beams (woven-timber arch), "
 "with the log ends visible along the arch. A wooden railing runs along both edges of the deck; a few vendor stalls with large parasols and cloth awnings stand on the deck; tall wooden poles stand at the bridge ends; "
 "low stone-and-earth abutments with a short embankment at each end. The arch is high enough for large boats to pass under. No people on the bridge (figures are added separately) and no water.", [ARCH, SINGLE])
add('21-grain-boat-hull', '漕船船身（不畫桅杆）', '1536x1024',
 "Subject: a large Song grain transport boat of the Bian River, side view seen very slightly from above so the deck edge shows, bow pointing left: a long wooden hull with a flat bottom and raised stern, "
 "a long arched cabin of matting and planks covering most of the deck, a large stern rudder and a long sculling oar, coiled ropes and long bamboo poles on the cabin roof. "
 "IMPORTANT: no mast at all; leave only the empty wooden mast step on the forward deck, because the mast is drawn separately. No water.", [OBJ])
add('22-aframe-mast', '人字桅（單獨畫，要能放倒）', '1024x1536',
 "Subject: the A-frame (bipod) mast of a Song river boat, as in Zhang Zeduan's scroll: two long timber legs joined at the top to form an upright inverted V, with a short cross-piece, a pulley block at the apex and loose rigging ropes hanging down; "
 "seen from the front-side so both legs are visible. Only the mast, nothing else.", [OBJ])
add('23-cargo-boat', '靠岸貨船（桅杆已放倒）', '1536x1024',
 "Subject: a moored Song cargo boat, side view, bow pointing right: hull loaded with sacks, a mat-roofed cabin, its A-frame mast lowered and lying along the cabin roof with the sail furled, a gangplank and a water jar. No water.", [OBJ])
add('24-small-boat', '小舟', '1536x1024',
 "Subject: a small river boat with a low arched mat canopy, one boatman standing at the stern working a long sculling oar, side view. No water.", [PEOPLE, OBJ])
add('25-stalls', '橋頭攤販（大傘、布棚）', '1536x1024',
 "Subject: separate street stalls in front view, as at the foot of the Rainbow Bridge in Zhang Zeduan's scroll: a food stall under a large round parasol on a pole; a stall under a square cloth awning on four poles; "
 "a vendor's table of small goods under a big umbrella; a fortune-teller's stall with a little awning and a blank sign; a handcart loaded with goods.", [SHEET])
add('26-boat-crew', '船工與縴夫（過橋那一幕）', '1536x1024',
 "Subject: twelve separate river workers, full body, in the action poses of the famous boat-under-the-bridge scene of Zhang Zeduan's scroll: men thrusting long bamboo poles upward as if fending off the bridge; men hauling on ropes; "
 "a man shouting with both arms raised; a man on a cabin roof waving; men bracing with poles at the bow; and three trackers bent forward pulling a tow rope over the shoulder. "
 "Bare forearms, short jackets, trousers rolled up, cloth headwraps. Side and three-quarter views.", [PEOPLE, SHEET])
add('27-onlookers', '圍觀的人（橋上、岸邊）', '1536x1024',
 "Subject: ten separate townspeople watching excitedly, full body, three-quarter front view: people leaning forward with hands on an implied railing, people pointing, a man clutching his hat, "
 "a woman holding a child, a vendor with a shoulder pole stopping to look, an old man with a cane, a scholar in a futou cap.", [PEOPLE, SHEET])
# ---------- cover and texture ----------
add('28-cover', '封面（書衣，無字）', '1024x1536',
 "Subject: the front cover of a book in the Song manner, flat, filling the entire image edge to edge: deep indigo silk with a subtle woven cloud-and-crane damask pattern, slightly worn at the edges, "
 "and a blank cream-coloured paper title slip (tiqian) pasted vertically near the upper left. Flat front view, not a book in perspective, no background.", [], transparent=False)
add('29-water', '河水紋理（可無縫拼接）', '1024x1024',
 "Subject: a seamless, tileable texture filling the entire image: top-down view of gently moving river water drawn as fine ink ripple lines in the manner of Song water studies (Ma Yuan's 'Twelve Views of Water'), "
 "very pale blue-grey wash on a warm silk tone, an even pattern from edge to edge, no objects, no boats, no shore.", [], transparent=False)

json.dump({'output_dir': 'bianjing-art', 'images': E}, open('prompts.json', 'w'), ensure_ascii=False, indent=1)

md = ["# 汴京一日：美術素材生成清單", "",
"## Instructions for Codex", "",
"Generate every image in `prompts.json` (the same entries are listed below) and save them as PNG files in a folder named `bianjing-art/`.", "",
"1. Use each entry's `prompt` exactly as written, at its `size`, with the highest quality setting available. If a larger size with the same aspect ratio is available, use the larger one.",
"2. When `transparent_background` is true and the image tool supports it, request a transparent background; otherwise keep the pure white background the prompt asks for.",
"3. Style lock: generate `01-zhuque-gate.png` first. For every later entry with `use_style_reference: true`, attach `01-zhuque-gate.png` as a reference image if the tool accepts input images, and append this sentence to the prompt: \"Match the drawing style, line weight and colour palette of the reference image exactly; do not copy its subject.\" If reference images are not supported, generate from the prompt alone.",
"4. Check every result by looking at it. Regenerate (up to 3 attempts per entry) when any of these is true:",
"   - it contains any writing: Chinese characters, letters, numbers, seals, signatures or watermarks;",
"   - the subject is cut off by or touches the image edge (except entries 03, 12, 28 and 29, which are meant to reach the edges);",
"   - a building is drawn in perspective or three-quarter view instead of a flat front elevation, or there is ground, a cast shadow or background scenery;",
"   - Ming/Qing features appear: white marble terraces or balustrades, dragon-head ridge beasts, brick crenellated battlements, a round-arched brick gate tunnel;",
"   - entry 21 shows a mast, entry 02 shows anything besides the doors, or entry 20 shows people;",
"   - colours are saturated or glossy rather than faded and restrained.",
"5. Keep the exact file names. Do not crop, upscale, recolour or otherwise post-process.",
"6. When finished, write `bianjing-art/manifest.txt` listing each file, its final size and how many attempts it took, then zip the folder as `bianjing-art.zip`.", "",
"## Images", ""]
for i, e in enumerate(E, 1):
    md += [f"### {e['file']}  ({e['title']})", f"size: {e['size']} · transparent_background: {str(e['transparent_background']).lower()} · use_style_reference: {str(e['use_style_reference']).lower()}", "", "```text", e['prompt'], "```", ""]
open('bianjing-art-prompts.md', 'w').write('\n'.join(md))
print(len(E), 'images'); print(max(len(e['prompt']) for e in E), 'max prompt chars')
