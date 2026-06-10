import type { ElementRenderProps } from "@/types/webBuilder";
import { propText, textStyle } from "./elementUtils";

export function TextElement({ element }: ElementRenderProps) {
  return <p className="wbv3-reset" style={textStyle(element)}>{propText(element, "text", "Text")}</p>;
}
