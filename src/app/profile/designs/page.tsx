import { ProfileList } from "../components/list";

// 临时空数据，等 Supabase 完成后接入
const designs: { id: string; title: string; date: string; status: string; href: string }[] = [
  // { id: "1", title: "我的鱼缸造景 1", date: "2024-01-15", status: "已保存", href: "/editor" },
];

export default function DesignsPage() {
  return (
    <ProfileList
      title="我的设计"
      description="管理你的造景设计"
      items={designs}
      emptyText="还没有设计，快去创建一个吧"
    />
  );
}