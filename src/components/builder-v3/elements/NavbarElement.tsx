import type { ElementRenderProps } from "@/types/webBuilder";
import { propArray, propText } from "./elementUtils";

export function NavbarElement({ element }: ElementRenderProps) {
  const items = propArray<{ label?: string; href?: string }>(element, "items");
  return (
    <nav className="wbv3-navbar" style={{ background: propText(element, "background", "rgba(255,255,255,.06)") }}>
      <strong>{propText(element, "logoText", "Logo")}</strong>
      <div>
        {items.map((item, index) => (
          <a href={item.href || "#"} key={`${item.label}-${index}`}>{item.label}</a>
        ))}
      </div>
    </nav>
  );
}
