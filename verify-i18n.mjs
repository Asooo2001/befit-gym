import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForSelector("text=Push your limits");
await page.screenshot({ path: "verify-1-en-home.png" });

// switch to Albanian
await page.click('button:has-text("SQ")');
await page.waitForSelector("text=Tejkalo kufijtë");
await page.screenshot({ path: "verify-2-sq-home.png" });

// scroll to pricing and open join modal
await page.click('a[href="#memberships"]');
await page.waitForSelector("text=Plane të krijuara për");
await page.click('button:has-text("Zgjidh Premium")');
await page.waitForSelector("text=Bashkohu me");
await page.screenshot({ path: "verify-3-sq-modal.png" });

// switch back to English while modal open
await page.click('button:has-text("EN")');
await page.waitForSelector("text=Join");
await page.screenshot({ path: "verify-4-en-modal.png" });

// reload and confirm persistence (should remain English since last set)
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector("text=Push your limits");
await page.screenshot({ path: "verify-5-en-after-reload.png" });

console.log("CONSOLE_ERRORS:", JSON.stringify(errors));
await browser.close();
