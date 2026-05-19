import { ProfileSidebar } from "@/components/layouts/profile-sidebar";
import { ProfileList } from "../components/list";

// 临时空数据，等 Supabase 完成后接入
const orders: { id: string; title: string; date: string; status: string; price: string; href: string }[] = [
  // { id: "1", title: "订单 #12345", date: "2024-01-10", status: "已完成", price: "¥599", href: "/profile/orders/1" },
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen">
      <ProfileSidebar />
      <ProfileList
        title="我的订单"
        description="查看你的订单历史"
        items={orders}
        emptyText="还没有订单记录"
      />
    </div>
  );
}