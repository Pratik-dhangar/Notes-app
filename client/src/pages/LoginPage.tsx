import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/Api';
import { toast } from 'react-toastify';

// This is the URL that starts the Google OAuth flow on your backend
const GOOGLE_AUTH_URL = 'http://localhost:5000/api/auth/google';

const ImagePanel = () => (
    <div className="hidden md:block">
      <img
        className="w-full h-full object-cover"
        src="https://hwdlte.com/wp-content/uploads/2024/02/windows-11-bloom-4k-wallpaper-3840x2160-scaled.jpg"
        alt="Abstract wallpaper"
      />
    </div>
);

const LoginPage = () => {
    const [otpSent, setOtpSent] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
  
    const handleGetOtp = async () => {
      try {
        await api.post('/auth/login', { email });
        setOtpSent(true);
        toast.success('OTP has been sent to your email!');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Login failed.');
      }
    };
  
    const handleVerifyOtp = async () => {
      try {
        const { data } = await api.post('/auth/verify-otp', { email, otp });
        localStorage.setItem('authToken', data.token);
        toast.success('Login successful!');
        navigate('/dashboard');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Invalid OTP.');
      }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (otpSent) {
          handleVerifyOtp();
        } else {
          handleGetOtp();
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50">
          <div className="flex flex-col justify-center items-center p-8">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
              <h1 className="text-3xl font-bold text-text-primary mb-2">Sign in</h1>
              <p className="text-text-secondary mb-6">Welcome back! Please enter your details.</p>
    
              <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-text-secondary">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={otpSent} className="w-full mt-1 border border-border-default rounded-lg p-2 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue disabled:bg-gray-100" />
                  </div>

                  {otpSent && (
                    <div>
                      <label className="text-sm font-medium text-text-secondary">OTP</label>
                      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required className="w-full mt-1 border border-border-default rounded-lg p-2 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" />
                    </div>
                  )}
                  
                  <button type="submit" className="w-full bg-primary-blue text-white font-medium py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue">
                    {otpSent ? 'Verify & Sign In' : 'Sign In with Email'}
                  </button>
              </form>
              
              {/* NEW: Google Sign-in Button */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-default"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-text-secondary">OR</span>
                </div>
              </div>

              <a href={GOOGLE_AUTH_URL} className="w-full">
                <button className="w-full flex items-center justify-center gap-2 border border-border-default text-text-primary font-medium py-3 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue">
                  <img className="w-5 h-5" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google icon" />
                  Sign in with Google
                </button>
              </a>
              {/* END NEW SECTION */}
    
              <p className="text-sm text-center mt-6">
                Don't have an account? <Link to="/signup" className="font-medium text-link-blue hover:underline">Sign up</Link>
              </p>
            </div>
          </div>
          <ImagePanel />
        </div>
      );
}

export default LoginPage;