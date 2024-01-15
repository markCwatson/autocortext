import '@/styles/globals.css';
import DashboardNav from '@/components/DashboardNav';
import { getCurrentUser } from '@/lib/session';
import Preview from '@/components/Preview';
import Navbar from '@/components/NavBar';
import DashboardPage from '@/components/DashboardPage';
import DialogModal from '@/components/DialogModal';
import SignInButton from '@/components/SignInButton';
import OrgNavBar from '@/components/OrgBar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <DialogModal
        title={'You are not signed in.'}
        body={'You cannot access this page.'}
        show={true}
        goToButton={<SignInButton text="Sign in" />}
      />
    );
  }

  return (
    <>
      <Preview />
      <Navbar />
      <OrgNavBar />
      <div className="mx-auto flex flex-col space-y-6">
        <div
          className="p-0 grid gap-12 md:grid-cols-[200px_1fr]"
          style={{
            maxWidth: '100%',
          }}
        >
          <DashboardNav
            user={{
              name: user?.name,
              image: user?.image,
              email: user?.email,
            }}
          />
          <DashboardPage>
            <main className="flex w-full flex-1 flex-col overflow-hidden">
              {children}
            </main>
          </DashboardPage>
        </div>
      </div>
    </>
  );
}
