import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  // User ලොග් වෙලා නැත්නම්, එයාව කෙලින්ම /login එකට යවනවා
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ලොග් වෙලා නම්, එයා ඉල්ලපු Page එක (Outlet) පෙන්නනවා
  return <Outlet />;
};

export default ProtectedRoute;
