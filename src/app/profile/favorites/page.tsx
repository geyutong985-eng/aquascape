import { ProfileSidebar } from "@/components/layouts/profile-sidebar";
import { ProfileList } from "../components/list";

// 临时空数据，等 Supabase 完成后接入
const favorites: { id: string; title: string; description: string; date: string; href: string }[] = [
  // { id: "1", title: "经典水草造景", description: "简约风格，适合小型鱼缸", date: "2024-01-01", href: "/showcase/1" },
];

export default function FavoritesPage() {
  return (
    <div className="min-h-screen">
      <ProfileSidebar />
      <ProfileList
        title="我的收藏"
        description="你收藏的造景案例"
        items={favorites}
        emptyText="还没有收藏内容"
      />
    </div>
  );
}