// packages/web/src/components/PasswordRecordsIndex.tsx
import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
// import { SearchBar } from './SearchBar';
import { PasswordRecordList } from './PasswordRecordList';
import { SharedWithMeList } from '../shared_password_records/SharedWithMeList';
import { SharedRecordsPage } from '../../pages/ShareRecordsPage';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchRecordsRequest } from '../../store/slices/passwordRecordsSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
export const PasswordRecordsIndex: React.FC = () => {
  const {isAuthenticated} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  // redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    dispatch(fetchRecordsRequest({}));
  }, [dispatch]);   

  return (
    <div className="max-w-4xl w-full mx-auto p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-bold text-xl">Password Records</h1>
        <Link to="/passwords/new" className="rounded-md px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium">
          New
        </Link>
      </div>
      {/* <SearchBar /> */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">My passwords</h2>
        <PasswordRecordList />
        <h2 className="text-lg font-bold">Shared passwords</h2>
        <SharedWithMeList />
        <SharedRecordsPage />
      </div>
    </div>
  );
};