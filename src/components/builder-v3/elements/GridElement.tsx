import type { ElementRenderProps } from "@/types/webBuilder";
import { propText } from "./elementUtils";

export function GridElement({ element }: ElementRenderProps) {
  const columns = propText(element, "columns", "3");
  return (
    <div className="wbv3-grid-el" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: propText(element, "gap", "16px") }}>
      <span />
      <span />
      <span />
    </div>
  );
}
