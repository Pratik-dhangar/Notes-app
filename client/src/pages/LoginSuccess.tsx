import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const LoginSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('authToken', token);
      navigate('/dashboard', { replace: true });
    } else {
      // Handle error or no token case
      navigate('/login', { replace: true });
    }
  }, [navigate, searchParams]);

  return <div>Loading...</div>;
};

export default LoginSuccess;