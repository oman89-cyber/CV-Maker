import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LogoMark, MenuIcon, XIcon, PlusIcon } from '../common/Icons';
import { Button } from '../common/Button';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const [prevPathname, setPrevPathname] = useState(location.pathname);

  // Close mobile menu whenever route changes
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setMobileMenuOpen(false);
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="cv-navbar-header">
      <div className="container cv-navbar">
        <Link to="/" className="cv-brand" aria-label="CVForge Home">
          <LogoMark size={32} />
          <span className="cv-brand__name">
            CV<span className="cv-brand__accent">Forge</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="cv-nav-links" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `cv-nav-link ${isActive ? 'cv-nav-link--active' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/templates"
            className={({ isActive }) =>
              `cv-nav-link ${isActive ? 'cv-nav-link--active' : ''}`
            }
          >
            Templates
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              `cv-nav-link ${isActive ? 'cv-nav-link--active' : ''}`
            }
          >
            Create CV
          </NavLink>
          <NavLink
            to="/import"
            className={({ isActive }) =>
              `cv-nav-link ${isActive ? 'cv-nav-link--active' : ''}`
            }
          >
            Import Document
          </NavLink>
        </nav>

        {/* Desktop Actions */}
        <div className="cv-navbar-actions">
          <Button
            to="/create"
            variant="primary"
            size="sm"
            leftIcon={<PlusIcon size={16} />}
          >
            Create my CV
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="cv-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer / Overlay */}
      {mobileMenuOpen && (
        <div className="cv-mobile-drawer" role="dialog" aria-modal="true">
          <nav className="cv-mobile-nav" aria-label="Mobile Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `cv-mobile-link ${isActive ? 'cv-mobile-link--active' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/templates"
              className={({ isActive }) =>
                `cv-mobile-link ${isActive ? 'cv-mobile-link--active' : ''}`
              }
            >
              Templates
            </NavLink>
            <NavLink
              to="/create"
              className={({ isActive }) =>
                `cv-mobile-link ${isActive ? 'cv-mobile-link--active' : ''}`
              }
            >
              Create CV
            </NavLink>
            <NavLink
              to="/import"
              className={({ isActive }) =>
                `cv-mobile-link ${isActive ? 'cv-mobile-link--active' : ''}`
              }
            >
              Import Document
            </NavLink>
            <NavLink
              to="/editor/demo-sample"
              className={({ isActive }) =>
                `cv-mobile-link ${isActive ? 'cv-mobile-link--active' : ''}`
              }
            >
              Editor Preview
            </NavLink>
            <div className="cv-mobile-drawer__actions">
              <Button to="/create" variant="primary" fullWidth size="md">
                Create my CV
              </Button>
              <Button to="/templates" variant="secondary" fullWidth size="md">
                Explore Templates
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
