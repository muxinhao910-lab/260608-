import Link from "next/link";

export default function AdminBuilderPage() {
  return (
    <main className="admin-route-card">
      <p>WEB BUILDER V3</p>
      <h1>首页可视化搭建器入口</h1>
      <span>Builder V3 直接在首页 `/` 右下角进入。这里保留为后台管理入口，路由切换不会卸载后台 layout。</span>
      <Link href="/">打开首页 Builder</Link>
    </main>
  );
}
