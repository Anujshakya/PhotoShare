import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useLogin } from '../context/LoginContext';

const LogOut = () => {
  const { logout } = useLogin();

  const token = document.cookie;
  const { error } = useQuery({
    // enabled: enabled,
    queryKey: ['logout'],
    queryFn: () =>
      fetch('http://localhost:3000/api/auth/logout', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        if (res.ok) {
          logout();
          toast.success('Logout Sucessful');

          document.cookie = 'token=; expires=Thu, 01 Jan 2000 00:00:00 UTC; path=/;';
          sessionStorage.removeItem('token');
          console.warn('logout successful');
          return res.json();
        }
      })
  });
  if (error) toast.error('Unsucessful');
  return null;
};
export default LogOut;
