import type { ElementRenderProps } from "@/types/webBuilder";
import { propArray, propText } from "./elementUtils";

export function HamburgerMenuElement({ element }: ElementRenderProps) {
  const items = propArray<{ label?: string; href?: string }>(element, "items");
  return (
    <details className={`wbv3-hamburger wbv3-hamburger-${propText(element, "position", "right")}`}>
      <summary>Menu</summary>
      <div>
        {items.map((item, index) => (
          <a href={item.href || "#"} key={`${item.label}-${index}`}>{item.label}</a>
        ))}
      </div>
    </details>
  );
}
