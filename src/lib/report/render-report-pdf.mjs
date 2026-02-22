/*
PDF renderer: Playwright-based HTML -> PDF
Page format: Letter
Margins: 0.5in on all sides
*/

export async function renderReportPdf({ html }) {
  if (typeof html !== "string" || html.trim().length === 0) {
    throw new Error("renderReportPdf requires non-empty html");
  }

  let playwrightModule;
  try {
    const dynamicImport = new Function(
      "modulePath",
      "return import(modulePath);",
    );
    playwrightModule = await dynamicImport("playwright");
  } catch {
    throw new Error(
      "playwright_not_installed: install `playwright` to enable PDF generation",
    );
  }

  const browser = await playwrightModule.chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    const pdf = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
    });
    return pdf;
  } finally {
    await browser.close();
  }
}
