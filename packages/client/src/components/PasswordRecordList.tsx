import React, { useEffect } from 'react';
import { deleteRecordRequest, fetchRecordsRequest } from '../store/slices/passwordRecordsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { AppDispatch } from '../store';
import { useNavigate } from 'react-router-dom';

export const PasswordRecordList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const records = useSelector((state: RootState) => state.passwordRecords.records);
  const sharedRecords = useSelector((state: RootState) => state.passwordRecords.sharedRecords);

  const navigate = useNavigate();
  const handleDelete = (id: number) => {
    dispatch(deleteRecordRequest(id));  
  };

  const handleView = (id: number) => {
    navigate(`/passwords/${id}`);
  };   
  
  useEffect(() => {
    dispatch(fetchRecordsRequest({}));
  }, [dispatch]);

  return (
    <div className="space-y-4">
        {records.length === 0 && (
        <div className="text-center text-gray-500">
            No own passwordrecords found.
        </div>
        )}
        {records.map(record => (
        <div key={record.id} className="flex justify-between items-center px-5 py-4 bg-gray-100 hover:bg-gray-50 rounded-lg shadow-md">
          <div className="space-y-1">
            <h3 className="text-lg font-medium" onClick={() => handleView(record.id)}>{record.title}</h3>
            <a 
              href={record.url} 
              target="_blank"       
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline"
            >
              {record.url}
            </a>
          </div>
          <div className="flex space-x-2">
            <button className="text-blue-400 hover:underline text-sm" onClick={() => handleView(record.id)}>
              View
            </button>
            <button className="text-gray-600 hover:underline text-sm" onClick={() => navigate(`/passwords/${record.id}/edit`)}>
              Edit
            </button>
            <button 
              className="text-red-600 hover:underline text-sm"
              onClick={() => handleDelete(record.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};