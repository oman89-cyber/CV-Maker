import React from 'react';
import { Link } from 'react-router-dom';
import { LogoMark, ShieldCheckIcon, SparklesIcon } from '../common/Icons';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="cv-footer">
      <div className="container">
        <div className="cv-footer__top">
          <div className="cv-footer__brand-col">
            <Link to="/" className="cv-brand" aria-label="CVForge Home">
              <LogoMark size={28} />
              <span className="cv-brand__name">
                CV<span className="cv-brand__accent">Forge</span>
              </span>
            </Link>
            <p className="cv-footer__tagline">
              Build a CV that opens doors. Professional, modern, and ATS-optimized resume builder designed for ambitious professionals.
            </p>
            <div className="cv-footer__privacy-badge">
              <ShieldCheckIcon size={16} />
              <span>100% In-Browser & Private • No Data Uploaded</span>
            </div>
          </div>

          <div className="cv-footer__nav-grid">
            <div className="cv-footer__col">
              <h3 className="cv-footer__heading">Navigation</h3>
              <ul className="cv-footer__list">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/templates">Template Gallery</Link>
                </li>
                <li>
                  <Link to="/create">Create New CV</Link>
                </li>
                <li>
                  <Link to="/import">Import Existing Document</Link>
                </li>
                <li>
                  <Link to="/editor/silicon-modern">Live Editor Preview</Link>
                </li>
              </ul>
            </div>

            <div className="cv-footer__col">
              <h3 className="cv-footer__heading">Core Features</h3>
              <ul className="cv-footer__list">
                <li>
                  <Link to="/templates">50+ Designer Templates</Link>
                </li>
                <li>
                  <Link to="/create">ATS-Optimized Formatting</Link>
                </li>
                <li>
                  <Link to="/create">Rich-Text Editing</Link>
                </li>
                <li>
                  <Link to="/import">Document Import (PDF/DOCX)</Link>
                </li>
                <li>
                  <Link to="/editor/sample-preview">Pixel-Perfect PDF Export</Link>
                </li>
              </ul>
            </div>

            <div className="cv-footer__col">
              <h3 className="cv-footer__heading">Template Styles</h3>
              <ul className="cv-footer__list">
                <li>
                  <Link to="/templates?filter=modern">Modern Tech</Link>
                </li>
                <li>
                  <Link to="/templates?filter=executive">Executive & Leadership</Link>
                </li>
                <li>
                  <Link to="/templates?filter=minimal">Minimal Clean</Link>
                </li>
                <li>
                  <Link to="/templates?filter=academic">Academic & Research</Link>
                </li>
                <li>
                  <Link to="/templates?filter=creative">Creative Portfolio</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="cv-footer__bottom">
          <p className="cv-footer__copyright">
            © {new Date().getFullYear()} CVForge. All rights reserved. Crafted for excellence.
          </p>
          <div className="cv-footer__highlights">
            <span>
              <SparklesIcon size={14} /> Frontend-only architecture
            </span>
            <span className="cv-footer__separator">•</span>
            <span>Zero tracking cookies</span>
            <span className="cv-footer__separator">•</span>
            <span>Instant local storage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
