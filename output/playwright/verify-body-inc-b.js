async (page) => {
  const log = [];
  const url = "http://127.0.0.1:8765/index.html?variant=B";

  const expect = async (condition, message) => {
    if (!condition) throw new Error(message);
    log.push(`ok - ${message}`);
  };

  const text = async (selector) => (await page.locator(selector).innerText()).replace(/\s+/g, " ").trim();
  const clickText = async (label) => {
    await page.locator("button").filter({ hasText: label }).first().click();
  };
  const waitStamp = async () => page.waitForTimeout(1050);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url);
  await expect(await page.locator(".switcher-label").innerText() === "B · KPI 指挥台", "Variant B is the default proof-of-fun path");

  await clickText("开始今日营业");
  await clickText("今日歇业");
  await expect((await text(".report-meta")).includes("0 次小会"), "zero-meeting report is honest");
  await expect((await text(".report-card")).includes("未开会"), "zero-meeting report avoids fake rating");

  await clickText("再开一轮");
  await clickText("开始今日营业");
  await clickText("完成本组");
  await clickText("正常交付");
  await expect((await text(".audit-panel")).includes("本轮审计重点"), "audit focus is visible before choices");
  await clickText("提前复工");
  const earlyRating = await text(".rating-card");
  await expect(earlyRating.includes("勉强复工"), "early resume is capped below perfect rating");
  await expect(earlyRating.includes("+6"), "early resume OKR is capped at +6");
  await expect(earlyRating.includes("仓促复工 +1"), "early resume creates a risk tag");
  await expect(earlyRating.includes("未审预算"), "early resume creates next-round fallout");

  await clickText("延长 15 秒");
  await clickText("定义为恢复型研发投入");
  await waitStamp();
  const extensionRating = await text(".rating-card");
  await expect(extensionRating.includes("41% -> 41%"), "extension does not award another OKR payout");
  await expect(extensionRating.includes("延长休息 +1"), "extension is labeled as a risk");
  await clickText("今日歇业");
  await expect((await text(".report-meta")).includes("1 次小会 + 1 个追加议题"), "extension is counted as an extra agenda, not a full meeting");

  await clickText("再开一轮");
  await clickText("开始今日营业");
  await clickText("完成本组");
  await clickText("超额完成");
  await clickText("包装成下肢基建升级");
  await waitStamp();
  await clickText("包装成战略融资窗口");
  await waitStamp();
  await expect((await text(".audit-panel")).includes("预警: 泡沫"), "crisis warning appears when a KPI enters danger");
  await clickText("命名为恢复型战略沉淀");
  await waitStamp();
  const crisisResult = await text(".result-panel");
  await expect(crisisResult.includes("泡沫审计 +1"), "crisis triggers after danger persists into the next agenda");
  await clickText("补发试用员工工牌");
  await waitStamp();
  await clickText("发放复工边缘补贴");
  await waitStamp();
  const finalRating = await text(".rating-card");
  await expect(finalRating.includes("部门 OKR 推进"), "rating shows OKR progress");
  await expect(finalRating.includes("泡沫审计 +1"), "rating carries current-round crisis risk");
  await expect(finalRating.includes("下轮:"), "rating shows next-round preview");
  await clickText("今日歇业");
  await expect((await text(".report-card")).includes("泡沫审计 +1"), "report summarizes session risks and crises");

  return log.join("\n");
}
