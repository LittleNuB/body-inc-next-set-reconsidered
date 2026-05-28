# PRD: 《下一组再议》 / Body Inc.

## 1. Product Summary

**中文名**: 《下一组再议》

**英文名**: Body Inc.

**副标题**: 下一组前，先开个小会。

**一句话 Pitch**:

《下一组再议》是一款面向健身组间休息场景的 Web 手机竖屏 PWA。玩家扮演“肉身集团”的草台老板，每完成一组训练，身体各部门就召开一场约一分钟的组间小会。胸、腿、腹、背、肩、手臂、大脑、心肺等拟人部门轮流提出荒诞议题，玩家用画饼、发糖、打鸡血和本轮临时印章处理会议，把公司 KPI 调到“刚好能复工”的区间，然后进入下一组训练。

**核心体验目标**:

- 10 秒内开始第一次训练循环。
- 1 分钟左右完成一次组间小会。
- 3 分钟内体验“训练中 -> 本组业绩复盘 -> 组间小会 -> 复工评级 -> 今日肉身财报”的完整闭环。
- 首先是一款好玩的荒诞小游戏，其次兼顾组间休息计时和训练伴随。

## 2. Problem Statement

健身组间休息通常只有 30-120 秒。用户想短暂分散注意力，但又不希望被短视频或社交软件吞掉时间，导致休息过长、训练节奏断掉。现有健身工具偏记录和计划，游戏又很少真正适配“刚练完一组、手上有汗、只想轻松玩一分钟”的场景。

比赛主题要求“1 分钟小游戏”，并鼓励抽象、反常识、结合 AI 的新玩法。我们要做的不是普通倒计时游戏，也不是健身工具，而是把组间休息这一分钟变成一个有闭环、有笑点、有轻策略的游戏单位。

## 3. Solution

将身体抽象成一家草台公司“肉身集团”，健身是公司发展，身体部位是部门员工。每组训练结束后，公司必须召开一次“组间小会”，决定是否能进入下一组。

玩家在组间小会中处理身体部门的荒诞发言。每次处理都会影响四个状态型 KPI。它们不是资源存量，而更像体温、转速、压力表，太低会垮，太高会失控，中间才是 **可复工区**:

- **供氧周转**: 对应氧气、恢复资源、心肺余量的运转状态。
- **动员温度**: 对应肌肉配合度、身体愿不愿意继续练。
- **刺激强度**: 对应泵感、训练刺激、进步感。
- **泡沫指数**: 对应借口、摸鱼、自我欺骗、虚假繁荣。

这四个指标都不是越高越好，而是要在小会结束时落入中间的 **可复工区**。系统给出复工评级，但不阻止用户真实训练。用户可以进入下一组、提前复工、延长休息或今日歇业。

AI 扮演“会议秘书”，根据训练部门、本组业绩复盘、当前 KPI 和历史事件生成议题文案、临时印章文案和肉身财报段子。核心规则、数值、胜负判断由本地规则控制。

## 4. Product Principles

1. **好玩第一，功能第二**  
   它不是训练记录 App，而是一款贴合健身场景的荒诞小游戏。

2. **垂直场景优先**  
   不做泛娱乐场景入口。首发明确服务健身组间休息。

3. **轻操作**  
   用户刚练完一组，可能手抖、出汗、喘气。交互必须一指完成，不能要求高强度操作。

4. **一分钟是制度，不是皮肤**  
   标准模式是 60 秒组间小会。休息时间决定议题数量和摸鱼风险。

5. **规则稳定，AI 负责嘴**  
   AI 不生成核心数值和胜负规则，只生成受约束的荒诞文本。

6. **不做医学判断**  
   所有指标都是游戏内隐喻，不判断真实心率、血氧、疲劳或安全状态。

## 5. Target Users

### Core Users

健身房力量训练的新手到中级玩家，尤其是有组间休息习惯、每组之间容易刷手机、但又希望保持训练节奏的人。

### Extended Users

居家健身、HIIT、跳绳、跑步间歇、自重训练等所有有“训练一段 -> 休息一段 -> 继续训练”节奏的人。

### User Emotion

用户不是来接受纪律教育的，而是处在:

- 刚练完，累，但还没结束。
- 想放松一下，但不想彻底摆烂。
- 想被逗笑，而不是再进入一个高压任务系统。

## 6. Core Loop

### Full Session Loop

1. 用户打开游戏。
2. 选择今日主练部门。
3. 选择默认组间休息时间。
4. 点击 **试营业 30 秒** 或 **直接开完整小会**。
5. 默认进入 **初创期试营业**；路演入口可直接进入完整小会。
6. 用户完成真实一组训练后点击 **完成本组**。
7. 进行 **本组业绩复盘**。
8. 进入组间小会。
9. 小会结束后获得复工评级。
10. 用户选择 **进入下一组**、**延长休息** 或 **今日歇业**。
11. 多轮后点击 **今日歇业**，生成 **今日肉身财报**。
12. 训练结束后可选择稍后设置部门长期里程碑。

### One Rest Round Loop

1. 系统根据休息时间确定议题数量。
2. 身体部门轮流发言，提出议题。
3. 玩家使用固定印章或临时印章处理议题。
4. KPI 仪表跳动，角色和会议室给出反馈。
5. 议题处理完或时间结束后，系统检查四个 KPI 是否处于可复工区。
6. 输出复工评级和一句会议纪要。

## 7. First-Time Experience

首局不要要求用户设置长期里程碑。入口必须轻。

默认首局采用 **初创期 / 试营业 30 秒**，而不是直接展示完整系统。试营业只显示两个指标：**供氧周转** 和 **动员温度**；只提供两个动作类型：**安抚型** 和 **推进型**。它只教一件事：绿色中间区间才是可复工窗口，不是把指标拉满。

路演或熟练玩家可以从首页点击 **直接开完整小会**，跳过试营业，进入 60 秒完整玩法。

### Opening Flow

1. 标题页:
   - 《下一组再议》
   - Body Inc.
   - 下一组前，先开个小会。

2. 选择今日主练部门:
   - 胸部事业部
   - 腿部事业群
   - 腹部传说部
   - 背部基建部
   - 肩部形象部
   - 手臂门面部

3. 选择默认组间休息:
   - 30 秒
   - 45 秒
   - 60 秒，默认，高亮为标准小会
   - 90 秒

4. 点击:
   - **试营业 30 秒**
   - 次入口: **直接开完整小会**

5. 默认进入试营业小会:
   - `初创期试营业`
   - `先活下来 · 两项进绿区`
   - 完成后可选择 **进入完整小会** 或 **今日歇业**

6. 完整训练中:
   - `第 1 组业务冲刺中`
   - 大按钮: **完成本组**
   - 次入口: **今日歇业**

## 8. Training-In-Progress State

点击 **进入下一组** 后，游戏必须退到低干扰状态。

### Requirements

- 不显示小游戏。
- 不要求用户操作。
- 只保留大按钮 **完成本组**。
- 可显示少量世界观状态文案，例如:
  - `胸部事业部正在执行业务冲刺`
  - `心肺财务部供氧周转快速燃烧中`
  - `大脑战略部正在准备下一轮借口材料`

### Backend Narrative State

训练中阶段不做真实监测，但会根据上轮会议结果积累下一轮议题种子:

- 画饼多 -> 下轮泡沫指数类议题增加。
- 发糖多 -> 下轮供氧周转压力增加但动员温度稳定。
- 打鸡血多 -> 下轮刺激强度上升，同时心肺/过载类议题增加。
- 提前复工 -> 下轮供氧周转偏低。
- 延长休息 -> 泡沫指数自然上升。

## 9. Set Review

用户点击 **完成本组** 后，出现一个极轻量的世界观反馈。

标题:

**本组业绩如何？**

选项:

- **超额完成**: 这组很轻松，甚至有点膨胀。
- **正常交付**: 刚刚好，符合预期。
- **濒临破产**: 累得不行，但还活着。
- **疑似注水**: 感觉练了，但身体不认账。

选择后立即进入组间小会。

## 10. Rest Meeting Mechanics

### Rest Duration To Agenda Count

休息时长决定小会议题数量:

- 30 秒: 3 个议题，迷你碰头会。
- 45 秒: 4 个议题，快速同步。
- 60 秒: 5 个议题，标准组间小会。
- 90 秒: 7 个议题，加长会。

如果未来支持 120 秒，则可扩展为 9 个议题，离谱大会。

### Agenda Structure

议题数量变化，但 60 秒标准小会建议保留类似起承转合:

1. 目标训练部门发言。
2. 心肺/资源部门发言。
3. 大脑战略部发言。
4. 随机身体部门插话。
5. 复工前最终决议。

对于 3/4/7 个议题，按上述结构裁剪或扩展。

### Decision Tools

每轮有四枚印章:

#### Fixed Stamps

- **画饼**
  - 基本气质: 提升刺激强度预期，推高泡沫指数。
  - 文案感: 老板又开始讲愿景。

- **发糖**
  - 基本气质: 安抚部门、提升动员温度，消耗供氧周转。
  - 文案感: 给员工一点甜头。

- **打鸡血**
  - 基本气质: 提升刺激强度或短期复工意愿，可能伤动员温度或推高泡沫指数。
  - 文案感: 靠情绪燃料继续冲。

#### Temporary Stamp

每轮生成一枚临时印章，可限次使用或仅一次使用。示例:

- 甩锅
- 团建
- 静音
- 融资
- 开摆五秒
- 强制复工
- 请外援

临时印章由规则选择类型，AI 可生成更有梗的名字和说明。

### Hidden Effects

盖章前不显示具体数值，也不显示方向。玩家根据语义和当前 KPI 自己猜。

盖章后立即解释后果，例如:

- `画饼成功: 刺激强度曲线抬头，泡沫指数也开始鼓掌。`
- `发糖成功: 腿部事业群停止拍桌，但供氧周转少了一截。`
- `打鸡血成功: 胸部事业部动员温度暴涨，心肺财务部开始翻白眼。`

没有固定最佳解。同一议题在不同 KPI 状态下适合不同印章。

## 11. KPI System

### KPI Names

- **供氧周转**
- **动员温度**
- **刺激强度**
- **泡沫指数**

### Rule

四个 KPI 都追求中间的 **可复工区**，不是越高越好。命名必须保持“状态仪表”感，避免用户按常识理解成越多越好的资源。

三段式解释:

- 供氧周转: 断供 / 可复工 / 烧穿
- 动员温度: 摆烂 / 可复工 / 上头
- 刺激强度: 摸鱼 / 可复工 / 过载
- 泡沫指数: 没信念 / 可复工 / 画太大

### Visual Requirements

采用 **明确仪表负责可读性，会议室环境负责氛围反馈** 的原则。

#### Readable Layer

会议桌上固定摆放四个 KPI 立牌仪表:

- 大图标
- 中文名
- 指针或刻度
- 明确标出中间的 **可复工区**
- 危险低区和危险高区清楚可见

#### Atmosphere Layer

会议室环境随 KPI 变化:

- 泡沫指数高: 会议室出现泡泡、浮夸投影、愿景标语。
- 供氧周转低: 心肺财务部喘气，账本变红。
- 动员温度低: 角色趴桌、席位灯变暗。
- 刺激强度高: 曲线冲得过猛，图表开始抖动。

## 12. Rest Meeting Rating

一轮小会结束后给出 4 档复工评级:

1. **完美复工**
   - 四项基本落入可复工区。
   - 示例文案: `肉身集团罕见达成共识。`

2. **勉强复工**
   - 大部分在区间，少量偏离。
   - 最常见，也是游戏气质核心。
   - 示例文案: `没人满意，但都能上。`

3. **建议缓一缓**
   - 偏离明显，建议延长休息或降低下一组强度。
   - 示例文案: `心肺财务部要求追加预算。`

4. **会议失控**
   - 指标严重失衡，但不阻止用户继续。
   - 示例文案: `大脑战略部宣布接管休息权。`

系统只给游戏化建议。用户永远可以进入下一组、延长休息或今日歇业。

## 13. Extend Or Resume

### 延长休息

延长休息不是免费续命。

规则:

- 用户可延长 15 或 30 秒。
- 延长会追加 1-2 个临时议题。
- 泡沫指数自然上涨。
- 大脑战略部更容易插话。

示例:

`大脑战略部: 既然老板决定延长会议，我准备了一个 12 页补充汇报。`

### 提前进入下一组

提前复工必须允许，因为真实训练优先。

规则:

- 不阻止。
- 不硬扣分。
- 记录为“仓促复工”因果。
- 下一轮更容易出现供氧周转或动员温度问题。
- 今日财报可体现为 `供氧紧张型冲刺` 等标题。

## 14. Daily Shutdown And Report

### Entry

结束训练入口不叫“结束训练”，叫:

**今日歇业**

点击后由大脑战略部做轻确认:

`大脑战略部: 确定今天就关门算账？`

按钮:

- **继续开练**
- **收工结算**

### Meat Report

训练结束后生成 **今日肉身财报**。

财报结构:

1. **标题评级**
   - 规则控制，不由 AI 自由生成。
   - 风格统一为公司财报黑话 + 健身荒诞。

2. **训练摘要**
   - 完成几组。
   - 开了几次组间小会。
   - 平均复工评级。

3. **部门表现**
   - 今日主练部门一句话总结。

4. **最大内耗事件**
   - 从会议历史中挑选最离谱事件。

5. **长期里程碑入口**
   - 如果没有目标: 提醒是否为部门设立大饼。
   - 如果有目标: 关联长期目标，生成调侃式进度反馈。

### Title Rating Examples

标题评级由规则根据 KPI 和行为组合生成。示例:

- `勉强复工型刺激`
- `泡沫驱动型训练`
- `供氧紧张型冲刺`
- `动员透支型交付`
- `画饼续命型复工`
- `战略摸鱼型恢复`
- `虚假繁荣型泵感`
- `濒临破产型腿日`
- `低质量高意志训练`
- `大脑接管型休息`

## 15. Milestones

长期目标为主，今日目标为辅。

### First Use

首次不要求设置里程碑，避免入口过重。

### After First Completed Training

在肉身财报后提醒用户可设置部门长期目标:

`要不要给这个部门立个大饼？`

示例:

- 胸部事业部: 卧推 100kg x 1。
- 腿部事业群: 深蹲 180kg x 2。
- 腹部传说部: 能看到腹肌了。

里程碑由用户自定。游戏不验证真假，只用于叙事、回顾和长期陪伴。

## 16. Visual Direction

### Core Scene

玩家以老板第一人称坐在长条会议桌尽头。身体部门坐在会议桌两侧，轮流发言。当前发言部门被放大或高亮，并把提案推到桌面中央。

玩家不直接操作角色，而是在桌面中央处理提案:

- 盖章
- 发糖
- 倒鸡血咖啡
- 使用临时工具

### Character Style

身体部位拟人。

风格原则:

- 荒诞，不恶心。
- 可爱，不幼稚。
- 造型可爱，但表情和台词是成年人崩溃。
- 身体部位长出眼睛、嘴、领带、工牌，坐在会议桌旁认真开会。

### Character Asset List

首版 8 个独立资产:

1. **胸部事业部**
   - 自信过度的胸肌。
   - 西装扣子快崩开。

2. **腿部事业群**
   - 一双疲惫的大腿。
   - 戴安全帽，膝盖贴创可贴。

3. **腹部传说部**
   - 若隐若现的腹肌方块。
   - 戴“试用员工”工牌。

4. **背部基建部**
   - 宽大的背肌。
   - 喜欢背对镜头发言。

5. **肩部形象部**
   - 两个垫肩一样的三角肌。
   - 特别在意上镜角度。

6. **手臂门面部**
   - 弯曲的二头肌。
   - 拿自拍杆和业绩曲线。

7. **大脑战略部**
   - 戴眼镜的脑子。
   - 永远带 PPT。

8. **心肺财务部**
   - 心脏和肺挤在一个 CFO 席位。
   - 一个跳太快，一个喘不过气。

### UI Scene Composition

竖屏手机布局:

- 顶部: 休息倒计时、当前组数、会议状态。
- 中上: 长条会议桌和身体部门席位。
- 中央: 当前议题提案纸。
- 底部: 三枚固定印章 + 一枚临时印章。
- 侧边或桌边: 四个 KPI 立牌仪表。

桌面工具要有强反馈:

- 盖章 “啪”。
- 屏幕短震。
- 印章墨迹随机偏移。
- 文件抖动或被盖上大字。
- 部门角色即时吐槽。

## 17. Audio And Haptics

音效和震动是核心反馈，但必须轻。

MVP 建议:

- 盖章: 短震 + 啪声。
- KPI 进入可复工区: 轻快提示。
- 时间到: 两段震动。
- 会议失控: 低频短音。
- 进入下一组: 清脆复工铃。

需要提供静音和震动开关。

## 18. AI Integration

### AI Role

AI 是“会议秘书”。

它根据以下上下文生成文本:

- 今日主练部门。
- 本组业绩复盘。
- 当前 KPI 状态。
- 上轮会议因果。
- 已出现过的议题。
- 本轮临时印章。

### AI Generates

1. **组间小会议题文案**
   - 部门发言。
   - 提案内容。
   - 角色吐槽。

2. **临时印章文案**
   - 本轮特殊老板权限名称。
   - 使用反馈。

3. **肉身财报段子**
   - 部门表现。
   - 最大内耗事件总结。
   - 里程碑调侃。

### AI Does Not Generate

- 核心规则。
- KPI 数值变化。
- 复工评级。
- 胜负判断。
- 安全建议。

### Suggested Structured Output

```json
{
  "speaker": "腿部事业群",
  "proposal": "我们认为楼梯业务应从公司主营业务中剥离。",
  "reactions": {
    "画饼": "腿部事业群勉强接受了上市叙事。",
    "发糖": "腿部事业群停止拍桌，但供氧周转肉眼可见地瘦了。",
    "打鸡血": "腿部事业群宣布冲刺基建奇迹，心肺财务部开始冒汗。",
    "临时印章": "本议题被甩给膝盖风控委员会，会议室短暂安静。"
  }
}
```

系统只取文本字段。数值效果由本地规则根据 stamp type、current KPI、training department 和 session history 计算。

### Fallback

必须准备本地模板池，确保 API 不稳定时仍可完整试玩。

## 19. Technical Product Requirements

### Platform

- Web 手机竖屏 PWA。
- 扫码即玩。
- 不需要登录。
- localStorage 或 IndexedDB 保存本地状态。
- 桌面可打开，但只优化手机竖屏。
- 桌面展示居中手机壳预览。
- 横屏提示旋转手机。

### Local Persistence

保存:

- 最近训练部门。
- 默认休息时间。
- 今日 session。
- 可选部门里程碑。
- 最近肉身财报。

### Suggested Modules

1. **Session State Machine**
   - 管理 opening、training、setReview、meeting、rating、shutdown、report 等状态。
   - 深模块，适合单元测试。

2. **KPI Engine**
   - 处理 KPI 初始化、印章效果、可复工区判断、复工评级。
   - 规则必须可测试、可调参。

3. **Agenda Generator**
   - 根据部门、休息时长、业绩复盘、历史因果生成议题槽位。
   - 支持 AI 文案和本地 fallback。

4. **AI Text Adapter**
   - 封装 AI 请求、结构化输出校验、失败回退。
   - 不暴露数值控制权。

5. **Report Generator**
   - 根据 session 历史生成规则标题评级和财报结构。
   - AI 只参与段子填充。

6. **Asset/Character Registry**
   - 管理部门、角色资产、默认文案、席位、徽章。

7. **Haptics/Audio Controller**
   - 统一管理震动、音效、静音设置。

## 20. MVP Scope

### Must Have

- 手机竖屏 Web PWA 基础体验。
- 6 个主练部门选择。
- 30/45/60/90 秒休息时间选择。
- 训练中页面。
- 本组业绩复盘。
- 组间小会。
- 3 枚固定印章 + 1 枚临时印章。
- 四个 KPI 仪表，带可复工区。
- 4 档复工评级。
- 进入下一组、延长休息、今日歇业。
- 今日肉身财报。
- 本地模板 fallback。
- 基础音效/震动反馈。
- 8 个身体部门独立视觉资产。

### Should Have

- AI 生成会议文案。
- AI 生成财报段子。
- 临时印章由 AI 润色。
- 桌面手机壳预览。
- 本地保存今日 session。

### Could Have

- 部门长期里程碑编辑。
- 最近财报回看。
- 分享图生成。
- 小红书友好截图模式。
- 更多休息时长。
- 更多临时印章。

## 21. Out Of Scope For MVP

- 真实登录和云同步。
- 接入 Apple Watch、心率带、摄像头、姿态识别。
- 真实训练安全判断。
- 完整健身计划管理。
- 重量、次数、RPE 的正式记录系统。
- 多日长期养成系统。
- 排行榜。
- 多人会议。
- 横屏优化。
- App Store / 小程序正式发布。

## 22. User Stories

1. As a first-time player, I want to understand the premise within a few seconds, so that I can start playing without reading instructions.
2. As a gym user, I want to choose my training department quickly, so that the game matches what I am training today.
3. As a gym user, I want to choose a default rest duration, so that the game fits my real rest rhythm.
4. As a gym user, I want the game to become quiet while I train, so that it does not distract me during a set.
5. As a gym user, I want one big button to mark a set complete, so that I can operate it with sweaty hands.
6. As a player, I want to give a quick world-building review of my set, so that the next meeting feels personalized.
7. As a player, I want body departments to raise absurd issues, so that the rest period feels funny and fresh.
8. As a player, I want to handle issues with simple stamps/tools, so that I can play with one finger.
9. As a player, I want hidden consequences that are explained after the choice, so that decisions feel surprising but learnable.
10. As a player, I want KPI instruments that clearly show the target zone, so that I know what I am trying to achieve.
11. As a player, I want decisions to affect future rounds, so that the game does not feel like reading random jokes.
12. As a player, I want the game to end a meeting around my selected rest time, so that it supports real training.
13. As a player, I want to extend rest when needed, so that real recovery takes priority.
14. As a player, I want extending rest to create funny extra consequences, so that it feels like part of the game.
15. As a player, I want to start the next set early if I am ready, so that the game never blocks my workout.
16. As a player, I want early restart to be remembered narratively, so that the body company feels reactive.
17. As a player, I want a funny复工评级 after each meeting, so that each rest round has closure.
18. As a player, I want to end today's training anytime, so that the game respects real life.
19. As a player, I want the end action to feel like part of the world, so that the experience remains playful.
20. As a player, I want a meat report after training, so that my session has a satisfying payoff.
21. As a player, I want title ratings in a consistent funny style, so that reports feel collectible.
22. As a returning player, I want my recent department and rest time remembered, so that I can start faster.
23. As a returning player, I want optional long-term milestones, so that my body company can have persistent goals.
24. As a player, I want no login requirement, so that I can scan and play immediately.
25. As a competition judge, I want to see AI clearly contributing to the experience, so that the project satisfies the AI theme.
26. As a developer, I want AI output constrained to text, so that gameplay remains stable.
27. As a developer, I want local templates as fallback, so that the demo works even if AI fails.

## 23. Testing Decisions

### Good Tests

Tests should verify external behavior and game rules, not implementation details or animation internals.

### Priority Test Areas

1. **Session State Machine**
   - Starting a session.
   - Completing a set.
   - Entering set review.
   - Starting a meeting.
   - Entering next set.
   - Ending today.

2. **KPI Engine**
   - Stamp effects remain deterministic.
   - KPI values stay within allowed bounds.
   - Rating generation matches KPI positions.
   - All four KPI target middle可复工区, not max values.

3. **Rest Duration Mapping**
   - 30 sec -> 3 issues.
   - 45 sec -> 4 issues.
   - 60 sec -> 5 issues.
   - 90 sec -> 7 issues.

4. **Extension And Early Restart**
   - Extend adds agenda items and泡沫指数 risk.
   - Early restart records仓促复工 cause.

5. **Report Generator**
   - Title rating is rule-based.
   - Report includes summary, department performance,最大内耗事件, and milestone prompt.

6. **AI Adapter**
   - Rejects malformed AI responses.
   - Falls back to local templates.
   - Never accepts AI-generated numerical effects.

### Manual QA

- iPhone-sized viewport.
- Android-sized viewport.
- Desktop centered phone preview.
- Low network/API failure mode.
- Silent mode/haptics off.
- One-handed operation.
- 60-second standard meeting flow.

## 24. Hackathon Build Priorities

### Priority 0: Playable Core

- Session loop.
- KPI engine.
- Meeting flow.
- Stamps.
- Rating.
- Basic report.

### Priority 1: Visual Identity

- Long meeting table scene.
- 8 body department assets.
- KPI desk instruments.
- Stamp interactions.

### Priority 2: AI Flavor

- AI-generated agenda text.
- AI-generated temporary stamp labels.
- AI-assisted report paragraphs.
- Local fallback templates.

### Priority 3: Polish

- Haptics.
- Audio.
- Motion.
- Shareable report screen.
- Desktop phone preview.

## 25. Open Questions

1. Exact visual asset production pipeline:
   - AI-generated raster assets, hand-drawn assets, or hybrid?

2. Exact KPI numeric ranges:
   - Suggested 0-100, with可复工区 initially around 40-70, but needs playtesting.

3. Temporary stamp balance:
   - Should temporary stamps be once per round or reusable with cooldown?

4. AI latency:
   - Should agenda text be generated at meeting start, during training state, or preloaded from templates first?

5. Share format:
   - Should肉身财报 be exportable as an image for小红书?

## 26. Handoff Notes

The strongest version of this concept is not “a fitness timer with jokes” and not “Reigns with a gym skin.” The distinctive product is:

> A real-time rest companion where every set of training creates a tiny body-company meeting, and the player must steer a ridiculous organization back into a just-good-enough state before the next set.

The game should feel light, funny, and reactive. The player should not feel like they are doing more work during rest. The “company” metaphor exists to make the body argue with itself, not to create a serious productivity system.

The most important failure mode to avoid:

> The game becomes a sequence of funny text cards with meaningless choices.

Every decision needs visible feedback now and causal residue later.

