# NASDOG ($NASDOG) — memecoin website

A fun, single-page memecoin site for **NASDOG** — the first dog on the trading floor. 🐶📈

Static HTML/CSS/JS, no build step, no dependencies. Just open `index.html`.

## Files
```
nasdog-site/
├─ index.html        # all the page content / sections
├─ styles.css        # gold + black + bull-green theme (matches the logo)
├─ script.js         # ticker tape, candlestick chart, copy-contract, memes
└─ assets/
   ├─ logo.png       # your NASDOG emblem (hero + favicon)
   └─ memes/         # 12 meme tiles (sliced from your meme grid)
```

## Make it yours — 3 quick edits

1. **Contract address + social links** — open `script.js`, edit the `CONFIG` block at the top:
   ```js
   const CONFIG = {
     contract: "PASTE_YOUR_CONTRACT_HERE",
     links: {
       x:  "https://x.com/yourhandle",
       tg: "https://t.me/yourgroup",
       dexscreener: "https://dexscreener.com/solana/<pair>",
       dex: "https://raydium.io/swap/...",
       jupiter: "https://jup.ag/swap/SOL-NASDOG",
     },
   };
   ```
   The contract auto-fills the hero box and all "Buy/Join" buttons.

2. **Live chart** — once you're listed, replace the `<canvas id="candles">` in the
   Chart section of `index.html` with your DexScreener / Birdeye iframe embed.
   (The animated candlestick chart is the fun placeholder until then.)

3. **Copy/jokes** — all text lives in `index.html`. Tweak the tagline, roadmap,
   tokenomics numbers, etc. to taste.

## Run locally
Just double-click `index.html`, **or** serve it (better for clipboard/fonts):
```powershell
# from inside nasdog-site/
python -m http.server 8080
# then open http://localhost:8080
```

## Deploy (free)
- **Netlify / Vercel:** drag-and-drop the `nasdog-site` folder, done.
- **GitHub Pages:** push the folder to a repo, enable Pages on the root.
- **Cloudflare Pages:** connect repo, no build command, output dir = `/`.

> $NASDOG is a meme coin for entertainment only. Memes, not financial advice. 🦴
