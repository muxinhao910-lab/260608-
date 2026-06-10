import type { ElementRegistryItem, ElementRenderProps, WebBuilderElementType } from "@/types/webBuilder";
import { BreadcrumbElement } from "./elements/BreadcrumbElement";
import { ButtonElement } from "./elements/ButtonElement";
import { CardElement } from "./elements/CardElement";
import { ContainerElement } from "./elements/ContainerElement";
import { DividerElement } from "./elements/DividerElement";
import { GridElement } from "./elements/GridElement";
import { HamburgerMenuElement } from "./elements/HamburgerMenuElement";
import { HeadingElement } from "./elements/HeadingElement";
import { HeroBannerElement } from "./elements/HeroBannerElement";
import { ImageElement } from "./elements/ImageElement";
import { NavbarElement } from "./elements/NavbarElement";
import { SearchBoxElement } from "./elements/SearchBoxElement";
import { SpacerElement } from "./elements/SpacerElement";
import { TextElement } from "./elements/TextElement";
import { boxStyle, propArray, propText, textStyle } from "./elements/elementUtils";

function GenericElement({ element }: ElementRenderProps) {
  switch (element.type) {
    case "Section":
      return <div className="wbv3-section-el" style={{ ...boxStyle(element), backgroundImage: propText(element, "backgroundImage") ? `url(${propText(element, "backgroundImage")})` : undefined, minHeight: propText(element, "minHeight", "240px"), paddingTop: propText(element, "paddingTop", "48px"), paddingBottom: propText(element, "paddingBottom", "48px") }} />;
    case "Row":
      return <div className="wbv3-row-el" style={{ alignItems: propText(element, "alignItems", "center"), gap: propText(element, "gap", "16px"), justifyContent: propText(element, "justifyContent", "flex-start") }}><span /><span /></div>;
    case "Column":
      return <div className="wbv3-column-el" style={{ alignItems: propText(element, "alignItems", "stretch"), gap: propText(element, "gap", "16px"), width: propText(element, "width", "100%") }}><span /><span /></div>;
    case "RichText":
      return <div className="wbv3-rich-text" dangerouslySetInnerHTML={{ __html: propText(element, "content", "<p>Rich text content</p>") }} />;
    case "Badge":
      return <span className="wbv3-badge" style={{ background: propText(element, "background", "rgba(243,107,33,.18)"), color: propText(element, "color", "#f36b21") }}>{propText(element, "text", "Badge")}</span>;
    case "Icon":
      return <span className="wbv3-icon" style={{ color: propText(element, "color", "#ffffff"), fontSize: propText(element, "size", "32px") }}>{propText(element, "name", "✦")}</span>;
    case "BackgroundLayer":
      return <div className="wbv3-bg-layer" style={{ background: propText(element, "background", "radial-gradient(circle, rgba(243,107,33,.32), transparent 60%)"), filter: `blur(${propText(element, "blur", "20px")})`, opacity: propText(element, "opacity", "0.5") }} />;
    case "Link":
      return <a className="wbv3-link" href={propText(element, "href", "#")} style={{ color: propText(element, "color", "#f36b21"), textDecoration: propText(element, "underline", "true") === "true" ? "underline" : "none" }}>{propText(element, "text", "Link")}</a>;
    case "IconButton":
      return <a className="wbv3-icon-button" href={propText(element, "href", "#")} style={{ width: propText(element, "size", "44px"), height: propText(element, "size", "44px") }}>{propText(element, "icon", "↗")}</a>;
    case "Input":
      return <input className="wbv3-input" placeholder={propText(element, "placeholder", "Input")} type={propText(element, "type", "text")} value={propText(element, "value", "")} readOnly />;
    case "Select":
      return <select className="wbv3-input" value="" disabled><option>{propText(element, "placeholder", "Select option")}</option>{propText(element, "options", "Option A, Option B").split(",").map((item) => <option key={item.trim()}>{item.trim()}</option>)}</select>;
    case "NavItem":
      return <a className="wbv3-link" href={propText(element, "href", "#")}>{propText(element, "label", "Nav item")}</a>;
    case "CardGrid": {
      const cards = propArray<{ title?: string; description?: string; image?: string; href?: string }>(element, "cards");
      return <div className="wbv3-card-grid" style={{ gridTemplateColumns: `repeat(${propText(element, "columns", "3")}, 1fr)` }}>{cards.map((card, index) => <a href={card.href || "#"} key={`${card.title}-${index}`}><h3>{card.title}</h3><p>{card.description}</p></a>)}</div>;
    }
    case "List":
      return <div className="wbv3-list">{propArray<{ title?: string; description?: string }>(element, "items").map((item, index) => <article key={`${item.title}-${index}`}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>;
    case "Accordion":
      return <div className="wbv3-accordion">{propArray<{ title?: string; content?: string }>(element, "items").map((item, index) => <details key={`${item.title}-${index}`}><summary>{item.title}</summary><p>{item.content}</p></details>)}</div>;
    case "Timeline":
      return <div className="wbv3-timeline">{propArray<{ date?: string; title?: string; description?: string }>(element, "items").map((item, index) => <article key={`${item.date}-${index}`}><time>{item.date}</time><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>;
    case "GlassPanel":
      return <div className="wbv3-glass-panel" style={{ opacity: propText(element, "opacity", "1"), backdropFilter: `blur(${propText(element, "blur", "18px")})` }}><h3>{propText(element, "title", "Glass panel")}</h3><p>{propText(element, "content", "Panel content")}</p></div>;
    case "Marquee":
      return <div className="wbv3-marquee" style={{ "--speed": propText(element, "speed", "18s") } as React.CSSProperties}><span>{propText(element, "items", "Marquee, Items, Here")}</span></div>;
    default:
      return <div style={textStyle(element)}>{element.type}</div>;
  }
}

export const elementRegistry: Record<WebBuilderElementType, ElementRegistryItem> = {
  Section: { label: "Section", category: "布局", Component: GenericElement, defaultLayout: { width: 960, height: 300 }, defaultProps: { backgroundColor: "rgba(255,255,255,0.04)", backgroundImage: "", paddingTop: "48px", paddingBottom: "48px", minHeight: "240px", borderRadius: "24px" } },
  Container: { label: "Container", category: "布局", Component: ContainerElement, defaultLayout: { width: 720, height: 220 }, defaultProps: { maxWidth: "960px", padding: "32px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "20px" } },
  Row: { label: "Row", category: "布局", Component: GenericElement, defaultLayout: { width: 680, height: 120 }, defaultProps: { gap: "16px", alignItems: "center", justifyContent: "space-between" } },
  Column: { label: "Column", category: "布局", Component: GenericElement, defaultLayout: { width: 320, height: 260 }, defaultProps: { width: "100%", gap: "16px", alignItems: "stretch" } },
  Grid: { label: "Grid", category: "布局", Component: GridElement, defaultLayout: { width: 720, height: 220 }, defaultProps: { columns: "3", gap: "16px" } },
  Spacer: { label: "Spacer", category: "布局", Component: SpacerElement, defaultLayout: { width: 320, height: 80 }, defaultProps: { height: "80px" } },
  Divider: { label: "Divider", category: "布局", Component: DividerElement, defaultLayout: { width: 480, height: 24 }, defaultProps: { width: "100%", height: "1px", color: "#ffffff", opacity: 0.32 } },
  Heading: { label: "Heading", category: "文字", Component: HeadingElement, defaultLayout: { width: 560, height: 100 }, defaultProps: { text: "New heading", level: "h2", fontSize: "56px", fontWeight: "900", color: "#ffffff", textAlign: "left" } },
  Text: { label: "Text", category: "文字", Component: TextElement, defaultLayout: { width: 520, height: 120 }, defaultProps: { text: "Write your paragraph here.", fontSize: "18px", color: "rgba(255,255,255,0.72)", lineHeight: "1.6", textAlign: "left" } },
  RichText: { label: "RichText", category: "文字", Component: GenericElement, defaultLayout: { width: 560, height: 180 }, defaultProps: { content: "<p><strong>Rich text</strong> content</p>" } },
  Badge: { label: "Badge", category: "文字", Component: GenericElement, defaultLayout: { width: 160, height: 48 }, defaultProps: { text: "Badge", color: "#f36b21", background: "rgba(243,107,33,0.16)" } },
  Image: { label: "Image", category: "媒体", Component: ImageElement, defaultLayout: { width: 420, height: 280 }, defaultProps: { src: "", alt: "", objectFit: "cover", borderRadius: "20px" } },
  Icon: { label: "Icon", category: "媒体", Component: GenericElement, defaultLayout: { width: 80, height: 80 }, defaultProps: { name: "✦", size: "40px", color: "#f36b21" } },
  BackgroundLayer: { label: "BackgroundLayer", category: "媒体", Component: GenericElement, defaultLayout: { width: 520, height: 320 }, defaultProps: { background: "radial-gradient(circle, rgba(243,107,33,.32), transparent 60%)", opacity: "0.5", blur: "20px" } },
  Button: { label: "Button", category: "按钮和链接", Component: ButtonElement, defaultLayout: { width: 180, height: 56 }, defaultProps: { text: "Button", href: "#", variant: "solid", size: "medium", background: "#f36b21", color: "#111111", borderRadius: "999px" } },
  Link: { label: "Link", category: "按钮和链接", Component: GenericElement, defaultLayout: { width: 180, height: 44 }, defaultProps: { text: "Text link", href: "#", color: "#f36b21", underline: "true" } },
  IconButton: { label: "IconButton", category: "按钮和链接", Component: GenericElement, defaultLayout: { width: 56, height: 56 }, defaultProps: { icon: "↗", href: "#", size: "48px" } },
  Input: { label: "Input", category: "表单", Component: GenericElement, defaultLayout: { width: 320, height: 56 }, defaultProps: { placeholder: "Input placeholder", value: "", type: "text" } },
  SearchBox: { label: "SearchBox", category: "表单", Component: SearchBoxElement, defaultLayout: { width: 520, height: 64 }, defaultProps: { placeholder: "Search...", buttonText: "Search", width: "100%" } },
  Select: { label: "Select", category: "表单", Component: GenericElement, defaultLayout: { width: 320, height: 56 }, defaultProps: { options: "Option A, Option B, Option C", placeholder: "Choose one" } },
  Navbar: { label: "Navbar", category: "导航", Component: NavbarElement, defaultLayout: { width: 960, height: 72 }, defaultProps: { logoText: "Logo", items: [{ label: "Home", href: "/" }, { label: "About", href: "#about" }], layout: "horizontal", background: "rgba(255,255,255,0.06)" } },
  NavItem: { label: "NavItem", category: "导航", Component: GenericElement, defaultLayout: { width: 140, height: 44 }, defaultProps: { label: "Nav item", href: "#" } },
  HamburgerMenu: { label: "HamburgerMenu", category: "导航", Component: HamburgerMenuElement, defaultLayout: { width: 180, height: 170 }, defaultProps: { items: [{ label: "Home", href: "/" }, { label: "Contact", href: "#contact" }], position: "right" } },
  Breadcrumb: { label: "Breadcrumb", category: "导航", Component: BreadcrumbElement, defaultLayout: { width: 420, height: 48 }, defaultProps: { items: [{ label: "Home", href: "/" }, { label: "Page", href: "#" }] } },
  Card: { label: "Card", category: "内容", Component: CardElement, defaultLayout: { width: 320, height: 260 }, defaultProps: { title: "Card title", description: "Card description", image: "", buttonText: "Open", buttonHref: "#" } },
  CardGrid: { label: "CardGrid", category: "内容", Component: GenericElement, defaultLayout: { width: 820, height: 300 }, defaultProps: { columns: "3", cards: [{ title: "Card A", description: "Description", image: "", href: "#" }, { title: "Card B", description: "Description", image: "", href: "#" }, { title: "Card C", description: "Description", image: "", href: "#" }] } },
  List: { label: "List", category: "内容", Component: GenericElement, defaultLayout: { width: 520, height: 240 }, defaultProps: { items: [{ title: "Item one", description: "Description" }, { title: "Item two", description: "Description" }] } },
  Accordion: { label: "Accordion", category: "内容", Component: GenericElement, defaultLayout: { width: 520, height: 240 }, defaultProps: { items: [{ title: "Question", content: "Answer content" }] } },
  Timeline: { label: "Timeline", category: "内容", Component: GenericElement, defaultLayout: { width: 620, height: 300 }, defaultProps: { items: [{ date: "2026", title: "Milestone", description: "Timeline description" }] } },
  HeroBanner: { label: "HeroBanner", category: "高级视觉", Component: HeroBannerElement, defaultLayout: { width: 960, height: 420 }, defaultProps: { eyebrow: "EYEBROW", title: "Hero banner title", subtitle: "Hero subtitle", backgroundImage: "", buttonText: "Explore", buttonHref: "#" } },
  GlassPanel: { label: "GlassPanel", category: "高级视觉", Component: GenericElement, defaultLayout: { width: 420, height: 240 }, defaultProps: { title: "Glass panel", content: "Panel content", opacity: "1", blur: "18px" } },
  Marquee: { label: "Marquee", category: "高级视觉", Component: GenericElement, defaultLayout: { width: 720, height: 72 }, defaultProps: { items: "Design, Build, Publish", speed: "18s" } }
};
