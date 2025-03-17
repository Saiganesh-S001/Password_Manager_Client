// packages/web/src/components/PasswordRecordDetail.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchRecordRequest } from '../store/slices/passwordRecordsSlice';
export const PasswordRecordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
//   const record = useSelector((state: RootState) => state.passwordRecords.records.find(r => r.id === Number(id)));

//   const sharedRecord = useSelector((state: RootState) => state.passwordRecords.sharedRecords.find(r => r.id === Number(id)));
  const currentRecord = useSelector((state: RootState) => state.passwordRecords.currentRecord);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchRecordRequest(Number(id)));
  }, [dispatch, id]);   

  return (
    <div className="md:w-2/3 w-full mx-auto">
      <h1 className="font-bold text-4xl">{currentRecord?.title}</h1>
      <div className="my-6 p-4 bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="space-y-4">
          <div className="flex items-center">
            <strong className="w-24 text-gray-700">Username:</strong>
            <span className="text-gray-900">{currentRecord?.username}</span>
          </div>
          <div className="flex items-center">
            <strong className="w-24 text-gray-700">Password:</strong>
            <span className="text-gray-900">{currentRecord?.password}</span>
          </div>
          <div className="flex items-center">
            <strong className="w-24 text-gray-700">URL:</strong>
            <a 
              href={currentRecord?.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {currentRecord?.url}
            </a>
          </div>
          <div className="flex items-center">
            <strong className="w-24 text-gray-700">Made by</strong>
            <span className="text-gray-900">{currentRecord?.user.display_name}</span>
          </div>
        </div>
      </div>
      <div className="my-6 p-4 bg-white shadow-sm rounded-lg border border-gray-200 space-x-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500" onClick={() => navigate(`/passwords/${id}/edit`)}>Edit this record</button>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500">Delete this record</button>
        <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500" onClick={() => navigate('/')}>Back to password list</button>
      </div>
    </div>
  );
};