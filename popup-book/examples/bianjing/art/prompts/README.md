# 汴京一日：用過的美術 prompt

這兩批是《汴京一日》實際丟給 Codex 生圖用的 prompt，留著當寫新書 prompt 的範本。

- `batch1-prompts.md`（`batch1_make.py` 產生）：第一批 29 張，朱雀門是風格基準（style anchor）。
- `batch2-prompts.md`（`batch2_make.py` + `batch2_blocks.py` 產生）：第二批 32 張，掛第一批的朱雀門當 style reference。

新書請改用 `tools/prompts.py` 的 `Pack`（寫法見 guides/art-prompts.md），格式跟這兩批一樣。
