import { loginUser, selectUserError } from '@slices/userSlice';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const errorText = useSelector(selectUserError) ?? '';

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    const state = location.state as { from?: { pathname: string } } | null;
    const from = state?.from?.pathname ?? '/';

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        void navigate(from, { replace: true });
      })
      .catch(() => {
        // ошибка отображается в UI через errorText
      });
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
