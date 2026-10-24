import React from 'react';
import { ArrowRightIcon, FileTextIcon } from '../components/common/Icons';
import { Button } from '../components/common/Button';
import './NotFoundPage.css';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="cv-not-found-page">
      <div className="container cv-not-found-container">
        <div className="cv-not-found-icon">
          <FileTextIcon size={48} />
        </div>
        <span className="cv-not-found-code">404</span>
        <h1 className="cv-not-found-title">Page not found</h1>
        <p className="cv-not-found-desc">
          The page or CV document you requested does not exist or may have been moved.
        </p>
        <div className="cv-not-found-actions">
          <Button to="/" variant="primary" size="md" rightIcon={<ArrowRightIcon size={16} />}>
            Return to Home
          </Button>
          <Button to="/templates" variant="secondary" size="md">
            Explore Templates
          </Button>
        </div>
      </div>
    </div>
  );
};
