# popup-book：互動電子立體書

（`Chimmy-Ultra/skills-repo` 裡的一個資料夾；skill 本體是 `SKILL.md`。）

把學習資料做成在手機上用手指翻頁的立體書（interactive pop-up book）：翻開一頁，建築和人物從紙上立起來；點一下、拖一下，書裡的機關會動，而且動的方式就是在教那頁的內容。

成品是一個網頁（單一 `index.html` + 一組 WebP 圖），發布成 Claude 的 artifact。

- 範例一：`examples/bianjing`《汴京一日》，宋代汴京的六個時辰，直書右翻，6 個跨頁，美術由 Codex 生成。
- 範例二：`examples/demo-left`，橫書左翻的測試書（歐姆定律、焦耳熱），有 TeX 公式和拖曳滑桿，圖是程式畫的佔位圖。

## 快速開始

```bash
bash tools/setup.sh                              # 一次：Python 套件、three.js、MathJax、字型
python3 tools/cut.py examples/bianjing            # 切圖（art-src -> build/）
python3 tools/build.py examples/bianjing          # 建置（-> dist/index.html + dist/a/*.webp）
python3 tools/shot.py examples/bianjing audit     # 版面檢查
python3 tools/shot.py examples/bianjing spreads   # 每頁截圖（-> shots/）
```

## 結構

```
engine/        翻頁引擎（three.js）：書、紙頁、卡片、文字排版（直書、橫書、公式）、光線、音效、測試介面
tools/         setup.sh · cut.py（切圖）· build.py（建置）· shot.py（截圖、audit、執行 JS）
               measure.py（量錨點、縮圖）· prompts.py（美術 prompt pack）· import_art.py（匯入生好的圖）
guides/        workflow.md（主流程）· layout.md · mechanisms.md · checklist.md · art-prompts.md
               history.md · science.md · english.md（三種內容各自的寫法與核對方式）
examples/      範例書
books/         新做的書，一本一個資料夾
```

## 授權

- 王漢宗中行書（`wt071.ttf`）是 GPL 字型，由 `tools/setup.sh` 從 dictcp/wangfonts 下載，建置時只嵌入用到的字。
- EB Garamond：SIL Open Font License。three.js：MIT。MathJax：Apache 2.0。
