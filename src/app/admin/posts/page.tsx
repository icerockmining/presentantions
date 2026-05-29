import Link from "next/link";
import { AdminShell, AdminHeading } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { deletePost } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPosts() {
  const posts = await prisma.post.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <AdminShell>
      <AdminHeading title={`Статьи блога (${posts.length})`} action={<Link href="/admin/posts/new" className="btn btn-teal btn-sm">+ Новая статья</Link>} />
      <div className="admin-card" style={{ padding: 0, overflowX: "auto" }}>
        <table className="admin-table" style={{ minWidth: 700 }}>
          <thead><tr><th>Заголовок</th><th>Тег</th><th>Дата</th><th></th></tr></thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <td><Link href={`/admin/posts/${p.id}`} style={{ fontWeight: 600, color: "#fff" }}>{p.title}</Link><div style={{ fontSize: 12, color: "#6c8584" }}>{p.slug}</div></td>
                <td>{p.tag || "—"}</td>
                <td>{new Intl.DateTimeFormat("ru-RU").format(p.publishedAt)}</td>
                <td>
                  <form action={deletePost}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="btn btn-ghost btn-sm" style={{ color: "#e88" }}>Удалить</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
