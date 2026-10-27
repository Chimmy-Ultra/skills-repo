# 做一本立體書：完整流程

這份是主流程。內容類型的細節在 `history.md`、`science.md`、`english.md`；座標和版面在 `layout.md`；機關的 API 和做法在 `mechanisms.md`；美術 prompt 在 `art-prompts.md`；交件前的檢查在 `checklist.md`。

範例書：`examples/bianjing`（《汴京一日》，直書右翻，6 個跨頁，真的美術）、`examples/demo-left`（橫書左翻的測試書，公式、拖曳，佔位圖）。

## 0. 準備環境（每個新的 container 一次）

```bash
# 先用 add_repo 掛上 Chimmy-Ultra/skills-repo（access: push），照它的指令 clone
cd skills-repo/popup-book
bash tools/setup.sh          # Python 套件、three.js / MathJax / EB Garamond、王漢宗中行書
```

以下路徑都相對於 `skills-repo/popup-book/`。一本新書放在 `books/<slug>/`，結構跟範例一樣：

```
books/<slug>/
  book.json            書名、裝訂（right / left）、顏色、字型、封面、介面文字
  spreads/10-xxx.js    一個跨頁一個檔，檔名決定載入順序
  spreads/99-order.js  const SPREADS = [spreadA, spreadB, ...];
  art/prompts.py       美術 prompt pack（tools/prompts.py 的 Pack）
  art/manifest.json    切圖清單（tools/cut.py）
  art/hooks.py         （選用）切圖的特殊處理
  art-src/             Codex 生回來的圖（WebP）
  sources.md           核對過的出處清單
```

## 1. 讀資料、選類型、定裝訂

先判斷資料是哪一類，讀對應的指南：

| 資料 | 指南 | 裝訂 | 文字 |
|---|---|---|---|
| 歷史、地理、古文、人文場景 | `history.md` | 右翻（`binding: "right"`） | 直書，`textBlocks` |
| 物理、數學、工程、論文推導、實驗 | `science.md` | 左翻（`binding: "left"`） | 橫書，`hTextBlocks` + 公式 |
| 英文單字、情境、閱讀 | `english.md` | 左翻 | 橫書，英文字型 |

混合的資料（例如科學史）：看正文主要用哪種文字排版就用哪種裝訂。

## 2. 分頁大綱：先給 Chimmy 看，他點頭才往下

一本 5–6 個跨頁。每個跨頁固定四樣東西：

1. **場景**：立起來的是什麼（建築、人、器材），平面上畫什麼（街道、河、電路、地圖）。
2. **機關**：一個點或拖的互動，而且這個互動本身要在教東西（城門打開、鶴停上鴟尾、拖滑桿改變電流）。
3. **正文**：短。直書 5 欄以內、每欄 12 字以內；橫書 80 字左右。
4. **旁註**：出處、原文引文、公式、或一句可以直接講的英文。

用表格把大綱交給 Chimmy（跨頁標題、場景、機關、正文要點、旁註出處），等他確認或修改。**沒確認不要開始寫 prompt 或程式。**

## 3. 核對內容

依類型指南核對：歷史引文逐字對原典、理工公式與數字用程式驗、英文用法對字典。每條出處寫進 `sources.md`。對不到的內容不放。

## 4. 美術：寫 prompt pack，交給 Chimmy 丟 Codex

1. 列出每個跨頁需要的所有卡片：建築、人、道具；**會動的部分分開畫**（門、桅杆、蓋子）；小東西放 sheet（一張 5–12 個）。
2. 寫 `art/prompts.py`（見 `art-prompts.md`），跑它產生 `<batch>-prompts.md`。
3. 用 SendUserFile 把 .md 傳給 Chimmy，請他丟 Codex 生圖、把 zip 傳回來。第一批的第一張是風格基準（style anchor）。
4. 等圖回來前不要寫 spreads 的細節（版面要看實際切出來的比例）。可以先寫平面圖。

## 5. 圖回來：匯入、切圖、看過

```bash
python3 tools/import_art.py books/<slug> /path/to/batch.zip     # -> art-src/*.webp + 匯入縮圖
python3 tools/cut.py books/<slug>                               # 依 art/manifest.json 切
python3 tools/measure.py books/<slug> contact                   # 全部卡片縮圖，用 Read 看
```

- 匯入縮圖要逐張看：有字、畫錯朝代、透視錯、缺件 → 列出來請 Chimmy 重生那幾張。
- sheet 切出來的數量對不上：`measure.py sheet <image>` 看編號，用 `split` / `merge` 修，或改 id 順序。
- 量機關要用的錨點：`measure.py top / color / grid`（見 `mechanisms.md`）。

## 6. 寫跨頁

照 `layout.md` 擺位置，照 `mechanisms.md` 寫機關。從範例書挑最接近的跨頁當起點。

## 7. 建置、截圖、檢查，一直修到乾淨

```bash
python3 tools/build.py books/<slug>
python3 tools/shot.py books/<slug> audit        # 卡片出界、蓋到文字、文字出框
python3 tools/shot.py books/<slug> spreads      # 每頁一張截圖 -> books/<slug>/shots/
python3 tools/shot.py books/<slug> steps '[{"name":"m1","js":"window.__app.jump(2); window.__app.tapCard(2, \"gate\")","frames":60,"dt":0.04}]'
```

每張截圖都要用 Read 打開看。audit 乾淨不代表畫面對，`checklist.md` 逐項過。

## 8. 發布

```
Artifact publish: file_path = books/<slug>/dist/index.html
                  files = books/<slug>/dist/files.json 的內容（build 印出的那份 map）
                  icon = book，description 一句話
```

更新同一本書：同一個 file_path 再 publish（同一個對話），或帶上 artifact 的 url（換了對話）。

## 9. 存回 repo

```bash
git add books/<slug> && git commit -m "books/<slug>: ..." && git push
```

`build/`、`dist/`、`shots/` 不進 git（重建得出來）。`art-src/` 要進 git，下次才能改這本書。
引擎或工具有改進也一起 commit，下一本書就能用。
