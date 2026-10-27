exec(open(__file__.replace('batch2_make.py', 'batch2_blocks.py')).read())
NEUTRAL_NIGHT = "Draw everything in even neutral daylight colours even though the scene happens in the evening; lamplight and night colour are added later by the book."
E = []
def add(fid, title, size, body, blocks, transparent=True, ref=True, spread=''):
    E.append({'file': f'{fid}.png', 'title': title, 'spread': spread, 'strip': STRIP in blocks, 'size': size, 'transparent_background': transparent, 'use_style_reference': ref,
              'prompt': ' '.join([STYLE] + blocks + [body, NOTEXT])})

# ---------------- 汴河虹橋（重拍：船改成從船尾看，汴河直直穿過橋下） ----------------
S2 = '汴河虹橋（重做船）'
add('30-boat-stern', '漕船・船尾視角（不畫桅杆）', '1024x1024',
 "Subject: the same kind of large Song grain transport boat of the Bian River, now seen from directly behind (stern view), very slightly from above so the deck shows: the tall square stern with its big rudder and rudder post in the middle, the arched cabin roof of matting and planks seen end-on, coiled ropes and bamboo poles on the roof, the hull sides tapering toward the bow behind. "
 "IMPORTANT: no mast; leave only the two empty mast hinge blocks on the forward deck, because the mast is drawn separately. No water.", [OBJ], spread=S2)
add('31-mast-stern', '人字桅・從船尾看（單獨畫，要能往後放倒）', '1024x1536',
 "Subject: the A-frame (bipod) mast of that boat, seen from behind: two long timber legs spread apart at the bottom and joined at the top, forming a tall upright inverted V, with a short cross-piece, a pulley block at the apex and loose rigging ropes hanging down. Only the mast.", [OBJ], spread=S2)
add('32-boats-river', '河上其他船（不同角度）', '1536x1024',
 "Subject: four separate Song river boats, no water: a moored cargo boat in three-quarter rear view with its A-frame mast already lowered along the cabin roof; a small sampan with one boatman sculling, in three-quarter front view; a passenger boat with a long windowed cabin, in three-quarter rear view; a small fishing boat with a net, in three-quarter front view.", [SHEET], spread=S2)
add('33-crew-back', '船工・背影（站在船篷上撐竿）', '1536x1024',
 "Subject: eight separate boatmen seen from behind or three-quarter behind, full body, standing as if on a boat roof: men thrusting long bamboo poles upward and forward, a man with both arms raised shouting, men hauling a rope, a man bracing with a pole. Bare forearms, short jackets, trousers rolled up, cloth headwraps.", [PEOPLE, SHEET], spread=S2)

# ---------------- 3. 宣德樓前御街（辰時） ----------------
S3 = '宣德樓前御街'
add('34-xuande-gate', '宣德樓（皇宮正門，五個門洞）', '1536x1024',
 "Subject: Xuande Gate, the main south gate of the Northern Song palace in Bianjing, as described in Meng Yuanlao's 'Dongjing Meng Hua Lu' and seen on the roof in Emperor Huizong's painting 'Auspicious Cranes': "
 "a long, high gate platform faced with brick and stone, its walls carved in relief with dragons, phoenixes and flying clouds; FIVE gate passages in a row (trapezoid timber-framed passages in the Song manner), each closed by vermilion-lacquered doors studded with rows of gilded nails; "
 "on top, a grand palace gate tower hall with a hip roof of blue-green glazed tiles, large bracket sets, fish-tail ridge ornaments, vermilion columns and colourfully painted railings, and a blank horizontal name plaque.", [ARCH, SINGLE], spread=S3)
add('35-duolou', '朵樓（宣德樓兩側的角樓，畫一座）', '1536x1024',
 "Subject: one of the two flanking corner towers (duolou) of the Xuande Gate, joined to the gate by an L-shaped wing: a smaller tower hall with a blue-green glazed-tile hip-and-gable roof and fish-tail ridge ornaments, on a brick-and-stone platform carved with clouds; vermilion railings with painted panels; the short wing that would connect to the main gate leaves the image on one side.", [ARCH, SINGLE], spread=S3)
add('36-queting', '闕亭（宣德樓前相對的亭子，畫一座）', '1024x1024',
 "Subject: one of the pair of gate pavilions (queting) that faced each other in front of the Xuande Gate: a square pavilion on a stone base, blue-green glazed-tile roof, vermilion columns, painted railings, enclosed by a low vermilion wooden barrier fence (chazi).", [ARCH, SINGLE], spread=S3)
add('37-yulang', '御廊（御街兩側的長廊，會橫向拼接）', '1536x1024',
 "Subject: a long straight section of the Imperial Corridor (yulang) that lined both sides of Bianjing's Imperial Way: a continuous covered walkway with a long grey-tile roof on a row of red-ochre timber posts, open toward the street, simple railings between the posts. The strip is about one third of the image height.", [STRIP], spread=S3)
add('38-heiqi-chazi', '黑漆杈子（御廊前的黑色木柵，會橫向拼接）', '1536x1024',
 "Subject: a straight section of the black-lacquered wooden barrier fence (heiqi chazi) that stood in front of the Imperial Corridor, built like the chazi barrier of the Yingzao Fashi: square posts with simple finials, two horizontal rails, rows of closely spaced vertical pickets with cloud-shaped pointed tops, all in worn black lacquer. The fence strip is low, about one sixth of the image height.", [STRIP], spread=S3)
add('39-cranes', '瑞鶴（仿宋徽宗《瑞鶴圖》，做飛翔動畫）', '1536x1024',
 "Subject: twelve separate red-crowned cranes in the manner of Emperor Huizong's painting 'Auspicious Cranes' (1112), which shows cranes circling above the Xuande Gate: white bodies, black neck and black flight feathers, a small red crown, legs trailing behind; "
 "ten cranes in flight with varied wing positions that can form a flapping cycle (wings raised, level, lowered) in side and slight three-quarter views, and two cranes standing as if perched on a roof ridge.", [SHEET], spread=S3)
add('40-officials', '上朝官員與禁軍', '1536x1024',
 "Subject: ten separate Northern Song court figures, full body, three-quarter front view: court officials in round-collared robes wearing the hard black futou cap with long straight horizontal wings (zhanjiao futou), robe colours by rank (purple, crimson, green), each holding a hu tablet; "
 "one official riding a horse led by a groom; an attendant holding a large ceremonial parasol on a long pole; two palace guards in armour holding halberds; a page carrying a lacquered document box.", [PEOPLE, SHEET], spread=S3)
add('41-tree-pear', '梨花樹', '1024x1536',
 "Subject: a pear tree in full white blossom in early spring (pear, peach, plum and apricot trees were planted along the Imperial Way's water channels): dark branches covered in clusters of white five-petal flowers and a few fresh leaves.", [SINGLE], spread=S3)
add('42-tree-peach', '桃花樹', '1024x1536',
 "Subject: a peach tree in pink blossom in early spring: slender dark branches thick with pink flowers, a few young leaves.", [SINGLE], spread=S3)
add('43-lotus-leaves', '御溝裡的初生荷葉（俯視）', '1536x1024',
 "Subject: a sheet of separate young lotus leaves for the brick-lined water channels (yugou) of the Imperial Way, seen from directly above, flat top-down view: small round floating leaves of early spring ('lotus coins') in several sizes, a few rolled new leaves just breaking the surface. No flowers yet (it is early spring). No water drawn.", [SHEET], spread=S3)

# ---------------- 4. 大相國寺萬姓交易（巳時） ----------------
S4 = '大相國寺萬姓交易'
add('44-xiangguo-gate', '大相國寺山門（三門）', '1536x1024',
 "Subject: the great gate (sanmen) of Daxiangguo Temple in Bianjing: a large gate hall with three doorways, single-eave hip-and-gable roof with fish-tail ridge ornaments, large bracket sets, red-ochre columns, a blank horizontal name plaque, on a low stone platform with steps; plain courtyard ground in front is not drawn.", [ARCH, SINGLE], spread=S4)
add('45-temple-pavilion', '佛閣（兩層樓閣，像資聖閣那樣）', '1536x1024',
 "Subject: a tall two-storey Song Buddhist pavilion of a great city temple, like the Zisheng Pavilion of Daxiangguo Temple: a balcony platform (pingzuo) with railing between the storeys, double eaves, grey tile roof with fish-tail ornaments, large bracket sets, lattice doors, on a stone platform with steps.", [ARCH, SINGLE], spread=S4)
add('46-temple-corridor', '寺院兩廊（會橫向拼接）', '1536x1024',
 "Subject: a long straight section of a temple side corridor (langwu): a covered colonnade with a grey-tile roof on red-ochre posts, a plastered back wall with faint Buddhist wall paintings, low railings between the posts. The strip is about one third of the image height.", [STRIP], spread=S4)
add('47-fair-stalls-a', '萬姓交易攤位 A（飛禽貓犬、席屏、鞍弓、果脯、蜜煎）', '1536x1024',
 "Subject: five separate stalls of the monthly fair inside Daxiangguo Temple, as listed in 'Dongjing Meng Hua Lu', each a small open shed or coloured cloth awning (caimu lu wu) with its goods, front view: "
 "1) a bird and pet seller: hanging cages of songbirds, a cat and a puppy in baskets; 2) rush mats, bamboo mats and folding screens; 3) saddles, bridles, bows and swords on a rack; 4) fresh fruit and dried meat; 5) honey-preserved fruit in jars.", [SHEET], spread=S4)
add('48-fair-stalls-b', '萬姓交易攤位 B（筆墨、尼姑繡作、書畫、傳神算命、香藥）', '1536x1024',
 "Subject: five more separate stalls of the Daxiangguo Temple fair, front view: 1) writing brushes and ink cakes laid out for scholars; 2) Buddhist nuns selling embroidery, collars, silk flowers, pearl and kingfisher-feather hair ornaments; "
 "3) books, scrolls and paintings hanging for sale; 4) a booth of a portrait painter and fortune teller with a small awning and a blank sign; 5) incense and medicinal herbs brought by officials from the provinces.", [SHEET], spread=S4)
add('49-fair-people', '逛廟會的人', '1536x1024',
 "Subject: ten separate figures at a Song temple fair, full body, three-quarter front view: two monks in robes, a Buddhist nun, a scholar unrolling a painting to look at it, a woman examining hair ornaments, a man carrying a bird cage, a child holding a toy, a porter with a shoulder pole, a couple walking together, an old woman with a basket.", [PEOPLE, SHEET], spread=S4)

# ---------------- 5. 瓦子勾欄（酉時） ----------------
S5 = '瓦子勾欄'
add('50-goulan-stage', '勾欄戲台（瓦子裡的表演棚）', '1536x1024',
 "Subject: a performance stage in a Northern Song pleasure quarter (wazi) such as the Sangjia wazi, where there were more than fifty goulan: a raised wooden platform stage enclosed by a low railing (the goulan that gave the place its name), a large roof of grey tiles on wooden posts forming a shed (peng) over the stage, "
 "a painted cloth backdrop with two side doorways for performers, coloured banners on poles at the front corners, lanterns hanging from the eaves. Front elevation, no performers (they are drawn separately).", [ARCH, SINGLE], spread=S5)
add('51-performers', '瓦子伎藝（傀儡、講史、相撲、雜技、小唱等）', '1536x1024',
 "Subject: ten separate Northern Song entertainers of the kinds listed in the 'Capital Entertainers' chapter of 'Dongjing Meng Hua Lu', full body, front or three-quarter view: "
 "a rod-puppet master raising a rod puppet above his head (zhangtou kuilei); a string-marionette master working a marionette from a cross-bar (xuansi kuilei); a storyteller of history seated at a small table with a folding fan and a wooden clapper (jiangshi); "
 "two bare-chested wrestlers grappling (xiangpu), drawn as one piece; an acrobat on a pole; a performer kicking a ball in tricks (cuju); a woman singer with clappers (xiaochang); a man with trained performing birds and a little turtle (nong chongyi); a zaju comic actor in costume with a painted face.", [PEOPLE, SHEET], spread=S5)
add('52-shadow-play', '影戲棚與皮影（能動的影子戲）', '1536x1024',
 "Subject: a Song shadow-play (yingxi) booth and its puppets, separate pieces: the booth with a framed translucent paper screen, a small roof and cloth sides, front view (the screen itself left plain and pale); "
 "and five separate coloured leather shadow puppets with jointed limbs and control rods, translucent red, green and ochre: a general on horseback, a scholar, a lady, a demon, a horse.", [SHEET], spread=S5)
add('53-wazi-crowd', '瓦子裡的觀眾與小販', '1536x1024',
 "Subject: ten separate figures in a pleasure quarter, full body, three-quarter front view, as described in 'Dongjing Meng Hua Lu' (medicine sellers, fortune tellers, old-clothes criers, food, barbers, paper pictures): "
 "three audience members watching and laughing, a snack vendor with a tray, a medicine seller holding a blank banner, a fortune teller with a small sign, a barber with his stool and basin, a man crying old clothes held over his arm, a seller of paper pictures, a child on a father's shoulders.", [PEOPLE, SHEET], spread=S5)
add('54-wazi-teahouse', '瓦子旁的茶樓（兩層、掛燈籠）', '1536x1024',
 "Subject: a two-storey tea and wine house beside the pleasure quarter: grey tile roof, open upper floor with railing and rolled bamboo blinds, a festive gateway of bound poles over the door, a row of unlit lanterns under the eaves, blank banners.", [ARCH, SINGLE, NEUTRAL_NIGHT], spread=S5)
add('55-wazi-entrance', '大棚入口（象棚那樣的大表演棚）', '1536x1024',
 "Subject: the entrance front of one of the big performance sheds that held thousands of people (like the Elephant Shed of the Inner Wazi): a broad timber and mat-roofed shed front with a wide opening, a tall banner pole with long blank banners, a fence, a ticket table, unlit lanterns.", [ARCH, SINGLE, NEUTRAL_NIGHT], spread=S5)

# ---------------- 6. 州橋夜市（戌時） ----------------
S6 = '州橋夜市'
add('56-zhouqiao', '州橋（天漢橋，低平石橋）', '1536x1024',
 "Subject: Zhou Bridge (also called Tianhan Bridge) over the Bian River in Bianjing, side elevation: a LOW and FLAT stone bridge, too low for boats to pass, with piers, beams and posts of blue-grey stone and a carved stone balustrade along the deck; "
 "at both ends, stone embankment walls carved with sea horses, water beasts and flying clouds — described in 'Dongjing Meng Hua Lu' and confirmed by the 2018–2022 excavation of the Zhou Bridge site in Kaifeng. No people, no water.", [ARCH, SINGLE], spread=S6)
add('57-stone-wall', '州橋旁的石壁（海馬水獸浮雕，會橫向拼接）', '1536x1024',
 "Subject: a long straight section of the carved stone river embankment beside Zhou Bridge: courses of blue-grey stone blocks carved in relief with winged sea horses, water beasts and flying clouds, as excavated at the Zhou Bridge site. The strip is about one quarter of the image height.", [STRIP], spread=S6)
add('58-night-stalls-a', '夜市攤 A（水飯熝肉、包子、羊白腸、薑辣蘿蔔、砂糖）', '1536x1024',
 "Subject: five separate food stalls of the Zhou Bridge night market described in 'Dongjing Meng Hua Lu', front view, each with its own unlit paper lantern on a pole and soft painted wisps of steam: "
 "1) rice-in-water and stewed meat with big pots; 2) steamed buns in stacked bamboo steamers; 3) a small charcoal grill frying lamb intestines on skewers; 4) ginger-spicy pickled radish and cold dishes in jars; 5) sugar sweets and candies on trays.", [SHEET, NEUTRAL_NIGHT], spread=S6)
add('59-night-stalls-b', '夜市攤 B（乾脯鮓、湯麵、果子、鵝鴨雞兔、茶水）', '1536x1024',
 "Subject: five more separate night-market stalls, front view, each with an unlit lantern: 1) dried meat and preserved fish; 2) a soup and noodle stall with a low table and stools; 3) fruit and sweetmeats; 4) cooked goose, duck, chicken and rabbit hanging on a rack; 5) tea water from a big kettle.", [SHEET, NEUTRAL_NIGHT], spread=S6)
add('60-lanterns', '燈籠與燈架（亮燈機關用）', '1536x1024',
 "Subject: a sheet of separate Song paper and silk lanterns for a night street, drawn unlit: round hanging lanterns of several sizes, tall standing lantern poles, a lantern on a bamboo pole meant to be carried, square shop lanterns, a lantern frame with a pair of lanterns for a stall.", [SHEET, NEUTRAL_NIGHT], spread=S6)
add('61-night-people', '逛夜市的人', '1536x1024',
 "Subject: ten separate figures at a Song night market, full body, three-quarter front view: two diners eating at a small table on stools (drawn as one piece with the table), a vendor calling out, a family strolling with a child carrying a small lantern, a scholar eating from a bowl, "
 "a night watchman with a wooden clapper and a lantern, two friends drinking, a woman buying sweets, a porter resting on his shoulder pole.", [PEOPLE, SHEET, NEUTRAL_NIGHT], spread=S6)

json.dump({'output_dir': 'bianjing-art-2', 'style_reference': 'bianjing-art/01-zhuque-gate.png', 'images': E}, open('prompts.json', 'w'), ensure_ascii=False, indent=1)
strips = [e['file'][:2] for e in E if e.pop('strip')]
md = ["# 汴京一日：第二批美術素材", "",
"## Instructions for Codex", "",
"Generate every image in `prompts.json` (the same entries are listed below) and save them as PNG files in a new folder named `bianjing-art-2/`, next to the existing `bianjing-art/` folder.", "",
"1. Use each entry's `prompt` exactly as written, at its `size`, with the highest quality setting available. If a larger size with the same aspect ratio is available, use the larger one.",
"2. When `transparent_background` is true and the image tool supports it, request a transparent background; otherwise keep the pure white background the prompt asks for.",
"3. Style lock: every entry has `use_style_reference: true`. Attach `bianjing-art/01-zhuque-gate.png` (the first batch's style anchor) as a reference image if the tool accepts input images, and append this sentence to the prompt: \"Match the drawing style, line weight and colour palette of the reference image exactly; do not copy its subject.\" If reference images are not supported, generate from the prompt alone.",
"4. Check every result by looking at it. Regenerate (up to 3 attempts per entry) when any of these is true:",
"   - it contains any writing: Chinese characters, letters, numbers, seals, signatures or watermarks;",
f"   - the subject is cut off by or touches the image edge (except the strips {', '.join(strips)}, which are meant to reach the left and right edges);",
"   - a building is drawn in perspective or three-quarter view instead of a flat front elevation, or there is ground, a cast shadow or background scenery;",
"   - Ming/Qing features appear: white marble terraces or balustrades, dragon-head ridge beasts, brick crenellated battlements, round-arched brick gate tunnels;",
"   - entry 30 shows a mast, entry 34 does not have five gate passages, entry 43 shows lotus flowers, or entry 50 shows performers on the stage;",
"   - pieces in a sheet overlap each other;",
"   - colours are saturated or glossy rather than faded and restrained.",
"5. Keep the exact file names. Do not crop, upscale, recolour or otherwise post-process.",
"6. When finished, write `bianjing-art-2/manifest.txt` listing each file, its final size and how many attempts it took, then zip the folder as `bianjing-art-2.zip`.", "",
"## Images", ""]
cur = None
for e in E:
    if e['spread'] != cur:
        cur = e['spread']; md += [f"## {cur}", ""]
    md += [f"### {e['file']}  ({e['title']})", f"size: {e['size']} · transparent_background: {str(e['transparent_background']).lower()} · use_style_reference: {str(e['use_style_reference']).lower()}", "", "```text", e['prompt'], "```", ""]
open('bianjing-art-2-prompts.md', 'w').write('\n'.join(md))
print(len(E), 'images', 'strips', strips, 'max chars', max(len(e['prompt']) for e in E))
