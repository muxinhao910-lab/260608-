import type { ElementRegistryItem, WebBuilderElementType } from "@/types/webBuilder";

export const elementRegistry: Record<WebBuilderElementType, ElementRegistryItem> = {
  Heading: {
    labelZh: "标题",
    description: "页面上的大标题或模块标题。",
    defaultProps: { text: "新的标题", color: "#ffffff", fontSize: 44, fontWeight: 900 },
    defaultLayout: { width: 360, height: 88 }
  },
  Text: {
    labelZh: "文本",
    description: "普通说明文字。",
    defaultProps: { text: "在这里输入一段说明文字。", color: "rgba(255,255,255,.78)", fontSize: 18 },
    defaultLayout: { width: 360, height: 96 }
  },
  Button: {
    labelZh: "按钮",
    description: "可点击的链接按钮。",
    defaultProps: { text: "查看详情", href: "#", background: "#f36b21", color: "#111111" },
    defaultLayout: { width: 156, height: 54 }
  },
  Image: {
    labelZh: "图片",
    description: "放置图片路径并显示。",
    defaultProps: { src: "", alt: "图片", objectFit: "cover" },
    defaultLayout: { width: 360, height: 220 }
  },
  SearchBox: {
    labelZh: "搜索框",
    description: "输入框加搜索按钮。",
    defaultProps: { placeholder: "搜索公司、产业或关键词", buttonText: "搜索" },
    defaultLayout: { width: 440, height: 62 }
  },
  Card: {
    labelZh: "卡片",
    description: "标题、描述和标签组成的信息卡。",
    defaultProps: { title: "卡片标题", description: "用一段短文字说明这个模块。", tag: "模块" },
    defaultLayout: { width: 300, height: 180 }
  },
  Divider: {
    labelZh: "分割线",
    description: "用于分隔内容。",
    defaultProps: { color: "rgba(255,255,255,.32)" },
    defaultLayout: { width: 360, height: 24 }
  },
  Spacer: {
    labelZh: "间距",
    description: "用于调整空白距离。",
    defaultProps: { background: "rgba(255,255,255,.05)" },
    defaultLayout: { width: 240, height: 80 }
  }
};
