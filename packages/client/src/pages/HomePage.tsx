import { useSelector } from 'react-redux';
import { RootState } from '../store';

import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

  return (
    <>
      {user ? (
        <div>HomePage</div>
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