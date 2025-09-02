import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('authToken');
  // If authorized, render the child routes (Outlet). Otherwise, redirect to login.
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;