import { ProfileSidebar } from "@/components/layouts/profile-sidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <ProfileSidebar />
      <main className="flex-1 md:ml-56 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}