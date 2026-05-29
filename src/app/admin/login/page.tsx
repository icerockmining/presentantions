import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { login, getAdminId } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Вход в админку",
  robots: { index: false, follow: false },
};

async function loginAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/admin");
  const ok = await login(email, password);
  if (!ok) redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const sp = await searchParams;
  if (await getAdminId()) redirect("/admin");

  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <form action={loginAction} style={{ width: "100%", maxWidth: 400, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 16, padding: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Админка</h1>
        <p style={{ fontSize: 13.5, color: "#8aa3a2", marginBottom: 24 }}>Cashes Green Rus · панель управления</p>
        <input type="hidden" name="next" value={sp.next || "/admin"} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, color: "#9fb6b5" }}>Email</label>
            <input name="email" type="email" required className="input" placeholder="admin@cashesgreen.ru" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, color: "#9fb6b5" }}>Пароль</label>
            <input name="password" type="password" required className="input" placeholder="••••••••" />
          </div>
          {sp.error && <p style={{ fontSize: 13, color: "#e88" }}>Неверный email или пароль.</p>}
          <button type="submit" className="btn btn-teal btn-md btn-full" style={{ marginTop: 6 }}>Войти</button>
        </div>
      </form>
    </div>
  );
}
