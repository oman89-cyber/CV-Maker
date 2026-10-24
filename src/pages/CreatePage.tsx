import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileTextIcon,
  LayersIcon,
  UploadIcon,
  ArrowRightIcon,
  SparklesIcon,
  CheckIcon,
} from '../components/common/Icons';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import './CreatePage.css';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<'scratch' | 'template' | 'import'>('scratch');
  const [fullName, setFullName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [targetIndustry, setTargetIndustry] = useState('tech');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMethod === 'template') {
      navigate('/templates');
    } else if (selectedMethod === 'import') {
      navigate('/import');
    } else {
      const cvId = 'silicon-modern';
      navigate(`/editor/${cvId}`, {
        state: {
          fullName: fullName.trim() || undefined,
          targetRole: targetRole.trim() || undefined,
        },
      });
    }
  };

  return (
    <div className="cv-create-page">
      <div className="container">
        <div className="cv-create-header">
          <Badge variant="accent" icon={<SparklesIcon size={14} />}>
            New Document Setup
          </Badge>
          <h1 className="cv-create-title">How would you like to start?</h1>
          <p className="cv-create-subtitle">
            Choose a starting path that matches your current workflow. You can change templates and
            styles anytime in the editor.
          </p>
        </div>

        <form onSubmit={handleCreate} className="cv-create-form">
          {/* Method Selection Cards */}
          <div className="cv-methods-grid">
            {/* Option 1: Scratch */}
            <div
              className={`cv-method-card ${
                selectedMethod === 'scratch' ? 'cv-method-card--selected' : ''
              }`}
              onClick={() => setSelectedMethod('scratch')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedMethod('scratch')}
            >
              <div className="cv-method-card__radio">
                {selectedMethod === 'scratch' && <CheckIcon size={14} />}
              </div>
              <div className="cv-method-card__icon">
                <FileTextIcon size={24} />
              </div>
              <h3 className="cv-method-card__title">Start from scratch</h3>
              <p className="cv-method-card__desc">
                Begin with a clean, structured workspace pre-filled with professional placeholder
                sections.
              </p>
              <span className="cv-method-badge">Recommended for new CVs</span>
            </div>

            {/* Option 2: Template */}
            <div
              className={`cv-method-card ${
                selectedMethod === 'template' ? 'cv-method-card--selected' : ''
              }`}
              onClick={() => setSelectedMethod('template')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedMethod('template')}
            >
              <div className="cv-method-card__radio">
                {selectedMethod === 'template' && <CheckIcon size={14} />}
              </div>
              <div className="cv-method-card__icon">
                <LayersIcon size={24} />
              </div>
              <h3 className="cv-method-card__title">Choose a template</h3>
              <p className="cv-method-card__desc">
                Browse our gallery of 50+ ATS-tailored layouts and launch the editor with your favorite
                design.
              </p>
              <span className="cv-method-badge">50+ layouts available</span>
            </div>

            {/* Option 3: Import */}
            <div
              className={`cv-method-card ${
                selectedMethod === 'import' ? 'cv-method-card--selected' : ''
              }`}
              onClick={() => setSelectedMethod('import')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedMethod('import')}
            >
              <div className="cv-method-card__radio">
                {selectedMethod === 'import' && <CheckIcon size={14} />}
              </div>
              <div className="cv-method-card__icon">
                <UploadIcon size={24} />
              </div>
              <h3 className="cv-method-card__title">Import existing resume</h3>
              <p className="cv-method-card__desc">
                Upload your PDF, DOCX, or JSON document to transfer your experience and credentials.
              </p>
              <span className="cv-method-badge">Fastest if you have a file</span>
            </div>
          </div>

          {/* Quick Profile Setup Card */}
          <Card variant="default" padding="lg" className="cv-quick-setup-card">
            <h2 className="cv-quick-setup__title">Document Details (Optional)</h2>
            <p className="cv-quick-setup__desc">
              Provide these details to auto-populate your CV header, or skip and fill them later in
              the editor.
            </p>

            <div className="cv-setup-fields">
              <div className="cv-field-group">
                <label htmlFor="cv-fullname" className="cv-field-label">
                  Your Full Name
                </label>
                <input
                  id="cv-fullname"
                  type="text"
                  placeholder="e.g. Jordan Miller"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="cv-field-input"
                />
              </div>

              <div className="cv-field-group">
                <label htmlFor="cv-role" className="cv-field-label">
                  Target Job Title
                </label>
                <input
                  id="cv-role"
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="cv-field-input"
                />
              </div>

              <div className="cv-field-group">
                <label htmlFor="cv-industry" className="cv-field-label">
                  Primary Field / Industry
                </label>
                <select
                  id="cv-industry"
                  value={targetIndustry}
                  onChange={(e) => setTargetIndustry(e.target.value)}
                  className="cv-field-select"
                >
                  <option value="tech">Software, Cloud & Engineering</option>
                  <option value="product">Product, Design & UX</option>
                  <option value="executive">Executive & Corporate Leadership</option>
                  <option value="finance">Finance, Banking & Consulting</option>
                  <option value="health">Healthcare & Medicine</option>
                  <option value="academic">Higher Education & Research</option>
                  <option value="other">Other Professional Fields</option>
                </select>
              </div>
            </div>

            <div className="cv-create-actions">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                rightIcon={<ArrowRightIcon size={18} />}
              >
                {selectedMethod === 'template'
                  ? 'Browse Templates'
                  : selectedMethod === 'import'
                  ? 'Proceed to Import'
                  : 'Launch CV Editor'}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};
