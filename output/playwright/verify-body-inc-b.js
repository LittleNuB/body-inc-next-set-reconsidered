async (page) => {
  const log = [];
  const url = process.env.BODY_INC_TEST_URL || "http://127.0.0.1:8765/index.html?variant=B";

  const expect = async (condition, message) => {
    if (!condition) throw new Error(message);
    log.push(`ok - ${message}`);
  };

  const text = async (selector) => (await page.locator(selector).innerText()).replace(/\s+/g, " ").trim();

  const clickUnique = async (selector, message) => {
    const locator = page.locator(selector);
    const count = await locator.count();
    if (count !== 1) throw new Error(`${message}: expected 1 match, got ${count}`);
    await locator.click();
  };

  const clickAction = async (action) => clickUnique(`button[data-action="${action}"]`, `action ${action}`);
  const clickOption = async (option) => clickUnique(`button[data-action="option"][data-option="${option}"]`, `option ${option}`);
  const waitStamp = async () => page.waitForTimeout(1050);
  const waitAiSource = async () => page.locator(".ai-badge").waitFor({ state: "visible", timeout: 2600 });
  const hasAiSource = (value) => value.includes("AI秘书") || value.includes("本地模板");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url);
  await expect(await page.locator(".switcher-label").innerText() === "B · KPI 指挥台", "Variant B is still the default layout");
  await expect((await text(".hero")).includes("试营业 30 秒"), "default onsite entry is 30-second trial");
  await expect((await text(".hero")).includes("直接开完整小会"), "roadshow entry is available");

  await clickAction("start-trial");
  const trial = await text(".variant-layout");
  await expect(trial.includes("初创期试营业"), "trial meeting starts first");
  await expect(page.locator(".kpi").count() === 2, "trial shows two KPI cards");
  await expect(trial.includes("供氧周转") && trial.includes("动员温度"), "trial shows two renamed KPIs");
  await expect(!trial.includes("刺激强度") && !trial.includes("泡沫指数"), "trial hides advanced KPIs");
  await expect(!hasAiSource(trial) && !trial.includes("AI 会议秘书改稿中"), "trial does not trigger AI secretary");

  await clickOption("trial-oxygen-comfort");
  await waitStamp();
  await clickOption("trial-morale-comfort");
  await waitStamp();
  const trialRating = await text(".rating-card");
  await expect(trialRating.includes("试营业通过"), "trial produces a trial-specific rating");
  await expect(trialRating.includes("+8"), "trial OKR payout is capped");
  await expect(trialRating.includes("进入完整小会"), "trial rating offers a full-meeting transition");

  await clickAction("full-demo");
  await waitAiSource();
  const fullFromTrial = await text(".variant-layout");
  await expect(fullFromTrial.includes("组间小会") || fullFromTrial.includes("楼梯业务剥离案"), "full meeting can start after trial");
  await expect(page.locator(".kpi").count() === 4, "full meeting unlocks advanced KPI cards");
  await expect(fullFromTrial.includes("刺激强度") && fullFromTrial.includes("泡沫指数"), "full meeting unlocks advanced KPIs");
  await expect(hasAiSource(fullFromTrial), "full meeting shows AI/local source badge");

  await page.goto(url);
  await clickAction("full-demo");
  await waitAiSource();
  const directFull = await text(".variant-layout");
  await expect(directFull.includes("议题 1 / 5"), "roadshow entry skips directly to a full meeting");
  await expect(hasAiSource(directFull), "roadshow entry shows AI/local source badge");

  await clickOption("stairs-vision");
  await waitStamp();
  const firstResult = await text(".result-panel");
  await expect(firstResult.includes("刺激强度 +13") && firstResult.includes("泡沫指数 +14"), "AI copy does not change local KPI deltas");

  await clickOption("cash-vision");
  await waitStamp();
  await clickOption("rest-vision");
  await waitStamp();
  await expect((await text(".audit-panel")).includes("预警: 泡沫指数"), "warning uses renamed KPI");
  await clickOption("abs-vision");
  await waitStamp();
  await expect((await text(".result-panel")).includes("泡沫审计 +1"), "crisis still triggers after danger persists");
  await clickOption("resume-comfort");
  await waitStamp();
  const finalRating = await text(".rating-card");
  await expect(finalRating.includes("部门 OKR 推进"), "rating shows OKR progress");
  await expect(finalRating.includes("泡沫审计 +1"), "rating carries current-round crisis risk");
  await expect(finalRating.includes("下轮:"), "rating shows next-round preview");
  await clickAction("report");
  await expect((await text(".report-card")).includes("泡沫审计 +1"), "report summarizes session risks and crises");

  return log.join("\n");
}
