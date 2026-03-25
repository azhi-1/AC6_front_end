# AC6 Front Interface

基于 AC6 (Armored Core 6) 风格的酒馆助手前端状态栏界面。

## 功能特性

- **状态总览**：实时显示驾驶员HP/SP/珂若尔护盾/APM/神经同步率等状态
- **AC整备**：可交互的机甲装备管理，支持选择可用部件
- **通讯频道**：红颜联系人列表与关系进度展示
- **作战与行动**：任务面板与进度追踪

## 变量系统

界面与 MVU 变量系统完整咬合，自动同步酒馆中的游戏状态数据。

## 技术栈

- Vue 3 + TypeScript
- Pinia 状态管理
- SCSS 样式
- Rajdhani 字体

## 使用方式

1. 将 `src` 文件夹放入酒馆助手项目中
2. 使用 `pnpm build` 或 `pnpm dev` 构建
3. 打包后的文件在 `dist/` 目录

## 参考

- [酒馆助手文档](https://n0vi028.github.io/JS-Slash-Runner-Doc/)
- [实时编写前端界面教程](https://stagedog.github.io/青空莉/工具经验/实时编写前端界面或脚本/)
