import { useDispatch, useSelector } from 'react-redux';
import { logoutRequest } from '../../store/slices/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { useEffect } from 'react';

const LogoutBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {    
    dispatch(logoutRequest());
  };

  useEffect(() => {
    if (isAuthenticated === false) {
      toast.success('Logged out successfully');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='flex justify-end'>
      <button onClick={handleLogout}>Logout</button>
      <ToastContainer />
    </div>
  );
};

export default LogoutBtn;
