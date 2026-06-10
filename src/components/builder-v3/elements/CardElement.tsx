import type { ElementRenderProps } from "@/types/webBuilder";
import { propText } from "./elementUtils";

export function CardElement({ element }: ElementRenderProps) {
  const image = propText(element, "image", "");
  return (
    <article className="wbv3-card">
      {image ? <img alt="" src={image} /> : null}
      <h3>{propText(element, "title", "Card title")}</h3>
      <p>{propText(element, "description", "Card description")}</p>
      {propText(element, "buttonText", "") ? <a href={propText(element, "buttonHref", "#")}>{propText(element, "buttonText", "Open")}</a> : null}
    </article>
  );
}
