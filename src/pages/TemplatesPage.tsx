import React, { useState } from 'react';
import { ArrowRightIcon, SparklesIcon, EyeIcon } from '../components/common/Icons';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import './TemplatesPage.css';

interface TemplateItem {
  id: string;
  name: string;
  category: 'all' | 'modern' | 'executive' | 'minimal' | 'academic' | 'creative';
  categoryLabel: string;
  description: string;
  pages: string;
  tag?: string;
  primaryColor: string;
}

const TEMPLATES_LIST: TemplateItem[] = [
  {
    id: 'silicon-modern',
    name: 'Silicon Modern',
    category: 'modern',
    categoryLabel: 'Tech & Engineering',
    description: 'Crisp two-column hierarchy tailored for software engineers, product managers, and technical leads.',
    pages: '1 Page',
    tag: 'Popular',
    primaryColor: '#2563eb',
  },
  {
    id: 'apex-executive',
    name: 'Apex Executive',
    category: 'executive',
    categoryLabel: 'Leadership & Strategy',
    description: 'Refined header with high-impact metrics focus for directors, VPs, and C-suite leaders.',
    pages: '1-2 Pages',
    tag: 'Executive',
    primaryColor: '#1e3a8a',
  },
  {
    id: 'nordic-minimal',
    name: 'Nordic Clean',
    category: 'minimal',
    categoryLabel: 'Minimalist',
    description: 'Generous white space, subtle typographical contrast, and razor-sharp ATS compliance.',
    pages: '1 Page',
    tag: 'ATS Optimized',
    primaryColor: '#0f172a',
  },
  {
    id: 'oxford-academic',
    name: 'Oxford Scholar',
    category: 'academic',
    categoryLabel: 'Academia & Research',
    description: 'Designed for publications, research grants, teaching appointments, and detailed citations.',
    pages: 'Multi-Page',
    tag: 'Comprehensive',
    primaryColor: '#0f766e',
  },
  {
    id: 'vanguard-tech',
    name: 'Vanguard Systems',
    category: 'modern',
    categoryLabel: 'Data & Cloud',
    description: 'Dedicated sections for technical stacks, cloud certifications, and high-scale architectures.',
    pages: '1 Page',
    tag: 'Technical',
    primaryColor: '#4f46e5',
  },
  {
    id: 'prism-creative',
    name: 'Prism Creative',
    category: 'creative',
    categoryLabel: 'Design & Marketing',
    description: 'Balanced accent touches showcasing portfolio highlights, case studies, and brand narrative.',
    pages: '1-2 Pages',
    tag: 'Portfolio',
    primaryColor: '#7c3aed',
  },
];

export const TemplatesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTemplates = TEMPLATES_LIST.filter((tpl) => {
    const matchesCategory = activeCategory === 'all' || tpl.category === activeCategory;
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="cv-templates-page">
      {/* Page Header */}
      <section className="cv-templates-header">
        <div className="container">
          <Badge variant="accent" icon={<SparklesIcon size={14} />}>
            Curated Template Library
          </Badge>
          <h1 className="cv-templates-title">Explore 50+ Professional Templates</h1>
          <p className="cv-templates-subtitle">
            Recruiter-approved designs crafted for maximum readability, clean typographical
            hierarchy, and 100% ATS parser compatibility.
          </p>

          {/* Filter Bar */}
          <div className="cv-filter-bar">
            <div className="cv-filter-tabs" role="tablist" aria-label="Template categories">
              {[
                { id: 'all', label: 'All Templates' },
                { id: 'modern', label: 'Tech & Modern' },
                { id: 'executive', label: 'Executive' },
                { id: 'minimal', label: 'Minimalist' },
                { id: 'academic', label: 'Academic' },
                { id: 'creative', label: 'Creative' },
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
                placeholder="Search templates by role or style..."
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
                <Card key={template.id} variant="default" padding="none" className="cv-tpl-card">
                  <div className="cv-tpl-card__preview">
                    <div
                      className="cv-tpl-preview-mockup"
                      style={{ borderTopColor: template.primaryColor }}
                    >
                      <div className="cv-tpl-mockup__header">
                        <div
                          className="cv-tpl-mockup__bar"
                          style={{ backgroundColor: template.primaryColor, width: '45%' }}
                        />
                        <div className="cv-tpl-mockup__bar cv-tpl-mockup__bar--sub" />
                      </div>
                      <div className="cv-tpl-mockup__divider" />
                      <div className="cv-tpl-mockup__body">
                        <div className="cv-tpl-mockup__left">
                          <div className="cv-tpl-mockup__line" />
                          <div className="cv-tpl-mockup__line" />
                          <div className="cv-tpl-mockup__line" />
                          <div className="cv-tpl-mockup__line" style={{ width: '80%' }} />
                        </div>
                        <div className="cv-tpl-mockup__right">
                          <div className="cv-tpl-mockup__line" />
                          <div className="cv-tpl-mockup__line" />
                        </div>
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
                  </div>

                  <div className="cv-tpl-card__content">
                    <div>
                      <div className="cv-tpl-card__meta">
                        <span className="cv-tpl-category">{template.categoryLabel}</span>
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
                        to={`/editor/${template.id}?preview=true`}
                        variant="ghost"
                        size="sm"
                        leftIcon={<EyeIcon size={14} />}
                      >
                        Preview
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Import Callout */}
          <div className="cv-templates-import-banner">
            <div>
              <h3 className="cv-import-banner__title">Have an existing resume ready?</h3>
              <p className="cv-import-banner__desc">
                Import your PDF, DOCX, or JSON resume and apply any of these 50+ templates with one
                click.
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
    </div>
  );
};
