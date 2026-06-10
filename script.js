/* ===================================================================
   NASDOG ($NASDOG) — script.js
   Ticker tape · candlestick chart (only goes up) · copy contract ·
   meme gallery + lightbox · scroll reveals · live-ish price wiggle
   =================================================================== */

(function () {
  "use strict";

  /* ---- EDIT THESE: your real links & contract ----------------- */
  const CONFIG = {
    contract: "So1aNaDOGc0ntractAddre55Here000000000000pump",
    links: {
      x: "#",            // https://x.com/yourhandle
      tg: "#",           // https://t.me/yourgroup
      dexscreener: "#",  // https://dexscreener.com/solana/<pair>
      dex: "#",          // Raydium swap URL
      jupiter: "#",      // https://jup.ag/swap/SOL-NASDOG
    },
  };
  /* ------------------------------------------------------------- */

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    wireConfig();
    buildTicker();
    buildMemes();
    copyContract();
    revealOnScroll();
    countUp();
    navBehavior();
    drawSparkline();
    drawCandles();
    livePriceWiggle();
    $("#year").textContent = new Date().getFullYear();
  }

  /* ---- Inject CA + links --------------------------------------- */
  function wireConfig() {
    const addr = $("#caAddr");
    if (addr) addr.textContent = CONFIG.contract;
    $$("[data-link]").forEach((el) => {
      const key = el.getAttribute("data-link");
      if (CONFIG.links[key]) {
        el.href = CONFIG.links[key];
        el.target = "_blank";
        el.rel = "noopener";
      }
    });
  }

  /* ---- Ticker tape --------------------------------------------- */
  function buildTicker() {
    const track = $("#tickerTrack");
    if (!track) return;
    const rows = [
      ["NASDOG", "+420.69%", true], ["WOOF", "+88.00%", true],
      ["TREATS", "+12.40%", true], ["BARK", "+69.42%", true],
      ["HODL", "+1000%", true], ["BISCUIT", "-2.10%", false],
      ["BONE", "+34.50%", true], ["GOODBOY", "+777%", true],
      ["LEASH", "+5.55%", true], ["FETCH", "+21.00%", true],
      ["ZOOMIES", "+143%", true], ["NAP", "+0.01%", true],
    ];
    const make = () =>
      rows
        .map(
          ([t, c, up]) =>
            `<span class="ticker__item"><b>$${t}</b> <span class="${up ? "up" : "down"}">${up ? "▲" : "▼"} ${c}</span></span>`
        )
        .join("");
    // duplicate so the loop is seamless
    track.innerHTML = make() + make();
  }

  /* ---- Meme gallery + lightbox --------------------------------- */
  function buildMemes() {
    const grid = $("#memeGrid");
    if (!grid) return;
    const captions = [
      "CEO of NASDOG", "Risk it for the biscuit", "Eat sleep trade repeat",
      "Buy, hold, moon", "Gains only", "Moon soon, I can feel it",
      "Stocks over treats", "Back when I'm rich", "Confidence & chill",
      "Today's plan: buy, hodl, treats", "No sell only hodl", "To the moon",
    ];
    let html = "";
    for (let i = 1; i <= 12; i++) {
      const src = `assets/memes/meme-${i}.png`;
      html += `<figure class="meme" data-full="${src}" title="${captions[i - 1]}">
        <img src="${src}" alt="NASDOG meme — ${captions[i - 1]}" loading="lazy" />
      </figure>`;
    }
    grid.innerHTML = html;

    // lightbox
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `<img alt="NASDOG meme enlarged" />`;
    document.body.appendChild(box);
    const bimg = $("img", box);

    grid.addEventListener("click", (e) => {
      const fig = e.target.closest(".meme");
      if (!fig) return;
      bimg.src = fig.getAttribute("data-full");
      box.classList.add("open");
    });
    box.addEventListener("click", () => box.classList.remove("open"));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") box.classList.remove("open");
    });
  }

  /* ---- Copy contract address ----------------------------------- */
  function copyContract() {
    const btn = $("#caCopy");
    if (!btn) return;
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(CONFIG.contract);
      } catch (_) {
        const r = document.createRange();
        r.selectNode($("#caAddr"));
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
        try { document.execCommand("copy"); } catch (e) {}
        sel.removeAllRanges();
      }
      const old = btn.textContent;
      btn.textContent = "Copied! 🐾";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = old;
        btn.classList.remove("copied");
      }, 1600);
    });
  }

  /* ---- Reveal on scroll ---------------------------------------- */
  function revealOnScroll() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en, i) => {
          if (en.isIntersecting) {
            setTimeout(() => en.target.classList.add("in"), (i % 4) * 80);
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---- Count-up for big numbers -------------------------------- */
  function countUp() {
    const el = $("[data-count]");
    if (!el) return;
    const target = parseInt(el.getAttribute("data-count"), 10);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        const dur = 1400, t0 = performance.now();
        const fmt = (n) => Math.round(n).toLocaleString("en-US");
        const tick = (t) => {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    io.observe(el);
  }

  /* ---- Nav: shrink on scroll + mobile menu --------------------- */
  function navBehavior() {
    const nav = $("#nav");
    const burger = $("#navBurger");
    const links = $("#navLinks");
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (burger && links) {
      burger.addEventListener("click", () => links.classList.toggle("open"));
      links.addEventListener("click", (e) => {
        if (e.target.tagName === "A") links.classList.remove("open");
      });
    }
  }

  /* ---- Hero sparkline (mini up-only line) ---------------------- */
  function drawSparkline() {
    const c = $("#spark");
    if (!c || !c.getContext) return;
    const ctx = c.getContext("2d");
    const w = c.width, h = c.height, n = 28;
    const pts = [];
    let v = h * 0.85;
    for (let i = 0; i < n; i++) {
      v -= (h * 0.55) / n;                       // overall climb
      v += Math.sin(i * 0.9) * 4 - (i % 5 === 0 ? 5 : 0); // wiggle
      pts.push({ x: (w / (n - 1)) * i, y: Math.max(6, Math.min(h - 4, v)) });
    }
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, "#16e08a");
    grad.addColorStop(1, "#00ff95");
    // area fill
    ctx.beginPath();
    ctx.moveTo(pts[0].x, h);
    pts.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[n - 1].x, h);
    ctx.closePath();
    const fill = ctx.createLinearGradient(0, 0, 0, h);
    fill.addColorStop(0, "rgba(22,224,138,0.35)");
    fill.addColorStop(1, "rgba(22,224,138,0)");
    ctx.fillStyle = fill;
    ctx.fill();
    // line
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.4;
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  /* ---- Candlestick chart that only goes up --------------------- */
  function drawCandles() {
    const c = $("#candles");
    if (!c || !c.getContext) return;
    const ctx = c.getContext("2d");

    // crisp on retina
    const cssW = c.clientWidth || 1000;
    const scale = window.devicePixelRatio || 1;
    c.width = Math.floor(cssW * scale);
    c.height = Math.floor(420 * scale);
    ctx.scale(scale, scale);
    const W = cssW, H = 420;

    // deterministic pseudo-random (so it looks the same each load)
    let seed = 1337;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const n = 46;
    const pad = { l: 8, r: 8, t: 24, b: 24 };
    const innerW = W - pad.l - pad.r;
    const cw = innerW / n;
    const bodyW = cw * 0.58;

    // build an up-trending series
    const candles = [];
    let price = 18;
    let lo = price, hi = price;
    for (let i = 0; i < n; i++) {
      const open = price;
      const drift = 1.9 + (i / n) * 1.3;           // accelerating climb
      const noise = (rnd() - 0.42) * 6;            // mostly green
      let close = open + drift + noise;
      if (close < open && rnd() > 0.55) close = open + Math.abs(noise) * 0.4; // suppress reds
      const high = Math.max(open, close) + rnd() * 4 + 1;
      const low = Math.min(open, close) - rnd() * 3 - 0.5;
      candles.push({ open, close, high, low });
      price = close;
      lo = Math.min(lo, low);
      hi = Math.max(hi, high);
    }
    const range = hi - lo || 1;
    const Y = (v) => pad.t + (1 - (v - lo) / range) * (H - pad.t - pad.b);

    let frame = 0;
    function render() {
      ctx.clearRect(0, 0, W, H);

      // grid
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for (let g = 0; g <= 4; g++) {
        const y = pad.t + ((H - pad.t - pad.b) / 4) * g;
        ctx.beginPath();
        ctx.moveTo(pad.l, y);
        ctx.lineTo(W - pad.r, y);
        ctx.stroke();
      }

      const shown = Math.min(frame, n);
      for (let i = 0; i < shown; i++) {
        const cdl = candles[i];
        const x = pad.l + cw * i + cw / 2;
        const up = cdl.close >= cdl.open;
        const col = up ? "#16e08a" : "#ff5c5c";
        ctx.strokeStyle = col;
        ctx.fillStyle = col;

        // wick
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, Y(cdl.high));
        ctx.lineTo(x, Y(cdl.low));
        ctx.stroke();

        // body
        const yO = Y(cdl.open), yC = Y(cdl.close);
        const top = Math.min(yO, yC);
        const hgt = Math.max(2, Math.abs(yC - yO));
        ctx.globalAlpha = up ? 1 : 0.85;
        ctx.fillRect(x - bodyW / 2, top, bodyW, hgt);
        ctx.globalAlpha = 1;
      }

      // moon arrow on the last shown candle
      if (shown >= n) {
        const last = candles[n - 1];
        const x = pad.l + cw * (n - 1) + cw / 2;
        const y = Y(last.high) - 6;
        ctx.fillStyle = "#00ff95";
        ctx.font = "20px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("🚀", x, y);
      }

      if (frame <= n) {
        frame++;
        requestAnimationFrame(render);
      }
    }

    // animate in when scrolled into view
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            io.disconnect();
            requestAnimationFrame(render);
          }
        });
      }, { threshold: 0.25 });
      io.observe(c);
    } else {
      frame = n;
      render();
    }

    // redraw on resize (debounced)
    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => { frame = n; drawCandlesResize(); }, 200);
    });
    function drawCandlesResize() {
      const w2 = c.clientWidth || 1000;
      c.width = Math.floor(w2 * scale);
      c.height = Math.floor(420 * scale);
      ctx.scale(scale, scale);
      frame = n;
      render();
    }
  }

  /* ---- Live-ish price wiggle ----------------------------------- */
  function livePriceWiggle() {
    const targets = [$("#heroPrice"), $("#chartPrice")];
    const chgs = [$("#heroChg"), $("#chartChg")];
    let base = 0.000069;
    let pct = 420.69;
    setInterval(() => {
      const drift = (Math.random() - 0.45) * 0.0000018;
      base = Math.max(0.00001, base + drift);
      pct = Math.max(0, pct + (Math.random() - 0.45) * 6);
      const priceStr = "$" + base.toFixed(6);
      const up = drift >= 0;
      targets.forEach((t) => t && (t.textContent = priceStr));
      chgs.forEach((ch) => {
        if (!ch) return;
        ch.textContent = (up ? "▲ +" : "▼ +") + pct.toFixed(2) + "%";
        ch.classList.toggle("up", true);
      });
    }, 2200);
  }
})();
