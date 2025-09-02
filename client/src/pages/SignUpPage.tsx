import { useState, useEffect, type FormEvent } from 'react';
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

const SignUpPage = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Timer effect for resend functionality
  useEffect(() => {
    let interval: number;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleGetOtp = async () => {
    setIsLoading(true);
    try {
      await api.post('/auth/generate-otp', { email, name, dateOfBirth });
      setOtpSent(true);
      setResendTimer(15);
      setCanResend(false);
      toast.success('OTP has been sent to your email!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Sign up failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      localStorage.setItem('authToken', data.token);
      toast.success('Account verified successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    try {
      await api.post('/auth/generate-otp', { email, name, dateOfBirth });
      setResendTimer(15);
      setCanResend(false);
      setOtp(''); // Clear current OTP
      toast.success('New OTP has been sent to your email!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP.');
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Sign up</h1>
          <p className="text-text-secondary mb-6">Create an account to get started.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-secondary">Full name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={otpSent} className="w-full mt-1 border border-border-default rounded-lg p-2 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue disabled:bg-gray-100" />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={otpSent} className="w-full mt-1 border border-border-default rounded-lg p-2 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue disabled:bg-gray-100" />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary">Date of Birth</label>
              <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} disabled={otpSent} className="w-full mt-1 border border-border-default rounded-lg p-2 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue disabled:bg-gray-100" />
            </div>

            {otpSent && (
              <div>
                <label className="text-sm font-medium text-text-secondary">OTP</label>
                <div className="relative">
                  <input 
                    type={showOtp ? "text" : "password"} 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    required 
                    className="w-full mt-1 border border-border-default rounded-lg p-2 pr-10 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" 
                    placeholder="Enter 6-digit OTP"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOtp(!showOtp)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showOtp ? (
                      // Eye slash icon (hide)
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      // Eye icon (show)
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="mt-2 text-sm">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-link-blue hover:underline focus:outline-none"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <span className="text-text-secondary">
                      Resend OTP in {resendTimer}s
                    </span>
                  )}
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary-blue text-white font-medium py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {otpSent ? 'Verifying...' : 'Sending OTP...'}
                </>
              ) : (
                otpSent ? 'Verify Account' : 'Sign Up with Email'
              )}
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
              Sign up with Google
            </button>
          </a>
          {/* END NEW SECTION */}

          <p className="text-sm text-center mt-6">
            Already have an account? <Link to="/login" className="font-medium text-link-blue hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
      <ImagePanel />
    </div>
  );
};

export default SignUpPage;