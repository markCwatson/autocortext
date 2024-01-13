import '@/styles/globals.css';
import DashboardNav from '@/components/DashboardNav';
import { getCurrentUser } from '@/lib/session';
import Preview from '@/components/Preview';
import Navbar from '@/components/NavBar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar />
      <Preview />
      <div className="mx-auto flex flex-col space-y-6">
        <div className="container p-0 grid gap-12 md:grid-cols-[200px_1fr]">
          <DashboardNav
            user={{
              name: user?.name,
              image: user?.image,
              email: user?.email,
            }}
          />
          <main className="flex w-full flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
