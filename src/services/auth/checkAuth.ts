import { AppDispatch } from '../store';
import { getUser, authChecked } from '../slices/user/userSlice';
import { getCookie } from '../../utils/cookie';
import { deleteCookie } from '../../utils/cookie';

export const checkUserAuth = () => (dispatch: AppDispatch) => {
  if (getCookie('accessToken')) {
    dispatch(getUser())
      .catch(() => {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .finally(() => {
        dispatch(authChecked());
      });
  } else {
    dispatch(authChecked());
  }
};
