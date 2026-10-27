# 英文

目前沒有完整的英文範例書；版面照 `examples/demo-left`（左翻、橫書、EB Garamond），機關用下面的做法。

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

## 核對

- 片語和搭配詞要自然、常用：不確定就查字典（Cambridge、Oxford Learner's、Merriam-Webster）或語料，寫進 `sources.md`。
- 音標（IPA）照字典抄，不要憑印象。
- 中文意思要準，不要用「大概是…」的翻譯。

## Chimmy 的偏好

- 片語、字彙要附意思說明。
- 中英混合時不要加「中文：」這種標籤，也不要逐句中英對照。
- 原文是英文的內容（引用、專有名詞）直接保留英文。
