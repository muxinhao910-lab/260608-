import type { ElementRenderProps } from "@/types/webBuilder";
import { propText } from "./elementUtils";

export function SearchBoxElement({ element }: ElementRenderProps) {
  return (
    <form className="wbv3-search" style={{ width: propText(element, "width", "100%") }}>
      <input placeholder={propText(element, "placeholder", "Search")} />
      <button type="button">{propText(element, "buttonText", "Search")}</button>
    </form>
  );
}
