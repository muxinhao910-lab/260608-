import type { WebBuilderDocument } from "@/types/webBuilder";

export const defaultHomeCanvas: WebBuilderDocument = {
  pageId: "home",
  version: 3,
  canvas: {
    width: 1440,
    height: 3000,
    background: "#050505"
  },
  elements: [
    {
      id: "home-navbar",
      type: "Navbar",
      props: {
        logoText: "MUXINBAI",
        layout: "horizontal",
        background: "rgba(255,255,255,0.06)",
        items: [
          { label: "Home", href: "/" },
          { label: "Work", href: "#work" },
          { label: "Contact", href: "#contact" }
        ]
      },
      layout: { x: 80, y: 48, width: 1280, height: 72, zIndex: 1 }
    },
    {
      id: "home-hero-banner",
      type: "HeroBanner",
      props: {
        eyebrow: "VISUAL WEB BUILDER",
        title: "Design the page directly on canvas",
        subtitle: "Add base web components, drag them into place, resize them, and save the result as a real homepage.",
        backgroundImage: "",
        buttonText: "Start editing",
        buttonHref: "#canvas"
      },
      layout: { x: 80, y: 170, width: 1280, height: 520, zIndex: 2 }
    },
    {
      id: "home-heading",
      type: "Heading",
      props: {
        text: "A clean canvas for your personal site",
        level: "h2",
        fontSize: "56px",
        fontWeight: "900",
        color: "#ffffff",
        textAlign: "left"
      },
      layout: { x: 110, y: 780, width: 760, height: 120, zIndex: 3 }
    },
    {
      id: "home-text",
      type: "Text",
      props: {
        text: "This default page is built from generic components instead of business-specific stock or robotics modules.",
        fontSize: "20px",
        color: "rgba(255,255,255,0.72)",
        lineHeight: "1.6",
        textAlign: "left"
      },
      layout: { x: 110, y: 920, width: 700, height: 130, zIndex: 4 }
    },
    {
      id: "home-card-grid",
      type: "CardGrid",
      props: {
        columns: "3",
        cards: [
          { title: "Base components", description: "Heading, text, button, image, card, list, form and navigation blocks.", image: "", href: "#" },
          { title: "Free placement", description: "Drag and resize elements directly on an absolute-positioned canvas.", image: "", href: "#" },
          { title: "Local first", description: "Save to localStorage, export JSON, and later ask Codex to solidify it.", image: "", href: "#" }
        ]
      },
      layout: { x: 110, y: 1120, width: 1220, height: 320, zIndex: 5 }
    }
  ]
};
