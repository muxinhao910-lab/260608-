import type { ElementRenderProps } from "@/types/webBuilder";
import { propText } from "./elementUtils";

export function ButtonElement({ element }: ElementRenderProps) {
  return (
    <a
      className={`wbv3-button wbv3-button-${propText(element, "variant", "solid")} wbv3-button-${propText(element, "size", "medium")}`}
      href={propText(element, "href", "#")}
      style={{
        background: propText(element, "background", "#f36b21"),
        borderRadius: propText(element, "borderRadius", "999px"),
        color: propText(element, "color", "#111111")
      }}
    >
      {propText(element, "text", "Button")}
    </a>
  );
}
