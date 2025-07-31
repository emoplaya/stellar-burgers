import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../../src/services/store';
import { Navigate, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/slices/user/userSlice';
import {
  userDataSelector,
  userErrorSelector
} from '../../services/slices/user/userSlice';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const user = useSelector(userDataSelector);
  const error = useSelector(userErrorSelector);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(registerUser({ email, name: userName, password }))
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        console.error('Ошибка регистрации:', err);
      });
  };

  if (user) {
    return <Navigate to='/' />;
  }
  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
