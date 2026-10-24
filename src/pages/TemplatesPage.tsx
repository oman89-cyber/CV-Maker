import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, SparklesIcon, EyeIcon } from '../components/common/Icons';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CVRenderer } from '../components/cv/CVRenderer';
import { DEFAULT_CV_DATA } from '../types/cv';
import { TEMPLATES_REGISTRY, type TemplateConfig } from '../data/templates';
import './TemplatesPage.css';

export const TemplatesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewModalTemplate, setPreviewModalTemplate] = useState<TemplateConfig | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewModalTemplate(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTemplates = TEMPLATES_REGISTRY.filter((tpl) => {
    const matchesCategory =
      activeCategory === 'all' ||
      tpl.category === activeCategory ||
      (activeCategory === 'executive' && (tpl.category === 'executive' || tpl.id === 'finance-professional')) ||
      (activeCategory === 'minimal' && (tpl.category === 'minimal' || tpl.id === 'ats-classic'));

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      tpl.name.toLowerCase().includes(query) ||
      tpl.family.toLowerCase().includes(query) ||
      tpl.categoryLabel.toLowerCase().includes(query) ||
      tpl.description.toLowerCase().includes(query) ||
      (tpl.tag && tpl.tag.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="cv-templates-page">
      {/* Page Header */}
      <section className="cv-templates-header">
        <div className="container">
          <Badge variant="accent" icon={<SparklesIcon size={14} />}>
            Curated Design System
          </Badge>
          <h1 className="cv-templates-title">Explore 10 Distinct Resume Design Families</h1>
          <p className="cv-templates-subtitle">
            Recruiter-approved, art-directed layouts designed with deliberate typography,
            balanced grid hierarchies, and 100% ATS parser fidelity.
          </p>

          {/* Filter Bar */}
          <div className="cv-filter-bar">
            <div className="cv-filter-tabs" role="tablist" aria-label="Template categories">
              {[
                { id: 'all', label: 'All Families (10)' },
                { id: 'modern', label: 'Tech & Modern' },
                { id: 'executive', label: 'Executive & Finance' },
                { id: 'minimal', label: 'Minimalist & ATS' },
                { id: 'academic', label: 'Academic & Science' },
                { id: 'creative', label: 'Creative & Portfolio' },
                { id: 'graduate', label: 'Early Career & Grads' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeCategory === tab.id}
                  className={`cv-filter-tab ${
                    activeCategory === tab.id ? 'cv-filter-tab--active' : ''
                  }`}
                  onClick={() => setActiveCategory(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="cv-search-box">
              <input
                type="text"
                placeholder="Search by role, style, or family..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cv-search-input"
                aria-label="Search templates"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="cv-templates-grid-section">
        <div className="container">
          {filteredTemplates.length === 0 ? (
            <div className="cv-empty-state">
              <h3>No matching templates found</h3>
              <p>Try selecting a different category or clearing your search term.</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="cv-templates-grid">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="cv-tpl-card">
                  {/* Real Miniature Preview */}
                  <div className="cv-tpl-card__preview">
                    <div className="cv-tpl-real-miniature">
                      <div className="cv-tpl-real-miniature__scale">
                        <CVRenderer cvData={DEFAULT_CV_DATA} template={template} />
                      </div>
                    </div>

                    <div className="cv-tpl-card__badges">
                      {template.tag && (
                        <Badge variant="accent" size="sm">
                          {template.tag}
                        </Badge>
                      )}
                      <span className="cv-tpl-badge-pages">{template.pages}</span>
                    </div>

                    {/* Hover Overlay with Quick Preview */}
                    <div className="cv-tpl-card__overlay">
                      <button
                        type="button"
                        className="cv-tpl-overlay-btn"
                        onClick={() => setPreviewModalTemplate(template)}
                        title={`Full Preview of ${template.name}`}
                      >
                        <EyeIcon size={15} />
                        <span>Quick Preview</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Content & Actions */}
                  <div className="cv-tpl-card__content">
                    <div>
                      <div className="cv-tpl-card__meta">
                        <span
                          className="cv-tpl-family-dot"
                          style={{ backgroundColor: template.primaryColor }}
                        />
                        <span className="cv-tpl-category">{template.family}</span>
                      </div>
                      <h3 className="cv-tpl-card__title">{template.name}</h3>
                      <p className="cv-tpl-card__desc">{template.description}</p>
                    </div>

                    <div className="cv-tpl-card__actions">
                      <Button
                        to={`/editor/${template.id}`}
                        variant="primary"
                        size="sm"
                        fullWidth
                        rightIcon={<ArrowRightIcon size={14} />}
                      >
                        Use this template
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<EyeIcon size={14} />}
                        onClick={() => setPreviewModalTemplate(template)}
                      >
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Import Callout */}
          <div className="cv-templates-import-banner">
            <div>
              <h3 className="cv-import-banner__title">Have an existing resume ready?</h3>
              <p className="cv-import-banner__desc">
                Import your existing document and apply any of these 10 art-directed design families
                with real-time typography and layout adaptation.
              </p>
            </div>
            <Button
              to="/import"
              variant="secondary"
              size="md"
              rightIcon={<ArrowRightIcon size={16} />}
            >
              Import document
            </Button>
          </div>
        </div>
      </section>

      {/* Full-Size Interactive Template Preview Modal Dialog */}
      {previewModalTemplate && (
        <div
          className="cv-modal-backdrop"
          onClick={() => setPreviewModalTemplate(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Preview of ${previewModalTemplate.name}`}
        >
          <div className="cv-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="cv-modal-header">
              <div>
                <h2 className="cv-modal-title">{previewModalTemplate.name}</h2>
                <span className="cv-modal-subtitle">
                  Family: <strong>{previewModalTemplate.family}</strong> • Layout:{' '}
                  {previewModalTemplate.layoutEngine} • Typography:{' '}
                  {previewModalTemplate.fontFamily}
                </span>
              </div>
              <button
                type="button"
                className="cv-modal-close-btn"
                onClick={() => setPreviewModalTemplate(null)}
                aria-label="Close Preview"
              >
                ✕
              </button>
            </div>

            <div className="cv-modal-body">
              <div className="cv-modal-cv-container">
                <CVRenderer cvData={DEFAULT_CV_DATA} template={previewModalTemplate} />
              </div>
            </div>

            <div className="cv-modal-footer">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setPreviewModalTemplate(null)}
              >
                Close Preview
              </Button>
              <Button
                to={`/editor/${previewModalTemplate.id}`}
                variant="primary"
                size="md"
                rightIcon={<ArrowRightIcon size={16} />}
              >
                Use this template
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
