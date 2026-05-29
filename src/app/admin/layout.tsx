import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Админка",
  robots: { index: false, follow: false },
};

// Layout is intentionally thin: the admin shell (sidebar/auth) is rendered by
// AdminShell inside each protected page, so the login page can opt out.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
