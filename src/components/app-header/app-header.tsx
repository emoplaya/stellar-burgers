import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../../src/services/store';
import { userDataSelector } from '../../../src/services/slices/user/userSlice';

export const AppHeader: FC = () => {
  const user = useSelector(userDataSelector);
  return <AppHeaderUI userName={user?.name} />;
};
