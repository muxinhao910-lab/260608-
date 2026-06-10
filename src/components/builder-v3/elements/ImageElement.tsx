import type { CSSProperties } from "react";
import type { ElementRenderProps } from "@/types/webBuilder";
import { propText } from "./elementUtils";

export function ImageElement({ element }: ElementRenderProps) {
  const src = propText(element, "src", "");
  if (!src) {
    return <div className="wbv3-image-placeholder">Image</div>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={propText(element, "alt", "")}
      className="wbv3-image"
      src={src}
      style={{
        borderRadius: propText(element, "borderRadius", "0"),
        objectFit: propText(element, "objectFit", "cover") as CSSProperties["objectFit"]
      }}
    />
  );
}
