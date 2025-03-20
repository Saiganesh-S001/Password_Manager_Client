import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RegisterPage } from './pages/RegisterPage';
// import HomePage from './pages/HomePage';
import './index.css';
import { LoginPage } from './pages/LoginPage';
import { PasswordRecordDetail } from './components/password_records/PasswordRecordDetail';
import { PasswordRecordsIndex } from './components/password_records/PasswordRecordsIndex';
import EditPasswordRecord from './components/password_records/EditPasswordRecord';
import { PasswordRecordForm } from './components/password_records/PasswordRecordForm';
import { Layout } from './components/layouts/Layout';
import { EditProfile } from './components/user/EditUserProfile';
import { useSelector } from 'react-redux';  
import { RootState } from './store';
import { useInactivityTimer } from './hooks/useInactivityTimer';
function App() {

  const {isAuthenticated} = useSelector((state: RootState) => state.auth);
  const inactivityTimer = useInactivityTimer(isAuthenticated);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<PasswordRecordsIndex />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/passwords" element={<PasswordRecordsIndex />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/passwords/new" element={<PasswordRecordForm />} />
          <Route path="/passwords/:id" element={<PasswordRecordDetail />} />
          <Route path="/passwords/:id/edit" element={<EditPasswordRecord />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
