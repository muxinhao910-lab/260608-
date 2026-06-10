import Link from "next/link";

export default function AdminBuilderPage() {
  return (
    <main className="admin-route-card">
      <p>WEB BUILDER V3</p>
      <h1>Builder 与 Admin 分工</h1>
      <span>
        Builder / 开发者模式负责页面视觉布局、基础组件添加、拖动位置、缩放尺寸，以及按钮、文字、图片编辑。
        Admin 后台负责内容数据、产业板块、公司资料、信息卡片和可信度规则维护。Admin 不做拖拽页面搭建。
      </span>
      <Link href="/?builder=1">打开首页开发者模式</Link>
    </main>
  );
}
