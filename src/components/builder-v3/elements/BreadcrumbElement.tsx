import type { ElementRenderProps } from "@/types/webBuilder";
import { propArray } from "./elementUtils";

export function BreadcrumbElement({ element }: ElementRenderProps) {
  const items = propArray<{ label?: string; href?: string }>(element, "items");
  return (
    <nav className="wbv3-breadcrumb">
      {items.map((item, index) => (
        <a href={item.href || "#"} key={`${item.label}-${index}`}>{item.label}</a>
      ))}
    </nav>
  );
}
