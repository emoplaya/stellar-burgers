import { Preloader } from '@ui';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import {
  isAuthCheckedSelector,
  userDataSelector
} from '../../services/slices/user/userSlice';

export const ProtectedRoute: FC<{
  onlyUnAuth?: boolean;
  children: React.ReactNode;
}> = ({ onlyUnAuth = false, children }) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const user = useSelector(userDataSelector);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
