import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processLogin = async () => {
      try {
        const token = searchParams.get('token');
        
        if (token) {
          localStorage.setItem('authToken', token);
          toast.success('Login successful!');
          navigate('/dashboard', { replace: true });
        } else {
          toast.error('Login failed - no token received');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        toast.error('An error occurred during login');
        navigate('/login', { replace: true });
      } finally {
        setIsProcessing(false);
      }
    };

    processLogin();
  }, [navigate, searchParams]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your login...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default LoginSuccess;