import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-teal-50">
      <Navbar />
      <main className="container mx-auto mt-10 px-5">
        {children}
      </main>
    </div>
  );
};