import { GenericSectionEditor } from "@/components/builder/GenericSectionEditor";
import type { ModuleRegistry } from "@/types/pageBuilder";
import { CardGridSection } from "./sections/CardGridSection";
import { CompanyGridSection } from "./sections/CompanyGridSection";
import { CtaSection } from "./sections/CtaSection";
import { HeroSection } from "./sections/HeroSection";
import { IndustryNavSection } from "./sections/IndustryNavSection";
import { MetricGridSection } from "./sections/MetricGridSection";
import { RiskListSection } from "./sections/RiskListSection";
import { RobotShowcaseSection } from "./sections/RobotShowcaseSection";
import { SpacerSection } from "./sections/SpacerSection";
import { SplitImageTextSection } from "./sections/SplitImageTextSection";
import { StockSearchSection } from "./sections/StockSearchSection";
import { TimelineSection } from "./sections/TimelineSection";

export const moduleRegistry: ModuleRegistry = {
  hero: {
    label: "首屏 Hero",
    defaultProps: {
      eyebrow: "INDUSTRIAL INTELLIGENCE",
      title: "看懂产业，而不是只看K线",
      subtitle: "追踪真正影响公司长期价值的产业变量。",
      image: "",
      primaryButtonText: "开始探索",
      primaryButtonHref: "#search",
      secondaryButtonText: "机器人产业",
      secondaryButtonHref: "/sector/robotics"
    },
    Component: HeroSection,
    Editor: GenericSectionEditor
  },
  stockSearch: {
    label: "股票搜索",
    defaultProps: {
      title: "股票搜索入口",
      placeholder: "输入股票代码、公司或产业变量",
      buttonText: "搜索",
      description: "从产业链位置和长期变量开始筛选。"
    },
    Component: StockSearchSection,
    Editor: GenericSectionEditor
  },
  industryNav: {
    label: "产业链入口",
    defaultProps: {
      title: "产业链入口",
      subtitle: "选择一个产业链，进入更细的公司与证据地图。",
      items: [
        {
          title: "机器人",
          description: "外部结构、内部零部件与供应链公司。",
          href: "/sector/robotics",
          tag: "ACTIVE"
        }
      ]
    },
    Component: IndustryNavSection,
    Editor: GenericSectionEditor
  },
  robotShowcase: {
    label: "机器人展示",
    defaultProps: {
      title: "机器人外部 / 内部结构",
      subtitle: "用两张结构图展示机器人产业链观察入口。",
      exteriorImage: "/images/robot-exterior.png",
      interiorImage: "/images/robot-interior.png",
      description: "默认图片来自项目现有机器人素材。"
    },
    Component: RobotShowcaseSection,
    Editor: GenericSectionEditor
  },
  cardGrid: {
    label: "卡片组",
    defaultProps: {
      title: "研究卡片",
      subtitle: "把观察点拆成可复用的卡片。",
      items: [
        {
          title: "客户变化",
          description: "记录新增客户、核心客户变化和验证来源。",
          tag: "CUSTOMER"
        }
      ]
    },
    Component: CardGridSection,
    Editor: GenericSectionEditor
  },
  metricGrid: {
    label: "指标网格",
    defaultProps: {
      title: "关键指标",
      subtitle: "追踪长期变量，而不是短期价格噪音。",
      items: [
        {
          label: "收入占比",
          value: "待验证",
          description: "机器人业务或目标产业链业务收入占比。"
        }
      ]
    },
    Component: MetricGridSection,
    Editor: GenericSectionEditor
  },
  companyGrid: {
    label: "公司网格",
    defaultProps: {
      title: "公司卡片",
      subtitle: "公司、代码、市场和产业链位置。",
      companies: [
        {
          name: "示例公司",
          code: "000000",
          market: "A股",
          description: "这里记录公司在产业链中的位置和跟踪逻辑。",
          tags: ["供应链", "待验证"]
        }
      ]
    },
    Component: CompanyGridSection,
    Editor: GenericSectionEditor
  },
  splitImageText: {
    label: "左右图文",
    defaultProps: {
      title: "产业链观察框架",
      content: "用一张图配合一段文字说明核心判断、证据来源和下一步跟踪动作。",
      image: "/images/robot-exterior.png",
      imagePosition: "right",
      buttonText: "查看详情",
      buttonHref: "/sector/robotics"
    },
    Component: SplitImageTextSection,
    Editor: GenericSectionEditor
  },
  timeline: {
    label: "时间线",
    defaultProps: {
      title: "产业事件时间线",
      items: [
        {
          date: "2026 Q2",
          title: "新增跟踪事件",
          description: "记录公告、订单、产能或客户验证。"
        }
      ]
    },
    Component: TimelineSection,
    Editor: GenericSectionEditor
  },
  riskList: {
    label: "风险提示",
    defaultProps: {
      title: "风险提示",
      items: [
        {
          title: "信息未验证",
          description: "如果来源不足，不能把传闻写成事实。",
          level: "HIGH"
        }
      ]
    },
    Component: RiskListSection,
    Editor: GenericSectionEditor
  },
  cta: {
    label: "CTA",
    defaultProps: {
      title: "继续查看机器人产业链",
      subtitle: "进入独立页面查看结构图、公司证据和长期指标。",
      buttonText: "打开机器人研究页",
      buttonHref: "/sector/robotics"
    },
    Component: CtaSection,
    Editor: GenericSectionEditor
  },
  spacer: {
    label: "空白间距",
    defaultProps: {
      size: "medium"
    },
    Component: SpacerSection,
    Editor: GenericSectionEditor
  }
};
