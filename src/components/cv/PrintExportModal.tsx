import React from 'react';
import {
  PrinterIcon,
  XIcon,
  EyeIcon,
  CheckCircleIcon,
  SparklesIcon,
} from '../common/Icons';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import './PrintExportModal.css';

export interface PrintExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
  onTogglePreview: () => void;
  pageSize: 'a4' | 'letter';
  onPageSizeChange: (size: 'a4' | 'letter') => void;
  templateName: string;
  candidateName: string;
  hasPhoto?: boolean;
}

export const PrintExportModal: React.FC<PrintExportModalProps> = ({
  isOpen,
  onClose,
  onPrint,
  onTogglePreview,
  pageSize,
  onPageSizeChange,
  templateName,
  candidateName,
  hasPhoto = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="cv-print-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-modal-title"
    >
      <div
        className="cv-print-modal"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="cv-print-modal__header">
          <div className="cv-print-modal__header-left">
            <div className="cv-print-modal__icon-wrap">
              <PrinterIcon size={22} className="cv-print-modal__icon" />
            </div>
            <div>
              <h2 id="print-modal-title" className="cv-print-modal__title">
                Export CV as PDF
              </h2>
              <div className="cv-print-modal__meta">
                <span className="cv-print-modal__candidate">{candidateName || 'Untitled CV'}</span>
                <span className="cv-print-modal__dot">•</span>
                <Badge variant="accent" size="sm">
                  {templateName}
                </Badge>
                {hasPhoto && (
                  <Badge variant="neutral" size="sm">
                    Photo Included
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="cv-print-modal__close"
            onClick={onClose}
            aria-label="Close export dialog"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="cv-print-modal__body">
          {/* Section: Page Format */}
          <div className="cv-print-section">
            <label className="cv-print-section__label">1. Choose Page Format</label>
            <p className="cv-print-section__desc">
              Select standard A4 or US Letter. Margins and layouts calibrate automatically.
            </p>
            <div className="cv-page-format-grid" role="radiogroup" aria-label="Page format selection">
              <button
                type="button"
                role="radio"
                aria-checked={pageSize === 'a4'}
                className={`cv-page-format-card ${
                  pageSize === 'a4' ? 'cv-page-format-card--active' : ''
                }`}
                onClick={() => onPageSizeChange('a4')}
              >
                <div className="cv-page-format-card__header">
                  <span className="cv-page-format-card__name">A4 Format</span>
                  <span className="cv-page-format-card__badge">Default</span>
                </div>
                <div className="cv-page-format-card__dimensions">210 × 297 mm</div>
                <div className="cv-page-format-card__desc">
                  Standard format for UK, Europe, Asia, Latin America, Australia, and Africa.
                </div>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={pageSize === 'letter'}
                className={`cv-page-format-card ${
                  pageSize === 'letter' ? 'cv-page-format-card--active' : ''
                }`}
                onClick={() => onPageSizeChange('letter')}
              >
                <div className="cv-page-format-card__header">
                  <span className="cv-page-format-card__name">US Letter</span>
                  <span className="cv-page-format-card__badge">North America</span>
                </div>
                <div className="cv-page-format-card__dimensions">8.5 × 11.0 in (216 × 279 mm)</div>
                <div className="cv-page-format-card__desc">
                  Standard format for employers in the United States and Canada.
                </div>
              </button>
            </div>
          </div>

          {/* Section: Browser Print Dialog Guide */}
          <div className="cv-print-section">
            <div className="cv-print-guide-card">
              <div className="cv-print-guide-card__header">
                <SparklesIcon size={16} className="cv-print-guide-card__icon" />
                <span className="cv-print-guide-card__title">
                  Recommended Browser Print Dialog Settings
                </span>
              </div>
              <p className="cv-print-guide-card__desc">
                When the browser print dialog opens, ensure these settings are selected for pixel-perfect PDF export:
              </p>
              <div className="cv-print-checklist">
                <div className="cv-print-check-item">
                  <CheckCircleIcon size={16} className="cv-print-check-icon" />
                  <div>
                    <strong>Destination:</strong> Set to <em>&ldquo;Save as PDF&rdquo;</em> (or Microsoft Print to PDF).
                  </div>
                </div>
                <div className="cv-print-check-item">
                  <CheckCircleIcon size={16} className="cv-print-check-icon" />
                  <div>
                    <strong>Background Graphics:</strong> <em>Check / Enable</em> to render colors, banners, and badge styles.
                  </div>
                </div>
                <div className="cv-print-check-item">
                  <CheckCircleIcon size={16} className="cv-print-check-icon" />
                  <div>
                    <strong>Margins:</strong> Set to <em>&ldquo;None&rdquo;</em> or <em>&ldquo;Default&rdquo;</em> (templates contain balanced built-in spacing).
                  </div>
                </div>
                <div className="cv-print-check-item">
                  <CheckCircleIcon size={16} className="cv-print-check-icon" />
                  <div>
                    <strong>Headers and Footers:</strong> <em>Uncheck / Disable</em> to eliminate browser URLs, titles, and dates.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Optional On-Screen Preview CTA */}
          <div className="cv-print-preview-cta">
            <div className="cv-print-preview-cta__text">
              <strong>Want to check page layout first?</strong> Inspect your CV in full-screen distraction-free mode.
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              leftIcon={<EyeIcon size={15} />}
              onClick={() => {
                onClose();
                onTogglePreview();
              }}
            >
              Full-Screen Preview
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="cv-print-modal__footer">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            leftIcon={<PrinterIcon size={18} />}
            onClick={onPrint}
          >
            Open Print Dialog / Save as PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
