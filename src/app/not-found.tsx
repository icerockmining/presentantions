import { BtnLink } from "@/components/Btn";
import { Icon } from "@/components/Icon";

export default function NotFound() {
  return (
    <div className="container" style={{ padding: "100px 32px", textAlign: "center" }}>
      <Icon name="search" size={48} stroke="#3e5453" />
      <h1 style={{ fontSize: 40, fontWeight: 800, color: "#fff", marginTop: 20, letterSpacing: "-0.02em" }}>404 — страница не найдена</h1>
      <p style={{ fontSize: 16, color: "#8aa3a2", marginTop: 12, marginBottom: 28 }}>
        Возможно, товар снят с продажи или адрес введён неверно.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <BtnLink href="/catalog" variant="teal" icon="arrow">В каталог</BtnLink>
        <BtnLink href="/" variant="outline">На главную</BtnLink>
      </div>
    </div>
  );
}
