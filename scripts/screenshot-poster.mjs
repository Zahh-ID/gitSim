import puppeteer from "puppeteer-core";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// A3 ratio (297mm x 420mm) at a readable viewport width
// Output: 1024 * 4 = 4096px wide, ~5790px tall → 300 DPI quality
const VIEWPORT_WIDTH = 1024;
const VIEWPORT_HEIGHT = Math.round(1024 * (420 / 297)); // 1449
const DEVICE_SCALE = 4;

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();

await page.setViewport({
  width: VIEWPORT_WIDTH,
  height: VIEWPORT_HEIGHT,
  deviceScaleFactor: DEVICE_SCALE,
});

await page.goto("http://localhost:3002/poster", {
  waitUntil: "networkidle0",
  timeout: 30000,
});

await new Promise((r) => setTimeout(r, 2500));

// PNG screenshot
await page.screenshot({
  path: resolve(ROOT, "public/poster-a3.png"),
  type: "png",
  clip: { x: 0, y: 0, width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
});

// PDF vector (A3, print quality)
await page.pdf({
  path: resolve(ROOT, "public/poster-a3.pdf"),
  width: `${VIEWPORT_WIDTH}px`,
  height: `${VIEWPORT_HEIGHT}px`,
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});

const outW = VIEWPORT_WIDTH * DEVICE_SCALE;
const outH = VIEWPORT_HEIGHT * DEVICE_SCALE;
console.log(`PNG saved: public/poster-a3.png (${outW}x${outH})`);
console.log(`PDF saved: public/poster-a3.pdf (A3 vector)`);

await browser.close();
