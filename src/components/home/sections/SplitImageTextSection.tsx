import Image from "next/image";
import type { SectionComponentProps } from "@/types/pageBuilder";
import { SectionShell, textProp } from "./sectionHelpers";

export function SplitImageTextSection({ section }: SectionComponentProps) {
  const image = textProp(section.props, "image", "/images/robot-exterior.png");
  const imagePosition = textProp(section.props, "imagePosition", "right");
  const content = textProp(section.props, "content", "");
  const buttonText = textProp(section.props, "buttonText", "");
  const buttonHref = textProp(section.props, "buttonHref", "#");

  return (
    <SectionShell>
      <div className={`home-split ${imagePosition === "left" ? "is-image-left" : ""}`}>
        <figure>
          <Image alt={textProp(section.props, "title", "模块图片")} height={760} src={image} width={760} />
        </figure>
        <div>
          <p className="home-kicker">INSIGHT</p>
          <h2>{textProp(section.props, "title", "左右图文")}</h2>
          <p>{content}</p>
          {buttonText ? <a className="home-section-link" href={buttonHref}>{buttonText}</a> : null}
        </div>
      </div>
    </SectionShell>
  );
}
