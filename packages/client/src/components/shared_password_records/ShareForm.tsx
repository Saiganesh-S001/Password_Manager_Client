// packages/web/src/components/SharedPasswordRecords/ShareForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { createSharedPasswordRecordRequest } from '../../store/slices/sharedPasswordRecordsSlice';

interface ShareFormInputs {
  email: string;
  password_record_id?: string;
}

export const ShareForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { records } = useSelector((state: RootState) => state.passwordRecords);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ShareFormInputs>();

  const onSubmit = (data: ShareFormInputs) => {
    if (data.password_record_id) {
      dispatch(createSharedPasswordRecordRequest({
        email: data.email,
        password_record_id: parseInt(data.password_record_id)
      }));
    } else {
      dispatch(createSharedPasswordRecordRequest({
        email: data.email,
      }));
    }
    reset();
  };

  return (
    <div className="max-w-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Share Access</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-4">
        <div className="flex flex-row gap-5 items-center">
          <div className="relative">
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              placeholder="Enter user's email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <select
              {...register('password_record_id', { required: 'Please select a password record' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              <option value="">Share All</option>
              {records.map(record => (
                <option key={record.id} value={record.id}>
                  {record.title}
                </option>
              ))}
            </select>
            {errors.password_record_id && (
              <p className="mt-1 text-sm text-red-600">{errors.password_record_id.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
          >
            Share Access
          </button>
        </div>
      </form>
    </div>
  );
};