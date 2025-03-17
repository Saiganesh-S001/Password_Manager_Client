// packages/web/src/components/SharedPasswordRecords/SharedRecordsPage.tsx
import React, { useEffect } from 'react';
import { ShareForm } from '../components/ShareForm';
import { SharedRecordsList } from '../components/SharedByMeList';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchRecordsRequest } from '../store/slices/passwordRecordsSlice';
export const SharedRecordsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchRecordsRequest({}));
  }, [dispatch]);

  return (
    <div className="max-w-4xl w-full mx-auto mt-5" data-controller="dropdown">
      {/* <div className="flex justify-between items-center mb-5 p-5">
        <h1 className="font-bold text-2xl">Shared Password Records</h1>
      </div> */}

      <div className="mb-8">
        <ShareForm />
      </div>

      <SharedRecordsList />
    </div>
  );
};