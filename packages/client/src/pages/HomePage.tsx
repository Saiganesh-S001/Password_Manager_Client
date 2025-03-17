import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchRecordsRequest } from '../store/slices/passwordRecordsSlice';
import { useNavigate } from 'react-router-dom';
import LogoutBtn from '../components/LogoutBtn';
import { useEffect } from 'react';
import { fetchSharedByMeRequest } from '../store/slices/sharedPasswordRecordsSlice';
import { fetchSharedWithMeRequest } from '../store/slices/sharedPasswordRecordsSlice';
import { PasswordRecordsIndex } from '../components/PasswordRecordsIndex';
import { SharedRecordsPage } from './ShareRecordsPage';
const HomePage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const { records, isLoading} = useSelector((state: RootState) => state.passwordRecords);
    const {sharedWithMe, sharedByMe} = useSelector((state: RootState) => state.sharedPasswordRecords);
    useEffect(() => {
        dispatch(fetchRecordsRequest({}));
        dispatch(fetchSharedWithMeRequest());
        dispatch(fetchSharedByMeRequest());

        // console.log(sharedWithMe);
        // console.log(sharedByMe);
        // console.log(records);
    }, [dispatch]);

  return (
    <>
      {user ? (
        <div className='flex flex-col gap-4 bg-teal-50'>
            <LogoutBtn />
            <h1>Welcome {user.display_name}</h1>
            {isLoading && <p>Loading...</p>}
            <PasswordRecordsIndex />
            <SharedRecordsPage />
            <div className='flex flex-col gap-4'>
                <h2 className='text-2xl font-bold'>All records</h2>
                {records.map((record) => (
                    <div key={record.id}>
                        <h2>{record.title}</h2>
                        <p>{record.username}</p>
                        <p>{record.password}</p>
                        <p>{record.url}</p>
                    </div>
                ))}
                <h2 className='text-2xl font-bold'>Shared with me</h2>
            {sharedWithMe.map((record) => (
                <div key={record.id}>
                    <h2>{record.password_record.title}</h2>
                    <p>{record.password_record.username}</p>
                    <p>{record.password_record.password}</p>
                    <p>{record.password_record.url}</p>
                </div>
            ))}
            <h2 className='text-2xl font-bold'>Shared by me</h2>
            {sharedByMe.map((record) => (
                <div key={record.id}>
                    <h2>{record.password_record.title}</h2>
                    <p>{record.password_record.username}</p>
                    <p>{record.password_record.password}</p>
                    <p>{record.password_record.url}</p>
                    </div>
                ))}
            </div>
        </div>
      ) : (
        <div>
            <h1>Please log in</h1>
            <button onClick={() => navigate('/login')}>Login</button>
        </div>
      )}
    </>
  )
}

export default HomePage