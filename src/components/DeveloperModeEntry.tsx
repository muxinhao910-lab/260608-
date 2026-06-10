import Link from "next/link";

export function DeveloperModeEntry() {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <Link className="developer-mode-entry" href="/admin/dashboard">
      开发者模式
    </Link>
  );
}
