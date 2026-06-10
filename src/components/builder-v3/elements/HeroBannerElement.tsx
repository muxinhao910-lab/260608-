import type { ElementRenderProps } from "@/types/webBuilder";
import { propText } from "./elementUtils";

export function HeroBannerElement({ element }: ElementRenderProps) {
  const backgroundImage = propText(element, "backgroundImage", "");
  return (
    <section
      className="wbv3-hero"
      style={{
        backgroundImage: backgroundImage ? `linear-gradient(90deg, rgba(0,0,0,.76), rgba(0,0,0,.18)), url(${backgroundImage})` : undefined
      }}
    >
      <p>{propText(element, "eyebrow", "Eyebrow")}</p>
      <h1>{propText(element, "title", "Hero title")}</h1>
      <span>{propText(element, "subtitle", "Hero subtitle")}</span>
      <a href={propText(element, "buttonHref", "#")}>{propText(element, "buttonText", "Button")}</a>
    </section>
  );
}
