import React from 'react';
import { RootState } from '../store';
import { useSelector } from 'react-redux';

export const SharedPasswordList: React.FC = () => {
    const shared_with_me_records = useSelector((state: RootState) => state.sharedPasswordRecords.sharedWithMe); 
    const shared_by_me_records = useSelector((state: RootState) => state.sharedPasswordRecords.sharedByMe);

    return (
        <div>
            <h1>Shared with me</h1>
            {shared_with_me_records.map((record) => (
                <div key={record.id}>
                    <h1>{record.password_record.title}</h1>
                </div>
            ))}
            <h1>Shared by me</h1>
            {shared_by_me_records.map((record) => (
                <div key={record.id}>
                    <h1>{record.password_record.title}</h1>
                </div>
            ))}
        </div>
    );
};

