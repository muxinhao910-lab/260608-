import type { ElementRenderProps } from "@/types/webBuilder";
import { propText, textStyle } from "./elementUtils";

export function HeadingElement({ element }: ElementRenderProps) {
  const Tag = (propText(element, "level", "h2") as "h1" | "h2" | "h3" | "h4") || "h2";
  return <Tag className="wbv3-reset" style={textStyle(element)}>{propText(element, "text", "Heading")}</Tag>;
}
