async (page) => {
  const log = [];
  const expect = (condition, message) => {
    if (!condition) throw new Error(message);
    log.push(`ok - ${message}`);
  };
  const text = async (selector) => (await page.locator(selector).innerText()).replace(/\s+/g, " ").trim();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:8770/index.html");

  expect((await text(".hero")).includes("腿部事业群"), "home shows duty department");
  expect((await text(".hero")).includes("开始 60 秒小会"), "home starts from default duration");

  await page.locator("button", { hasText: "90 秒" }).click();
  await page.locator("button", { hasText: "开始 90 秒小会" }).click();

  const sceneBox = await page.locator(".scene").boundingBox();
  expect(sceneBox && sceneBox.height > 300, "office scene is the dominant mobile area");
  expect((await text(".hud")).includes("行动 1 / 5"), "round uses action count instead of agenda count");
  expect((await text(".wall-title")).includes("办公室正在出事"), "scene frames the round as office incidents");
  expect(await page.locator(".incident-marker").count() >= 4, "90 second round shows visible incidents");
  expect(await page.locator(".modal-action").count() === 0, "handling choices are not persistent");
  expect(await page.locator(".context-panel").count() === 0, "direct play removes the large handling panel");
  expect(await page.locator(".device:not(.hidden)").count() === 4, "90 second round exposes four KPI devices");
  expect(await page.locator(".incident-marker.hot").count() === 1, "one urgent incident is highlighted in the room");

  await page.locator(".incident-ppt_bubble").click();
  expect((await text(".incident-modal")).includes("PPT 泡泡"), "incident tap opens event modal with description");
  expect(await page.locator(".modal-action").count() === 4, "event modal exposes temporary handling choices");
  await page.locator(".modal-action", { hasText: "转移" }).click();
  await page.waitForTimeout(120);
  expect((await text(".hud")).includes("行动 1 / 5") || (await text(".hud")).includes("行动 2 / 5"), "modal action keeps round state visible");
  expect(await page.locator(".incident-modal").count() === 0, "event modal closes after handling");
  expect((await text(".speech")).includes("PPT") || (await text(".speech")).includes("转移"), "modal action produces feedback");

  await page.locator("button", { hasText: "复工结算" }).click();
  expect((await text(".report-card")).includes("今日肉身财报"), "settlement produces report");
  expect((await text(".report-card")).includes("办公室余震"), "report includes unresolved incident result");
  expect((await text(".report-card")).includes("风险贴纸"), "report includes risk labels");

  await page.locator("button", { hasText: "去档案墙" }).click();
  expect((await text(".archive-card")).includes("档案墙"), "archive wall opens from report");
  expect((await text(".archive-card")).includes("累计小会"), "archive wall shows long-term record");

  await page.screenshot({ path: "C:/Users/yuqiy/Documents/游戏黑客松/output/playwright/mobile-slice-smoke.png", fullPage: true });
  return log.join("\n");
}
