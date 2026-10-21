# Tailwind、shadcn/ui 与本地 MediaPipe 迁移设计

## 背景

当前 AirString Studio 的视觉效果主要由单个大型 `src/styles.css` 完成，虽然项目已安装 Tailwind CSS，但界面没有实际使用 Tailwind utilities，也没有 shadcn/ui 组件层。MediaPipe WASM 与 Hand Landmarker 模型仍从境外第三方地址加载，在中国大陆网络环境中可能无法启动。

## 目标

- 保留当前暖色音乐工作室视觉、响应式结构和全部既有交互。
- 使用 Tailwind CSS utilities 完成布局、色彩、排版、间距和状态样式。
- 建立符合 shadcn/ui 约定的 `cn` 工具和基础组件，将按钮、滑杆、开关、弹出菜单等交互控件迁移到该组件层。
- 将 MediaPipe WASM 与 Hand Landmarker 模型作为仓库静态资源发布，运行时不访问第三方 CDN。
- 开发环境、GitHub Pages 子路径和生产构建均能正确解析本地资源。
- 更新中文 README，明确本地模型、仓库体积和部署注意事项。

## 非目标

- 不重新设计视觉语言。
- 不改变手势、和弦、音频和练习逻辑。
- 不引入后端或模型代理服务。
- 不保留境外 CDN 作为自动回退；网络不可用时也必须从本站资源启动。

## UI 架构

- Tailwind 主题扩展现有颜色：forest、bone、paper、terra、lime、line、muted。
- Manrope 与 Playfair Display 通过 Fontsource 的 Latin 子集打包进站点，不再从 Google Fonts 远程加载；中文使用本地系统字体。
- 创建 `src/lib/utils.ts`，通过 `clsx` 和 `tailwind-merge` 提供 `cn()`。
- 创建 `src/components/ui/` 下的 shadcn/ui 基础组件，包括 Button、Slider、Switch、Dropdown Menu 和 Dialog；交互组件使用对应 Radix UI primitive。
- 业务组件仅组合基础组件和 Tailwind class，不重复实现通用控件状态。
- `src/styles.css` 仅保留 Tailwind directives、CSS 变量、浏览器基础规则、摄像头镜像/画布层叠和必要关键帧；不再承担页面布局。

## 本地模型资源

- 将 `@mediapipe/tasks-vision/wasm` 所需文件复制到 `public/mediapipe/wasm/`。
- 将 `hand_landmarker.task` 固定存放为 `public/mediapipe/models/hand_landmarker.task`。
- 使用 `import.meta.env.BASE_URL` 拼接 WASM 和模型路径，兼容 `/` 与 GitHub Pages `/air-string/`。
- 增加资源存在性与 URL 生成测试，构建后检查 `dist/mediapipe/` 完整存在。
- 模型文件直接纳入部署产物，首次加载不依赖 npm、Google Storage 或 jsDelivr。

## 验收标准

- 浏览器 Network 中没有 MediaPipe 相关第三方请求。
- `src/styles.css` 不再包含业务页面的大段布局样式。
- 页面按钮、滑杆、开关、曲目菜单和教程弹窗来自 `src/components/ui/` 的 shadcn/ui 组件。
- 当前页面在桌面和窄屏下保持现有功能与视觉层级。
- 摄像头启动、关键点开关、停止演奏、和弦切换、练习菜单、中英文切换均正常。
- 类型检查、测试、Lint、生产构建通过。
