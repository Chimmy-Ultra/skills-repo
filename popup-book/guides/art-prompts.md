# 美術：寫給 Codex 的 prompt pack

圖由 Chimmy 丟給 Codex 生。我們的工作是寫一份它能照做、而且生回來就能切成卡片的 prompt pack。

## 流程

1. 從分頁大綱列出所有要畫的東西（見下面「怎麼拆」）。
2. 寫 `books/<slug>/art/prompts.py`，用 `tools/prompts.py` 的 `Pack`：

```python
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'tools'))
from prompts import Pack, SINGLE, OBJ, SHEET, STRIP, NEUTRAL_LIGHT

STYLE = "..."      # 一段風格描述，每張圖都一樣
ARCH = "..."       # 這本書的領域規則（建築、服裝、器材），哪些要、哪些不要

pack = Pack(title='書名', batch='<slug>-art-1', style=STYLE, anchor='01-xxx')
pack.add('01-xxx', '中文說明（風格基準，先生成）', '1536x1024', "Subject: ...", [ARCH, SINGLE], section='跨頁一')
pack.add('02-yyy', '...', '1536x1024', "Subject: ten separate ...", [PEOPLE, SHEET], section='跨頁一')
pack.reject('entry 05 shows the doors open')      # 這本書特有的重生條件
pack.write(os.path.dirname(os.path.abspath(__file__)))
```

3. `python3 books/<slug>/art/prompts.py` → `<batch>-prompts.md`，用 SendUserFile 傳給 Chimmy。
4. 第二批以後：`Pack(..., anchor='01-xxx', anchor_dir='<slug>-art-1')`，掛第一批的基準圖當 style reference。

範例：`examples/bianjing/art/prompts/`（實際用過的兩批，61 張）、`examples/demo-left/art/prompts.py`（物理書的寫法）。

## 怎麼拆

- **一張圖一個主體**（`SINGLE` 正立面、`OBJ` 指定角度），或**一張 sheet 放 5–12 個分開的小東西**（`SHEET`：人、攤子、燈籠）。sheet 上的東西不能重疊，不然切不開。
- **長條**（城牆、長廊、河岸石壁）用 `STRIP`，切的時候可以 `repeat` 接長。
- **會動的部分分開畫**：門板、桅杆、蓋子、手臂。主體上要留出它的位置（例如「只畫桅杆的兩個鉸座，桅杆另外畫」）。
- **視角要跟卡片在書裡被看的方式一致**：卡片面向南、讀者從南邊看 → 建築畫正立面；從船尾看的船就要畫船尾。
- 人的大小要一致：同一批人放同一張 sheet，或在 prompt 寫明「same scale as ...」。
- 夜景、黃昏的圖**還是畫白天的中性光**，光線由書來加（加上 `NEUTRAL_LIGHT` 這一段）。

## STYLE 段要寫什麼

- 時代和畫風的具體依據（例：「in the manner of Zhang Zeduan's original Qingming scroll, NOT the Qing court version」；理工書：「19th-century physics textbook engraving, Ganot's Elements of Physics」）。
- 色盤和質感（淡彩、不飽和、不要光澤）。
- 領域規則另外寫一段，**明確列出要避免的錯**（例：宋代不要出現明清的漢白玉欄杆、龍頭脊獸、磚砌雉堞；器材不要虛構零件）。

## 一定要有的

- `NOTEXT`：完全不能有字（生出來的字一定錯或亂碼）。招牌、匾額留白。
- 白底或透明、四邊留白、不能碰到邊（長條例外）。
- 沒有地面、沒有投影、沒有背景。
- `reject` 寫進這本書特有的錯（「34 號一定要五個門洞」）。

## 圖回來之後

`tools/import_art.py` 會產生匯入縮圖。逐張看，不合格的列出來（檔名 + 問題），請 Chimmy 只重生那幾張。
