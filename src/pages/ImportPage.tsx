import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  FileTextIcon,
  CheckCircleIcon,
  SparklesIcon,
} from '../components/common/Icons';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import './ImportPage.css';

export const ImportPage: React.FC = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleProceed = () => {
    const importId = selectedFile
      ? `import-${selectedFile.name.replace(/\.[^/.]+$/, '').toLowerCase()}`
      : 'imported-doc';
    navigate(`/editor/${importId}`);
  };

  return (
    <div className="cv-import-page">
      <div className="container">
        <div className="cv-import-header">
          <Badge variant="accent" icon={<SparklesIcon size={14} />}>
            Seamless Document Migration
          </Badge>
          <h1 className="cv-import-title">Import your existing document</h1>
          <p className="cv-import-subtitle">
            Skip the manual data entry. Upload your current CV or resume, and our in-browser engine
            will organize your achievements into any template.
          </p>
        </div>

        <div className="cv-import-content">
          {/* Upload Dropzone */}
          <Card variant="default" padding="lg" className="cv-dropzone-card">
            <div
              className={`cv-dropzone ${dragActive ? 'cv-dropzone--active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload-input"
                className="cv-file-input"
                accept=".pdf,.docx,.json,.txt"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload-input" className="cv-dropzone-label">
                <div className="cv-dropzone-icon">
                  <UploadIcon size={32} />
                </div>
                <div className="cv-dropzone-prompt">
                  <span className="cv-dropzone-browse">Click to browse</span> or drag and drop your file here
                </div>
                <p className="cv-dropzone-formats">
                  Supported formats: PDF, DOCX (Word), JSON, TXT (up to 15MB)
                </p>
              </label>
            </div>

            {selectedFile && (
              <div className="cv-selected-file">
                <div className="cv-selected-file__info">
                  <FileTextIcon size={24} className="cv-selected-file__icon" />
                  <div>
                    <div className="cv-selected-file__name">{selectedFile.name}</div>
                    <div className="cv-selected-file__size">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Ready for extraction
                    </div>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleProceed}
                  rightIcon={<ArrowRightIcon size={16} />}
                >
                  Proceed to editor
                </Button>
              </div>
            )}

            <div className="cv-import-formats-strip">
              <span className="cv-format-badge">.PDF Documents</span>
              <span className="cv-format-badge">.DOCX Microsoft Word</span>
              <span className="cv-format-badge">.JSON Structured Data</span>
              <span className="cv-format-badge">Plain Text (.TXT)</span>
            </div>
          </Card>

          {/* Privacy & Stage Notice */}
          <div className="cv-import-security-grid">
            <div className="cv-security-item">
              <ShieldCheckIcon size={22} />
              <div>
                <h3 className="cv-security-title">100% In-Browser Extraction</h3>
                <p className="cv-security-desc">
                  Your files are parsed strictly in client memory. No resumes or personal contact
                  details ever leave your machine.
                </p>
              </div>
            </div>

            <div className="cv-security-item">
              <CheckCircleIcon size={22} />
              <div>
                <h3 className="cv-security-title">Preserves All History</h3>
                <p className="cv-security-desc">
                  Dates, role titles, company names, and bullet points are preserved so you can focus
                  on refining content rather than retyping.
                </p>
              </div>
            </div>
          </div>

          {/* Alternative action */}
          <div className="cv-import-fallback">
            <span>Prefer to pick a design first?</span>
            <Button to="/templates" variant="secondary" size="sm">
              Explore 50+ templates
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
