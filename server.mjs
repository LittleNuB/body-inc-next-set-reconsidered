import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticRoot = path.join(__dirname, "prototype-proof-of-fun");
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 8765);
const deepseekUrl = "https://api.deepseek.com/chat/completions";
const deepseekModel = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";
const defaultKeyFile = "C:\\Users\\LittleNub\\Desktop\\Key.txt";

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png"
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${host}:${port}`);
    if (req.method === "POST" && url.pathname === "/api/ai-secretary") {
      await handleAiSecretary(req, res);
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      sendJson(res, 405, { ok: false, reason: "method_not_allowed" });
      return;
    }

    await serveStatic(url, res, req.method === "HEAD");
  } catch (error) {
    sendJson(res, 500, { ok: false, reason: "server_error" });
  }
});

server.listen(port, host, () => {
  console.log(`Body Inc prototype: http://${host}:${port}/index.html?variant=B`);
});

async function handleAiSecretary(req, res) {
  const request = await readJsonBody(req);
  const key = await readDeepSeekKey();
  if (!key) {
    sendJson(res, 200, fallback("missing_key"));
    return;
  }

  const kind = request?.kind;
  const context = request?.context || {};
  if (kind !== "agenda" && kind !== "report") {
    sendJson(res, 200, fallback("invalid_kind"));
    return;
  }

  const prompt = kind === "agenda" ? buildAgendaPrompt(context) : buildReportPrompt(context);
  if (!prompt) {
    sendJson(res, 200, fallback("invalid_context"));
    return;
  }

  const completion = await callDeepSeek(key, prompt);
  if (!completion.ok) {
    sendJson(res, 200, fallback(completion.reason));
    return;
  }

  const content = completion.data?.choices?.[0]?.message?.content;
  const parsed = parseJsonContent(content);
  if (!parsed) {
    sendJson(res, 200, fallback("invalid_json"));
    return;
  }

  const sanitized = kind === "agenda" ? sanitizeAgendaResponse(parsed, context.agenda) : sanitizeReportResponse(parsed);
  if (!sanitized) {
    sendJson(res, 200, fallback("invalid_ai_payload"));
    return;
  }

  sendJson(res, 200, { ok: true, source: "ai", ...sanitized });
}

async function serveStatic(url, res, headOnly) {
  const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const file = path.resolve(staticRoot, `.${pathname}`);
  if (!file.startsWith(staticRoot)) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }

  try {
    const data = await fs.readFile(file);
    res.writeHead(200, {
      "content-type": contentTypes[path.extname(file)] || "application/octet-stream",
      "cache-control": "no-store"
    });
    if (!headOnly) res.end(data);
    else res.end();
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("not found");
  }
}

async function readJsonBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 128 * 1024) throw new Error("body_too_large");
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function readDeepSeekKey() {
  if (process.env.DEEPSEEK_API_KEY?.trim()) return cleanKey(process.env.DEEPSEEK_API_KEY);
  const keyFile = process.env.DEEPSEEK_KEY_FILE || defaultKeyFile;
  try {
    const raw = await fs.readFile(keyFile, "utf8");
    return cleanKey(raw);
  } catch {
    return "";
  }
}

function cleanKey(raw) {
  const line = String(raw)
    .split(/\r?\n/)
    .map((item) => item.trim())
    .find((item) => item && !item.startsWith("#"));
  if (!line) return "";
  const value = line.includes("=") ? line.slice(line.indexOf("=") + 1) : line;
  return value.trim().replace(/^["']|["']$/g, "");
}

function buildAgendaPrompt(context) {
  const agenda = Array.isArray(context.agenda) ? context.agenda : [];
  if (!agenda.length) return null;

  return {
    system: [
      "你是《下一组再议 / Body Inc.》的 AI 会议秘书。",
      "只输出 JSON，不要 Markdown，不要解释。",
      "使用中文，风格是公司财报黑话 + 健身荒诞。",
      "优先搞笑和拟人化，不要输出严肃咨询建议。",
      "不要输出医学建议，不要判断真实训练安全。",
      "不要给真实训练建议，不要提营养摄入、体脂率、HIIT、乳酸、真实重量或动作指导。",
      "不要提出用户应该执行的训练计划，不要写每天/每周/次数/重量/层数等数字目标。",
      "不要写伤痛、练断、受伤、腰、膝盖损伤等安全暗示。",
      "必须围绕传入的 speaker、proposal 和 option label 改写，不要把议题换成另一个训练计划。",
      "不要改变规则、数值、策略、评级、胜负、OKR 或风险。",
      "必须保留传入的 agenda id 和 option id。",
      "只允许改写 title、proposal、option reaction。",
      "json response shape: {\"agenda\":[{\"id\":\"...\",\"title\":\"...\",\"proposal\":\"...\",\"options\":[{\"id\":\"...\",\"reaction\":\"...\"}]}],\"secretaryNote\":\"...\"}"
    ].join("\n"),
    user: JSON.stringify({
      task: "rewrite_agenda_copy_as_json",
      constraints: {
        titleMaxChars: 18,
        proposalMaxChars: 80,
        reactionMaxChars: 90
      },
      context: {
        review: textLimit(context.review, 16),
        kpis: context.kpis || {},
        agenda: agenda.map((item) => ({
          id: item.id,
          speaker: item.speaker,
          title: item.title,
          proposal: item.proposal,
          options: Array.isArray(item.options)
            ? item.options.map((option) => ({
                id: option.id,
                strategy: option.strategy,
                label: option.label
              }))
            : []
        }))
      }
    })
  };
}

function buildReportPrompt(context) {
  return {
    system: [
      "你是《下一组再议 / Body Inc.》的 AI 财报秘书。",
      "只输出 JSON，不要 Markdown，不要解释。",
      "使用中文，风格是公司财报黑话 + 健身荒诞。",
      "优先搞笑和拟人化，不要输出严肃咨询建议。",
      "不要输出医学建议，不要判断真实训练安全。",
      "不要给真实训练建议，不要提营养摄入、体脂率、HIIT、乳酸、真实重量或动作指导。",
      "不要提出用户应该执行的训练计划，不要写每天/每周/次数/重量/层数等数字目标。",
      "不要写伤痛、练断、受伤、腰、膝盖损伤等安全暗示。",
      "不要改变评级、风险、KPI、OKR 或结算结果。",
      "只生成最大内耗事件 event 和 secretaryNote。",
      "json response shape: {\"event\":\"...\",\"secretaryNote\":\"...\"}"
    ].join("\n"),
    user: JSON.stringify({
      task: "rewrite_report_event_as_json",
      constraints: {
        eventMaxChars: 120
      },
      context: {
        rating: context.rating || {},
        kpis: context.kpis || {},
        riskTags: Array.isArray(context.riskTags) ? context.riskTags.slice(-8) : [],
        history: Array.isArray(context.history)
          ? context.history.slice(-6).map((item) => ({
              issue: item.issue,
              option: item.option,
              strategy: item.strategy,
              reaction: item.reaction
            }))
          : []
      }
    })
  };
}

async function callDeepSeek(key, prompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(deepseekUrl, {
      method: "POST",
      signal: controller.signal,
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: deepseekModel,
        thinking: { type: "disabled" },
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user }
        ],
        temperature: 0.9,
        max_tokens: 1400,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) return { ok: false, reason: `deepseek_${response.status}` };
    return { ok: true, data: await response.json() };
  } catch (error) {
    const reason = error?.name === "AbortError" ? "deepseek_timeout" : "deepseek_network";
    return { ok: false, reason };
  } finally {
    clearTimeout(timeout);
  }
}

function sanitizeAgendaResponse(value, baseAgenda) {
  const allowedAgenda = new Map((Array.isArray(baseAgenda) ? baseAgenda : []).map((item) => [item.id, item]));
  const result = [];
  for (const item of Array.isArray(value?.agenda) ? value.agenda : []) {
    const base = allowedAgenda.get(item?.id);
    if (!base) continue;

    const allowedOptions = new Set((base.options || []).map((option) => option.id));
    const options = [];
    for (const option of Array.isArray(item.options) ? item.options : []) {
      if (!allowedOptions.has(option?.id)) continue;
      const reaction = textLimit(option.reaction, 90);
      if (reaction) options.push({ id: option.id, reaction });
    }

    const title = textLimit(item.title, 18);
    const proposal = textLimit(item.proposal, 80);
    if (title || proposal || options.length) {
      result.push({
        id: item.id,
        ...(title ? { title } : {}),
        ...(proposal ? { proposal } : {}),
        ...(options.length ? { options } : {})
      });
    }
  }

  if (!result.length) return null;
  return {
    agenda: result,
    secretaryNote: textLimit(value.secretaryNote, 80) || "AI 会议秘书已根据本轮状态改稿。"
  };
}

function sanitizeReportResponse(value) {
  const event = textLimit(value?.event, 120);
  if (!event) return null;
  return {
    event,
    secretaryNote: textLimit(value.secretaryNote, 80) || "AI 会议秘书补充了财报摘要。"
  };
}

function parseJsonContent(content) {
  if (!content || typeof content !== "string") return null;
  try {
    return JSON.parse(content);
  } catch {
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;
    try {
      return JSON.parse(content.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

function textLimit(value, max) {
  if (typeof value !== "string") return "";
  const cleaned = value.replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim();
  if (hasForbiddenCopy(cleaned)) return "";
  return cleaned.slice(0, max);
}

function hasForbiddenCopy(value) {
  return /体脂|HIIT|蛋白|乳酸|kg|公斤|每天|每周|次数|重量|层|训练计划|营养|动作指导|练断|受伤|伤痛|损伤|老腰|腰|膝盖损伤|\d+\s*(次|层|kg|公斤|分钟)/i.test(value);
}

function fallback(reason) {
  return { ok: false, source: "fallback", reason };
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(JSON.stringify(payload));
}
