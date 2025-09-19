import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    // You could add a loading spinner here
    return null;
  }

  return user ? children : <Navigate to="/login" />;
}
