import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutRequest } from '../store/slices/authSlice';

    export const useInactivityTimer = (isAuthenticated: boolean, timeout?: number) => { //default timeout is 5 minutes
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) return; // Prevent running if timeout is null or 0

    let inactivityTimer: ReturnType<typeof setTimeout> | undefined = undefined;

    if (!timeout) {
      timeout = 300000; //default timeout is 5 minutes
    }

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        dispatch(logoutRequest());
      }, timeout);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    resetTimer(); // Start timer

    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [dispatch, timeout]); // Now correctly depends on timeout
  return {};
};

