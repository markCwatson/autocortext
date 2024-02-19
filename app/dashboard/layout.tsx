import '@/styles/globals.css';
import DashboardNav from '@/components/DashboardNav';
import { getCurrentUser } from '@/lib/session';
import Preview from '@/components/Preview';
import Navbar from '@/components/NavBar';
import DashboardPage from '@/components/DashboardPage';
import DialogModal from '@/components/DialogModal';
import SignInButton from '@/components/SignInButton';
import OrgNavBar from '@/components/OrgBar';
import { AiMessagesProvider } from '@/providers/AiMessagesProvider';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { ClientCtxProvider } from '@/providers/ClientCtxProvider';
import { UserProvider } from '@/providers/UserProvider';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <DialogModal
        icon={
          <ArrowPathIcon
            className="h-6 w-6 text-green-600 animate-spin"
            aria-hidden="true"
          />
        }
        title={'You are not signed in.'}
        body={'You cannot access this page.'}
        show={true}
        goToButtons={[<SignInButton text="Sign in" />]}
      />
    );
  }

  // if (user.role !== 'AscendAdmin') {
  //   return (
  //     <DialogModal
  //       icon={
  //         <ArrowPathIcon
  //           className="h-6 w-6 text-red-600 animate-spin"
  //           aria-hidden="true"
  //         />
  //       }
  //       title={'Unauthorized!'}
  //       body={
  //         'This app is only accessible to Ascend Engineering personnel and approved partners.'
  //       }
  //       show={true}
  //       goToText="Return"
  //     />
  //   );
  // }

  return (
    <>
      <Preview />
      <Navbar />
      <UserProvider
        value={{
          id: user.id,
          name: user.name,
          image: user.image,
          companyId: user.companyId,
          companyName: user.companyName,
          role: user.role,
          email: user.email,
        }}
      >
        <OrgNavBar />
      </UserProvider>
      <div className="mx-auto flex flex-col space-y-6">
        <div
          className="p-0 grid gap-12 md:grid-cols-[115px_1fr] bg-my-color8"
          style={{
            maxWidth: '100%',
          }}
        >
          <DashboardNav
            user={{
              name: user.name,
              image: user.image,
              email: user.email,
            }}
          />
          <DashboardPage>
            <main className="flex w-full flex-1 flex-col overflow-hidden mt-4">
              <AiMessagesProvider>
                <ClientCtxProvider>
                  <UserProvider
                    value={{
                      id: user.id,
                      name: user.name,
                      image: user.image,
                      companyId: user.companyId,
                      companyName: user.companyName,
                      role: user.role,
                      email: user.email,
                    }}
                  >
                    {children}
                  </UserProvider>
                </ClientCtxProvider>
              </AiMessagesProvider>
            </main>
          </DashboardPage>
        </div>
      </div>
    </>
  );
}
