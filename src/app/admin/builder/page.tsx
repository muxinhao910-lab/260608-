import Link from "next/link";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-auth";
import { PageBuilderEditor } from "@/components/admin/PageBuilderEditor";

export default async function AdminBuilderPage() {
  const cookieStore = await cookies();
  const isSessionValid = await verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!isSessionValid) {
    return (
      <main className="page-builder-admin" aria-labelledby="builder-session-title" data-session-state="unauthorized">
        <header className="page-builder-header">
          <div>
            <p>SESSION REQUIRED</p>
            <h1 id="builder-session-title">后台会话已失效</h1>
          </div>
          <div className="page-builder-actions">
            <Link href="/admin/login?error=session">重新登录</Link>
          </div>
        </header>
        <p className="page-builder-muted">请重新登录后继续编辑 Builder 独立草稿；未授权状态不会进入编辑器。</p>
      </main>
    );
  }

  return <PageBuilderEditor />;
}
