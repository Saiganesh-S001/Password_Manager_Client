import React, { useEffect } from 'react';
import { fetchSharedByMeRequest,deleteSharedPasswordRecordRequest } from '../../store/slices/sharedPasswordRecordsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SharedUser {
  id: number;
  email: string;
  shared_records: Array<{
    id: number;
    title: string;
  }>;
}

export const SharedRecordsList: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { sharedByMe, isLoading, error } = useSelector((state: RootState) => state.sharedPasswordRecords);
  
  useEffect(() => {
    dispatch(fetchSharedByMeRequest());
  }, [dispatch]);

  const groupedByUser = sharedByMe.reduce((acc, share) => {
    const collaborator = share.collaborator;
    if (!acc[collaborator.id]) {
      acc[collaborator.id] = {
        id: collaborator.id,
        email: collaborator.email,
        shared_records: []
      };
    }
    acc[collaborator.id].shared_records.push(share.password_record);
    return acc;
  }, {} as Record<number, SharedUser>);

  const handleRemoveAccess = (collaboratorId: number, passwordRecordId: number) => {
    console.log(collaboratorId, passwordRecordId);
    dispatch(deleteSharedPasswordRecordRequest({ email: groupedByUser[collaboratorId].email, password_record_id: passwordRecordId }));
    if (error) {
      toast.error('Failed to revoke access');
    }
    else{
      toast.success('Access revoked successfully');
    }
  };

  const handleRevokeAllAccess = (collaboratorId: number) => {
    const user = groupedByUser[collaboratorId];
    user.shared_records.forEach(record => {
      dispatch(deleteSharedPasswordRecordRequest({ email: user.email, password_record_id: record.id }));
    });
    if (error) {
      toast.error('Failed to revoke all access');
    }
    else{
      toast.success('All access revoked successfully');
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading shared records...</div>;
  }

  return (
    <div className="mb-10">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Users with Access</h3>
      {Object.values(groupedByUser).length > 0 ? (
        <ul className="space-y-3">
          {Object.values(groupedByUser).map((user) => (
            <li key={user.id} className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-700 font-medium">{user.email}</span>
                  {user.shared_records.length > 0 && (
                    <p className="text-xs text-gray-500">
                      Access to: {user.shared_records.map(record => record.title).join(", ")}
                    </p>
                  )}
                </div>

                <div className="relative" data-controller="dropdown">
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md inline-flex items-center"
                      onClick={() => document.getElementById(`dropdown_${user.id}`)?.classList.toggle('hidden')}
                    >
                      Manage Access ▼
                    </button>

                    <div
                      id={`dropdown_${user.id}`}
                      className="hidden absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50"
                    >
                      {user.shared_records.map(record => (
                        <button
                          key={record.id}
                          onClick={() => handleRemoveAccess(user.id, record.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Remove {record.title}
                        </button>
                      ))}
                      <button
                        onClick={() => handleRevokeAllAccess(user.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t"
                      >
                        Revoke All Access
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-6 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">No users have been granted access yet.</p>
        </div>
      )}
    </div>
  );
};