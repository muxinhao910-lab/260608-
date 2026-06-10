import type { ElementRenderProps } from "@/types/webBuilder";
import { propText } from "./elementUtils";

export function SpacerElement({ element }: ElementRenderProps) {
  return <div className="wbv3-spacer" style={{ height: propText(element, "height", "80px") }} />;
}
