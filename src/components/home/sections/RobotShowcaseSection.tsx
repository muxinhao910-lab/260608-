import Image from "next/image";
import type { SectionComponentProps } from "@/types/pageBuilder";
import { SectionShell, textProp } from "./sectionHelpers";

export function RobotShowcaseSection({ section }: SectionComponentProps) {
  const exteriorImage = textProp(section.props, "exteriorImage", "/images/robot-exterior.png");
  const interiorImage = textProp(section.props, "interiorImage", "/images/robot-interior.png");

  return (
    <SectionShell className="home-robot-showcase">
      <div className="home-section-heading">
        <p>ROBOTICS</p>
        <h2>{textProp(section.props, "title", "机器人结构图")}</h2>
        <span>{textProp(section.props, "subtitle", "外部形态与内部结构并排观察。")}</span>
      </div>
      <div className="home-robot-grid">
        <figure>
          <Image alt="机器人外部结构" height={720} src={exteriorImage} width={720} />
          <figcaption>Exterior</figcaption>
        </figure>
        <figure>
          <Image alt="机器人内部结构" height={720} src={interiorImage} width={720} />
          <figcaption>Interior</figcaption>
        </figure>
      </div>
      <p className="home-section-copy">{textProp(section.props, "description", "")}</p>
    </SectionShell>
  );
}
