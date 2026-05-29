import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Cashes Green Rus — серверное и AI-оборудование";

export default function Image() {
  return ogImage({
    eyebrow: "Технологический дистрибьютор",
    title: "Серверное оборудование напрямую с заводов",
    subtitle: "Только оригиналы · гарантия 1 год · расчёт в рублях",
  });
}
