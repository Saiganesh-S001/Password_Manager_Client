// packages/web/src/components/Layout/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { logoutRequest } from '../store/slices/authSlice';
// import { fetchRecordsRequest } from '../store/slices/passwordRecordsSlice';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import LogoutBtn from '../user/LogoutBtn';
import { SearchBar } from './SearchBar';


export const Navbar: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);


  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-lg font-bold">
          <Link to="/" className="hover:text-gray-300">
            Password Manager
          </Link>
        </h1>

        {/* User Navigation */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link 
                to="/profile/edit" 
                className="hover:text-gray-300 transition duration-150"
              >
                My Profile
              </Link>
              <LogoutBtn />
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="hover:text-gray-300 transition duration-150"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="hover:text-gray-300 transition duration-150"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Search Form */}
      {isAuthenticated && <SearchBar />}
    </nav>
  );
};