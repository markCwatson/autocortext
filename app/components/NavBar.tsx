import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import ClientNavbar from '@/components/ClientNavBar';


const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return <ClientNavbar session={session} />;
};

export default Navbar;
