import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import AdminSidebar from '@/components/layout/AdminSidebar';

export const metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-bg">
      <AdminSidebar />
      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:px-8 lg:pt-10">
          {children}
        </div>
      </div>
    </div>
  );
}