# 跨頁與機關：API 和做法

## 一個跨頁長這樣

```js
const spreadGate = {
  key: 'gate', title: '城門晨開', seed: 5,          // seed：紙張斑點的亂數
  light: { el: 31, az: 66, sun: '#ffe1b8', sunI: 0.66, amb: '#e3e7ee', ambI: 0.74 },
  hint: '點一下朱雀門',                              // 機關在初始狀態時的提示
  sr: '給螢幕閱讀器的全文',                          // 標題 + 正文 + 旁註
  planImages: ['lotus'],                            // （選用）plan 裡要印的圖
  texts: textBlocks({ ... }) 或 hTextBlocks({ ... }),
  plan(c) { /* 平面圖，見 layout.md */ },
  build(env) { /* 放卡片、做機關，回傳 mech */ },
};
```

最後一個檔 `99-order.js`：`const SPREADS = [spreadGate, ...];`

## env（`build(env)` 拿到的）

| | |
|---|---|
| `env.card(def)` | 放一張卡片，回傳 `Card` |
| `env.add(obj)` | 加一個 three.js 物件（光暈、粒子、sprite）。**翻頁時引擎會把它們全部 `visible = false`，回到這頁時全部設回 `true`**，所以要自己控制顯示的東西放進一個 `THREE.Group`，把 group 交給 `env.add`（見鶴） |
| `env.light(light)` | 加點光源。它一直留在場景裡（強度設 0 = 關），這樣所有材質不會因為光源數量改變而重新編譯 |
| `env.sfx(type, amt)` | 合成音效：`page` `creak` `thud` `bell` `pop` `crane` `drum` `gong` `fire` |
| `env.say(text, lang)` | 用瀏覽器的語音念出來（英文書） |
| `env.loadImage(src)` | 載入圖片（例如皮影戲的偶），回傳 Promise |
| `env.isResting()` | 這頁是不是靜止在畫面上 |

`card(def)` 的欄位：`id`（切圖 id）、`x, y`、`w` 或 `h`（或兩個都給）、`z`、`rot`、`mirror`、`ax`（腳的錨點，0.5 = 中間）、`parent`、`riseWith`、`noBake`（翻頁時不印到紙上）。

`Card`：`root`（平面上的位置）→ `pivot`（繞垂直軸轉，門）→ `hinge`（立起來的角度）→ `mesh`。

- `c.setRise(r)`、`c.lean`（再往前傾，正值朝讀者）：改了 `lean` 要再呼叫 `c.setRise(c.rise)`。
- `c.width`、`c.height`、`c.def`、`c.mirror`。
- `c.held = true`：翻到這頁時不立起來，由機關控制。
- `c.mesh.userData.tap = true` / `.drag = true`：可以點 / 可以拖。

## mech（`build` 回傳的）

```js
const mech = {
  home: true,                       // 在初始狀態嗎？（決定提示文字顯示機關提示還是翻頁提示）
  tap(card) { ...; return true; },  // 點到可點的卡片；回傳 false 會變成翻頁的點擊
  dragStart(card, [x, y]) { return true; }, dragMove([x, y]) {}, dragEnd() {},   // 讀者座標
  reset() {},                       // 回到初始狀態（翻離這頁後會呼叫），要完全還原
  leave() {},                       // （選用）開始翻離這頁時呼叫：關燈、停聲音
  update(dt, now) { return dirty; } // 每一幀；dirty = 有會投影的卡片動了（才重算陰影）
};
```

`update` 只有在卡片移動時回傳 `true`。光暈、sprite、粒子不投影，回傳 `false`，不然每一幀都在重算 2048² 的陰影貼圖。

## 小工具

- `cardPoint(card, u, v)` → 卡片上某點的世界座標 `[x, y, z]`；`u` 從左、`v` 從腳（`v = 1` 是頂），會處理 `mirror`。錨點用 `tools/measure.py` 量：
  - `top <piece> u0 u1`：輪廓最高點（鴟尾尖、桅杆頂）
  - `color <piece> u v`：顏色相同的區域（空白的布幕、窗戶）
  - `grid <piece>`：畫 u/v 格線的圖，用 Read 看
- `glowMesh(size)`：加法混色的光暈平面，`opacity` 從 0 開始。水平放是地上的光池；`rotation.x = π/2` 是直立、面向讀者，放在卡片前面一點點（`y − 0.005`）就不會被那張卡片切掉。
- `tagMesh(text, w)` / `tagMesh(text, null, h)`：紙籤（例如原書的品名），平行頁面，`opacity` 從 0 開始。
- `spritePlane(id, h)`：沒有卡紙背的 sprite（鳥、皮影）。
- `softBlob(size, color)`：柔邊圓形貼圖（霧、蒸氣）。

## 做法（都有範例可以抄）

| 想做的 | 範例 |
|---|---|
| 門打開（繞垂直軸轉）、隊伍沿路走出來 | `bianjing/spreads/10-gate.js`：`dl.pivot.rotation.z`、`camPath` |
| 一群鳥繞著飛、兩隻停到指定點、再一起飛走 | `20-xuande.js`：sprite 幀循環 `CYCLES`、`pose()` 對齊頭頂、`perched` |
| 點一下，東西一區一區冒出來 | `30-temple.js`：`held` + `root.scale` 從 0 長大 + `setRise` |
| 沿一條路拖、到某處觸發動作、有擋點 | `40-bridge.js`：`dragStart/Move` 只用 y、`stop` / `back` 限制 |
| 卡片上嵌一塊會動的畫面（皮影戲） | `50-wazi.js`：canvas 貼圖的平面加在 `booth.mesh` 上 |
| 燈一盞盞亮、點光源、蒸氣 | `60-night.js`：直立光暈 + 地面光池 + `env.light` + `leave()` |
| 拖滑桿改變一個物理量、粒子沿電路跑 | `demo-left/spreads/10-ohm.js`：`alongPath`、`dragMove` 用 x |
| 點一下發熱 | `demo-left/spreads/20-joule.js` |

## 踩過的坑

- **sprite 的朝向**：先看圖（鶴、皮影的偶各自面向哪邊），再決定 `scale.x` 的正負或 `flip`。
- **停在某一點的 sprite 浮起來**：sprite 的腳不一定在圖的正中間。用 alpha 找腳的位置再補位移（宣德樓的鶴就是這樣修的）。
- **光暈被自己的卡片切一半**：平放的光暈有一半在卡片北邊、被卡片擋住 → 改直立、放在卡片前面。
- **翻頁回來時東西殘留**：`reset()` 沒還原完整（透明度、位置、`held`、光源強度）。
- **點了沒反應**：卡片沒設 `userData.tap`；或前面有另一張可點的卡片（點擊只在可點 / 可拖的卡片之間找最近的一張，不可點的卡片不會擋）。
- **拖曳方向反了**：`dragMove` 拿到的是讀者座標，左翻書也一樣，不要自己再鏡像。
