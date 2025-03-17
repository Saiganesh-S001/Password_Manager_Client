import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { LoginRequest } from '../../types';
import { loginRequest } from '../store/slices/authSlice';
import {  useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
  const navigate = useNavigate();
  const { isAuthenticated,isLoading, error } = useSelector((state: RootState) => state.auth);

  const onSubmit = (data: LoginRequest) => {
    dispatch(loginRequest(data));
  };

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Logged in successfully');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
    else if (error) {
      toast.error('Login failed');
    }
  }, [isAuthenticated, error]);

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <ToastContainer />
      <h2 className="text-4xl font-semibold text-center text-gray-800 mb-6">Log in</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            autoFocus
            autoComplete="email"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            autoComplete="current-password"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        <div className="text-center">
        <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200"
              disabled={isLoading}  
            >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <button onClick={() => navigate('/register')}>Don't have an account? Sign up</button>
      </div>
    </div>
  );
};