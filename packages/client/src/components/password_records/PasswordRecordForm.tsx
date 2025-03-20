// packages/web/src/components/PasswordRecordForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { createRecordRequest, updateRecordRequest } from '../../store/slices/passwordRecordsSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
interface PasswordRecordFormProps {
  initialData?: {
    id?: number;
    title: string;
    username: string;
    password: string;
    url: string;
  };
  isEditMode?: boolean;
}

export const PasswordRecordForm: React.FC<PasswordRecordFormProps> = ({ initialData, isEditMode = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || { title: '', username: '', password: '', url: '' }
  });

  const onSubmit = (data: any) => {
    if (isEditMode && initialData?.id) {
      dispatch(updateRecordRequest({ ...data, id: initialData.id }));
    } else {
      dispatch(createRecordRequest(data));
      toast.success('Password record created successfully');
      setTimeout(() => {
        navigate('/');
      }, 1000);

    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <div>
        <h1 className='text-2xl font-bold'>{isEditMode ? 'Edit' : 'Create'} Password Record</h1>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          {...register('title', { required: 'Title is required' })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          {...register('username', { required: 'Username is required' })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.username && <p className="text-red-500">{errors.username.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          {...register('password', { required: 'Password is required' })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">URL</label>
        <input
          {...register('url', { required: 'URL is required' })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.url && <p className="text-red-500">{errors.url.message}</p>}
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          {isEditMode ? 'Update' : 'Create'} Password Record
        </button>
      </div>
    </form>
  );
};