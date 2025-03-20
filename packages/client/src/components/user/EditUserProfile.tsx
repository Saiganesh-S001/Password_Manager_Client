// packages/web/src/components/User/EditProfile.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';
import { deleteAccountRequest, updateProfileRequest} from '../../store/slices/authSlice';

interface ProfileFormData {
  display_name: string;
  email: string;
  password: string;
  current_password: string;
  password_confirmation: string;
}

export const EditProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<ProfileFormData>({
    defaultValues: {
      display_name: user?.display_name,
      email: user?.email,
    }
  });

  const password = watch('password');

  const onSubmit = (data: ProfileFormData) => {
    dispatch(updateProfileRequest(data));
    if (error) {
      toast.error(error);
    } else {
      toast.success('Profile updated successfully');
      navigate('/passwords');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      dispatch(deleteAccountRequest());
    }
  };

  useEffect(() => {
    if (user) {
      reset({
        display_name: user.display_name,
        email: user.email,
      });
    }
  }, [user]);       
  return (
    <div className="flex mx-auto">
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Profile</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Display Name</label>
            <input
              {...register('display_name', { required: 'Display name is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.display_name && <p className="mt-1 text-sm text-red-600">{errors.display_name.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <i className="text-xs text-gray-500">(leave blank if you don't want to change it)</i>
            <input
              type="password"
              {...register('password')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password Confirmation</label>
            <input
              type="password"
              {...register('password_confirmation', {
                validate: (value) =>  !password || password === value || 'Passwords do not match'
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <i className="text-xs text-gray-500">(we need your current password to confirm your changes)</i>
            <input
              type="password"
              {...register('current_password', { required: 'Current password is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.current_password && <p className="mt-1 text-sm text-red-600">{errors.current_password.message}</p>}
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col ml-10">
        <h3 className="text-xl font-semibold text-gray-800 mt-6">Cancel my account</h3>

        <div className="text-l text-gray-600">
          Unhappy?
          <button
            onClick={handleDeleteAccount}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 mt-2 block"
          >
            Cancel my account
          </button>
        </div>

        <div className="mt-4">
          <button
            onClick={() => window.history.back()}
            className="text-indigo-600 hover:underline"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};