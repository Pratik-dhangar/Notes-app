import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/Api';
import { toast } from 'react-toastify';

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
  const navigate = useNavigate();

  const handleGetOtp = async () => {
    try {
      await api.post('/auth/generate-otp', { email, name, dateOfBirth });
      setOtpSent(true);
      toast.success('OTP has been sent to your email!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Sign up failed.');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      localStorage.setItem('authToken', data.token);
      toast.success('Account verified successfully!');
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
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required className="w-full mt-1 border border-border-default rounded-lg p-2 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue" />
              </div>
            )}

            <button type="submit" className="w-full bg-primary-blue text-white font-medium py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue">
              {otpSent ? 'Verify Account' : 'Sign Up'}
            </button>
          </form>

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