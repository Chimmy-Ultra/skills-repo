# 英文

完整範例：`books/toeic-part1`（多益 Part 1 看圖練習，六個場景共用 `spreads/05-scene.js` 這個工廠，每頁只寫資料）。版面照 `examples/demo-left`（左翻、橫書、EB Garamond），機關用下面的做法。

## 書的形式

- 左翻、橫書：`"binding": "left"`、`"latinFont": "EB Garamond"`、`"lang": "en-US"`。
- 介面文字可以換成英文：`book.json` 的 `"ui"`，例如
  `{"open": "Drag the cover to the left to open", "next": "Drag the right page to the left", ...}`（欄位見 `engine/50-main.js` 的 `UI`）。
  Chimmy 在練英文，介面用英文也可以；先問他要哪個。
- 正文是英文，重點字用 `[[...]]` 標強調色。

## 一個跨頁 = 一個情境

- 例：在機場報到、餐廳點餐、實驗室討論、口試回答問題。平面畫場地，卡片是人和物件（6–10 個）。
- 正文：一小段對話或短文（80–120 字），程度預設 CEFR B2（Chimmy 在準備 TOEIC）；先問他想要的程度。
- 旁註：這頁的關鍵片語，每個附中文意思和一個例句。

## 機關

- **點物件 → 念出來 + 浮出字卡**：`env.say('boarding pass')` 用瀏覽器語音念；`tagMesh('boarding pass　登機證', null, 0.03)` 浮在物件上方幾秒。
- **點人物 → 念出他的台詞**：對話一句一句念，對應的句子在正文裡用強調色標出（可以在 `plan` 裡重印，或用 `tagMesh` 疊一個高亮）。
- **拖曳配對**：把單字卡拖到對應的物件上（`dragStart / dragMove / dragEnd`，放開時檢查距離）。
- **之前／之後（被動進行 vs 完成）**：工人在做 → 念 "is being + p.p."；做完工人走開、卡片換成完成狀態 → 念 "has been + p.p."。之前、之後兩張圖要是同一個物件（prompt 裡講明 "the same ..."）。見 `05-scene.js` 的 `swap`。
- **照考試格式出題（考我）**：念 "Look at the picture." 後依序念 A–D 四句，不印在畫面上（Part 1 的選項只有聲音）；等 `env.speaking()` 變 false 再念下一句。隨時可以點 A–D 作答，答完用 `panelMesh` 顯示每個選項對或錯的理由。見 `05-scene.js` 的 `quiz`。

## 多益 Part 1 的出題規則（`books/toeic-part1/sources.md` 有出處）

- 6 題，每題一張照片、四句敘述只念一次，選最符合照片的一句。
- 錯誤選項常見的陷阱：being / been 混用（但 "is being displayed" 這類陳列用法是例外，指東西擺著）、發音相近的字、名詞對但動詞錯、照片裡沒有的人、猜測照片外的事、wearing（穿著）vs putting on（正在穿上）。
- 場景從 ETS 考生手冊列的範圍挑（Offices、Housing / Corporate Property、Travel、Dining Out、Purchasing 等 13 類）；公園這種戶外場景不在那張表裡，是這本書另外加的。

## 核對

- 片語和搭配詞要自然、常用：不確定就查字典（Cambridge、Oxford Learner's、Merriam-Webster）或語料，寫進 `sources.md`。
- 音標（IPA）照字典抄，不要憑印象。
- 中文意思要準，不要用「大概是…」的翻譯。

## Chimmy 的偏好

- 片語、字彙要附意思說明。
- 中英混合時不要加「中文：」這種標籤，也不要逐句中英對照。
- 原文是英文的內容（引用、專有名詞）直接保留英文。
