// packages/web/src/components/Signup.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerRequest } from '../store/slices/authSlice';
import { RootState } from '../store';
import { RegisterRequest } from '../../types';
import { useNavigate } from 'react-router-dom';


export const RegisterPage: React.FC = () => {
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>();
    const navigate = useNavigate();
    const onSubmit = (data: RegisterRequest) => {
      dispatch(registerRequest(data));
      if (error) console.log(error);
      else navigate('/');
    };

  
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Sign up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Display Name</label>
            <input
              {...register('display_name', { required: 'Display name is required' })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.display_name && <p className="text-red-500">{errors.display_name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
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
              {isLoading ? 'Signing up...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    );
  };