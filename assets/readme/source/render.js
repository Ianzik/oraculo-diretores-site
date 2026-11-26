// Gera as imagens do README a partir de readme-boards.html (precisa do Playwright).
// Uso: node assets/readme/source/render.js
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const fonte = "file://" + path.join(__dirname, "readme-boards.html");
  const saida = path.join(__dirname, "..");
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1300, height: 900 }, deviceScaleFactor: 2 });
  await p.goto(fonte);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  for (const id of ["hero", "prova", "como"]) {
    await p.locator("#" + id).screenshot({ path: path.join(saida, id + ".png") });
  }
  await b.close();
})();
