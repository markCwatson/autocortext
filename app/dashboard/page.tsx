import DialogModal from '@/components/DialogModal';
import SignInButton from '@/components/SignInButton';
import { getCurrentUser } from '@/lib/session';

export default async function MainDashboard() {
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

  return <div className="text-center">This will be the dashboard</div>;
}
