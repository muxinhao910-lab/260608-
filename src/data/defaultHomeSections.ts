import type { HomeSection } from "@/types/pageBuilder";

export const defaultHomeSections: HomeSection[] = [
  {
    id: "home-hero",
    type: "hero",
    props: {
      eyebrow: "INDUSTRIAL INTELLIGENCE",
      title: "看懂产业，而不是只看K线",
      subtitle: "追踪真正影响公司长期价值的产业变量。",
      image: "",
      primaryButtonText: "开始探索",
      primaryButtonHref: "#search",
      secondaryButtonText: "机器人产业",
      secondaryButtonHref: "/sector/robotics"
    }
  },
  {
    id: "home-stock-search",
    type: "stockSearch",
    props: {
      title: "股票与产业变量搜索",
      placeholder: "输入公司、代码、产业链位置或关键变量",
      buttonText: "搜索",
      description: "先从产业位置、客户、订单、收入占比和供应链证据开始，而不是只看价格波动。"
    }
  },
  {
    id: "home-industry-nav",
    type: "industryNav",
    props: {
      title: "产业链入口",
      subtitle: "把公司放回产业链里观察，持续跟踪真实影响长期价值的变量。",
      items: [
        {
          title: "机器人",
          description: "外部结构、内部零部件、核心供应商与长期跟踪指标。",
          href: "/sector/robotics",
          tag: "ACTIVE"
        },
        {
          title: "半导体",
          description: "设备、材料、先进封装与国产替代链条。",
          href: "/sector/semiconductor",
          tag: "NEXT"
        }
      ]
    }
  }
];
