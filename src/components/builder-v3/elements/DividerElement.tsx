import type { ElementRenderProps } from "@/types/webBuilder";
import { propNumber, propText } from "./elementUtils";

export function DividerElement({ element }: ElementRenderProps) {
  return (
    <div
      className="wbv3-divider"
      style={{
        background: propText(element, "color", "#ffffff"),
        height: propText(element, "height", "1px"),
        opacity: propNumber(element, "opacity", 0.4),
        width: propText(element, "width", "100%")
      }}
    />
  );
}
