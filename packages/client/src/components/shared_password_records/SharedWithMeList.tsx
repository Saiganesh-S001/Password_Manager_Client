import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';
import { useNavigate } from 'react-router-dom';
import { fetchRecordsRequest } from '../../store/slices/passwordRecordsSlice';
export const SharedWithMeList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const sharedRecords = useSelector((state: RootState) => state.passwordRecords.sharedRecords);
  const navigate = useNavigate();


  const handleView = (id: number) => {
    navigate(`/passwords/${id}`);
  };   
  
  useEffect(() => {
    dispatch(fetchRecordsRequest({}));
  }, [dispatch]);


  return (
    <div className="mt-8">
    {sharedRecords.length === 0 && (
      <div className="text-center text-gray-500">
        No shared records found.
      </div>
    )}
      {sharedRecords.map(record => (
        <div key={record.id} className="flex justify-between items-center px-5 py-4 bg-gray-100 hover:bg-gray-50 rounded-lg shadow-md mt-4">
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
          </div>
        </div>
      ))}
    </div>
  );
};