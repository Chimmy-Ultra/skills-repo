---
name: popup-book
description: 把學習資料（歷史人文、物理理工、英文）做成手機上用手指翻頁的互動電子立體書（interactive pop-up book）網頁。Chimmy 說要做立體書、把資料做成立體書、或要改他做過的立體書時使用。
---

# 互動電子立體書

把一份學習資料做成一本可以翻頁的立體書網頁：翻開一頁，建築、人物、器材從紙上立起來；點一下、拖一下，書裡的機關會動，而且機關本身就在教那一頁的內容。成品發布成 artifact。

範例成品：《汴京一日》https://claude.ai/artifact/2nZ6LM2z4jciDjsZDBYWmG

## 1. 拿到引擎

引擎、工具和所有說明都在 Chimmy 的 skills repo **`Chimmy-Ultra/skills-repo`** 的 `popup-book/` 資料夾：

1. 用 `add_repo`（owner `Chimmy-Ultra`、repo `skills-repo`、`access: "push"`）掛上 repo，照它回傳的指令 clone。
2. `cd skills-repo/popup-book && bash tools/setup.sh`（一次；裝 Python 套件、three.js、MathJax、EB Garamond、王漢宗中行書）。
3. **先讀 `guides/workflow.md`**，整個流程照它走。

這個 session 拿不到 repo（沒有 add_repo、或被拒絕）時，直接告訴 Chimmy 需要一個能連到他 GitHub 的 session，不要憑記憶重寫引擎。

## 2. 依內容讀對應的指南

| 資料 | 讀 | 裝訂與文字 |
|---|---|---|
| 歷史、地理、古文、人文場景 | `guides/history.md` | 右翻、直書（`textBlocks`） |
| 物理、數學、工程、論文推導、實驗 | `guides/science.md` | 左翻、橫書 + TeX 公式（`hTextBlocks`） |
| 英文單字、情境、閱讀 | `guides/english.md` | 左翻、橫書、英文字型、語音 |

寫跨頁前讀 `guides/layout.md` 和 `guides/mechanisms.md`；寫美術 prompt 前讀 `guides/art-prompts.md`；交件前照 `guides/checklist.md` 逐項檢查。範例在 `examples/bianjing`（直書）和 `examples/demo-left`（橫書、公式、拖曳）。

## 3. 一定要做到的事

- **分頁大綱先給 Chimmy 確認**（每個跨頁：場景、機關、正文要點、旁註出處），他點頭才寫 prompt 和程式。
- **內容必須正確**，這是教材：歷史引文逐字對原典並記下版本，理工公式自己推過、數字用程式算，英文用法查字典。對不到的不放，出處寫進 `books/<slug>/sources.md`。
- **美術由 Chimmy 丟 Codex 生**：用 `tools/prompts.py` 寫 prompt pack，用 SendUserFile 把 .md 傳給他，等他把 zip 傳回來；圖回來逐張看過，不合格的列出來請他重生。
- **機關要在教東西**：重演原典寫的事，或做成定量正確的實驗（拖控制量、畫面照物理變化）。
- **檢查**：`tools/shot.py <book> audit` 要乾淨，每一頁和每個機關的截圖都要打開看。
- **發布**：`books/<slug>/dist/index.html` + `dist/files.json` 的檔案對照表發布成 artifact；改同一本書時更新同一個 artifact。
- **存回 repo**：新書放 `books/<slug>/`（含 `art-src/`），引擎或工具的改進一起 commit、push。
- 不要安排 Chimmy 自己寫程式。

## 4. 回報

一兩句說做好了什麼（artifact 卡片會附連結）；有疑慮或沒測到的地方集中講清楚，例如「只在模擬瀏覽器測過，沒在真的手機上翻」。
