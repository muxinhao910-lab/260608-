export type WebBuilderElementType =
  | "Heading"
  | "Text"
  | "Button"
  | "Image"
  | "SearchBox"
  | "Card"
  | "Divider"
  | "Spacer";

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

export type BuilderPage = {
  title: string;
  path: string;
  elements: BuilderElement[];
};

export type BuilderPages = Record<string, BuilderPage>;

export type ElementRegistryItem = {
  labelZh: string;
  description: string;
  defaultProps: Record<string, unknown>;
  defaultLayout: Omit<BuilderElementLayout, "x" | "y" | "zIndex">;
};

export type ElementRenderProps = {
  element: BuilderElement;
};
