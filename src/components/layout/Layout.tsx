import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import './Layout.css';

export const Layout: React.FC = () => {
  const location = useLocation();
  const isEditor = location.pathname.startsWith('/editor');

  return (
    <div className={`cv-app-shell ${isEditor ? 'cv-app-shell--editor' : ''}`}>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <Navbar />
      <main
        id="main-content"
        className={`cv-main-content ${isEditor ? 'cv-main-content--editor' : ''}`}
      >
        <Outlet />
      </main>
      {!isEditor && <Footer />}
    </div>
  );
};
