import type { ElementRenderProps } from "@/types/webBuilder";
import { boxStyle, propText } from "./elementUtils";

export function ContainerElement({ element }: ElementRenderProps) {
  return (
    <div
      className="wbv3-container-el"
      style={{
        ...boxStyle(element),
        maxWidth: propText(element, "maxWidth", "100%")
      }}
    />
  );
}
