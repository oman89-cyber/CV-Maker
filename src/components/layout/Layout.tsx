import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import './Layout.css';

export const Layout: React.FC = () => {
  return (
    <div className="cv-app-shell">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="cv-main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
