import { elementRegistry } from "./elementRegistry";
import type { BuilderElement } from "@/types/webBuilder";

export function ElementRenderer({ element }: { element: BuilderElement }) {
  const registryItem = elementRegistry[element.type];
  const Component = registryItem.Component;
  return <Component element={element} />;
}
