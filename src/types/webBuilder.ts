import type { ComponentType } from "react";

export type WebBuilderElementType =
  | "Section"
  | "Container"
  | "Row"
  | "Column"
  | "Grid"
  | "Spacer"
  | "Divider"
  | "Heading"
  | "Text"
  | "RichText"
  | "Badge"
  | "Image"
  | "Icon"
  | "BackgroundLayer"
  | "Button"
  | "Link"
  | "IconButton"
  | "Input"
  | "SearchBox"
  | "Select"
  | "Navbar"
  | "NavItem"
  | "HamburgerMenu"
  | "Breadcrumb"
  | "Card"
  | "CardGrid"
  | "List"
  | "Accordion"
  | "Timeline"
  | "HeroBanner"
  | "GlassPanel"
  | "Marquee";

export type BuilderElementLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  locked?: boolean;
  hidden?: boolean;
};

export type BuilderElement = {
  id: string;
  type: WebBuilderElementType;
  props: Record<string, unknown>;
  layout: BuilderElementLayout;
};

export type WebBuilderCanvas = {
  width: number;
  height: number;
  background: string;
};

export type WebBuilderDocument = {
  pageId: "home";
  version: 3;
  canvas: WebBuilderCanvas;
  elements: BuilderElement[];
};

export type ElementRenderProps = {
  element: BuilderElement;
};

export type ElementRegistryItem = {
  label: string;
  category: "布局" | "文字" | "媒体" | "按钮和链接" | "表单" | "导航" | "内容" | "高级视觉";
  defaultProps: Record<string, unknown>;
  defaultLayout: Omit<BuilderElementLayout, "x" | "y" | "zIndex">;
  Component: ComponentType<ElementRenderProps>;
};

export type ResizeHandle =
  | "n"
  | "ne"
  | "e"
  | "se"
  | "s"
  | "sw"
  | "w"
  | "nw";
