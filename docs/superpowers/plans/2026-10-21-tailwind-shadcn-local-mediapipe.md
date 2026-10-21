# Tailwind、shadcn/ui 与本地 MediaPipe 迁移实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有界面迁移到 Tailwind CSS + shadcn/ui 组件体系，并使 MediaPipe WASM 与手部模型完全从本站静态资源加载。

**Architecture:** 以 `src/components/ui` 作为无业务状态的 shadcn 风格基础组件层，现有业务组件通过 Tailwind utilities 组合。MediaPipe 资源放入 `public/mediapipe`，配置模块使用 `import.meta.env.BASE_URL` 生成部署安全的本地 URL。

**Tech Stack:** React 19、TypeScript、Tailwind CSS 3、Radix UI、class-variance-authority、clsx、tailwind-merge、MediaPipe Tasks Vision、Vitest、Testing Library。

**Spec:** `docs/superpowers/specs/2026-10-21-tailwind-shadcn-local-mediapipe-design.md`

## Global Constraints

- 保留当前视觉语言、功能和中英文文案，不重新设计产品。
- 运行时不得请求 Google Storage、jsDelivr 或其他 MediaPipe CDN。
- 所有资源路径必须兼容根路径与 GitHub Pages `/virtual-guitar/` 子路径。
- 业务布局与控件样式使用 Tailwind utilities；全局 CSS 只保留基础变量、画布层叠和关键帧。
- 每个任务遵循测试先行，最终执行完整 typecheck、test、lint、build 和浏览器验证。

## Review Focus

- GitHub Pages 子路径：模型与 WASM URL 必须包含 `BASE_URL`，由资源 URL 单元测试覆盖。
- 离线/大陆网络：构建产物必须包含模型和所有 WASM loader 文件，由构建产物检查覆盖。
- Radix 弹层：练习菜单在窄屏、键盘操作和点击外部时正确关闭，由组件测试覆盖。
- 摄像头画布：Tailwind 迁移后 video/canvas 镜像、绝对定位和关键点覆盖顺序保持正确，由浏览器检查覆盖。
- 样式迁移回归：桌面与窄屏下控件不溢出，停止按钮和调试面板仍可用，由浏览器交互检查覆盖。

---

### Task 1: 本地 MediaPipe 资源与 URL

**Files:**

- Create: `public/mediapipe/wasm/*`
- Create: `public/mediapipe/models/hand_landmarker.task`
- Create: `src/config/mediapipeAssets.test.ts`
- Modify: `src/config/gesture.ts`
- Modify: `src/lib/mediapipe/handLandmarker.ts`

**Interfaces:**

- Produces: `getMediaPipeAssetUrls(baseUrl?: string): { wasmUrl: string; modelUrl: string }`
- Consumes: `import.meta.env.BASE_URL`

- [ ] **Step 1: Write the failing URL tests**

测试根路径输出 `/mediapipe/...`，子路径 `/virtual-guitar/` 输出 `/virtual-guitar/mediapipe/...`，且结果不包含 `http`。

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm test -- --run src/config/mediapipeAssets.test.ts`

- [ ] **Step 3: Implement URL generation and switch HandLandmarker to local assets**

新增纯函数并由 `createHandLandmarker()` 使用，不提供 CDN 回退。

- [ ] **Step 4: Copy package WASM files and download the pinned model**

复制 `node_modules/@mediapipe/tasks-vision/wasm/*`；下载当前固定版本 `hand_landmarker/float16/1` 模型，记录来源和文件大小。

- [ ] **Step 5: Verify focused tests and static files**

Run: `pnpm test -- --run src/config/mediapipeAssets.test.ts`

检查 `public/mediapipe/models/hand_landmarker.task` 非空且 WASM loader/二进制成对存在。

### Task 2: shadcn/ui 基础设施

**Files:**

- Create: `components.json`
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/slider.tsx`
- Create: `src/components/ui/switch.tsx`
- Create: `src/components/ui/dropdown-menu.tsx`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `tailwind.config.js`
- Modify: `src/styles.css`

**Interfaces:**

- Produces: `cn()`, `Button`, `Slider`, `Switch`, `DropdownMenu*`

- [ ] **Step 1: Add focused component behavior tests**

覆盖 Button variant、Slider value change、Switch checked change、Dropdown menu keyboard/click selection。

- [ ] **Step 2: Verify RED**

Run the new UI component test files and confirm missing modules/components fail.

- [ ] **Step 3: Install shadcn runtime dependencies and create configuration**

安装 `class-variance-authority`、`clsx`、`tailwind-merge`、`tailwindcss-animate` 和所需 Radix primitives；配置 aliases、主题色和动画插件。

- [ ] **Step 4: Implement the base components**

遵循 shadcn/ui 的可组合 API，并使用项目主题 token，不在基础组件中写业务文案。

- [ ] **Step 5: Run component tests**

Run focused UI tests; expected PASS.

### Task 3: 业务组件 Tailwind/shadcn 迁移

**Files:**

- Modify: `src/App.tsx`
- Modify: `src/components/camera/CameraView.tsx`
- Modify: `src/components/music/ChordInspector.tsx`
- Modify: `src/components/music/ChordPads.tsx`
- Modify: `src/components/music/PracticeRail.tsx`
- Modify: `src/components/music/ChordDiagram.tsx`
- Modify: `src/components/music/GestureGlyph.tsx`
- Modify: `src/components/DebugPanel.tsx`
- Modify: `src/components/tutorial/TutorialDialog.tsx`
- Modify: `src/styles.css`

**Interfaces:**

- Consumes: Task 2 UI primitives and `cn()`.
- Preserves: existing public component props and user-visible behavior.

- [ ] **Step 1: Run existing component tests as a behavior baseline**

Run: `pnpm test -- --run src/components`

- [ ] **Step 2: Migrate interactive controls to shadcn primitives**

Button、Slider、Switch、练习 Dropdown 与 Dialog 优先迁移，保持 accessible names 和 callbacks。

- [ ] **Step 3: Migrate layout and presentation to Tailwind utilities**

逐组件替换 class selectors；`styles.css` 仅留下 Tailwind layers、root variables、camera media layering 和 strum keyframes。

- [ ] **Step 4: Run component tests and fix regressions**

Run: `pnpm test -- --run src/components`

- [ ] **Step 5: Check CSS boundary**

确认 `styles.css` 不再定义 header、workspace、inspector、pads、practice rail 等业务布局选择器。

### Task 4: 文档、完整验证与浏览器 QA

**Files:**

- Modify: `README.md`
- Verify: `dist/mediapipe/**`

**Interfaces:**

- Consumes: Tasks 1–3 completed app.

- [ ] **Step 1: Update Chinese README**

删除第三方 CDN 描述，说明模型体积、本地资源目录、Pages base 路径和部署产物。

- [ ] **Step 2: Run full verification**

Run: `pnpm typecheck && pnpm test && pnpm lint && pnpm build`

- [ ] **Step 3: Verify build assets**

确认 `dist/mediapipe/models/hand_landmarker.task` 与 `dist/mediapipe/wasm/*` 存在；搜索 `dist/assets/*.js` 不包含 Google Storage/jsDelivr 模型 URL。

- [ ] **Step 4: Browser QA**

在真实浏览器检查自由弹奏、练习菜单、音量/速度、关键点开关、调试面板、停止按钮和中英文切换；Network 验证模型和 WASM 均来自当前 origin。

- [ ] **Step 5: Final review**

独立审阅 Tailwind/shadcn 使用是否真实、是否残留第三方运行时依赖、是否存在交互或响应式回归。
