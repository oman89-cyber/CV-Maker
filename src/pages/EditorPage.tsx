import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FileTextIcon,
  DownloadIcon,
  SparklesIcon,
  CheckCircleIcon,
  LayersIcon,
} from '../components/common/Icons';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CVRenderer } from '../components/cv/CVRenderer';
import { type CVData, DEFAULT_CV_DATA } from '../types/cv';
import { TEMPLATES_REGISTRY, getTemplateById } from '../data/templates';
import './EditorPage.css';

const STORAGE_KEY = 'cvforge_active_document';

export const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const currentTemplate = getTemplateById(id);

  // Initialize CV Data with preservation from localStorage or router state
  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const baseData = saved ? JSON.parse(saved) : DEFAULT_CV_DATA;

      // If user came from CreatePage with pre-filled state
      const navState = location.state as { fullName?: string; targetRole?: string } | null;
      if (navState && (navState.fullName || navState.targetRole)) {
        return {
          ...baseData,
          personal: {
            ...baseData.personal,
            fullName: navState.fullName || baseData.personal.fullName,
            targetRole: navState.targetRole || baseData.personal.targetRole,
          },
        };
      }
      return baseData;
    } catch {
      return DEFAULT_CV_DATA;
    }
  });

  const [activeTab, setActiveTab] = useState<'content' | 'appearance' | 'sections'>('content');
  const [selectedSection, setSelectedSection] = useState('personal');

  // Persist CV data to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [cvData]);

  const handleTemplateChange = (newTemplateId: string) => {
    navigate(`/editor/${newTemplateId}`);
  };

  const updatePersonalInfo = (field: keyof typeof cvData.personal, value: string) => {
    setCvData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  const editorSections = [
    { id: 'personal', label: 'Personal Information', completed: true },
    { id: 'summary', label: 'Professional Summary', completed: true },
    { id: 'experience', label: 'Work Experience', completed: true },
    { id: 'education', label: 'Education & Degrees', completed: true },
    { id: 'skills', label: 'Skills & Competencies', completed: true },
    { id: 'projects', label: 'Key Projects & Highlights', completed: false },
  ];

  return (
    <div className="cv-editor-page">
      {/* Editor Sub-Header Toolbar */}
      <div className="cv-editor-toolbar">
        <div className="cv-editor-toolbar__left">
          <Link to="/templates" className="cv-editor-back-link">
            ← Templates
          </Link>
          <div className="cv-editor-doc-title">
            <input
              type="text"
              value={cvData.title}
              onChange={(e) =>
                setCvData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="cv-doc-title-input"
              aria-label="Document Title"
            />
          </div>
          <Badge variant="accent" size="sm">
            Template: {currentTemplate.name}
          </Badge>
          <div className="cv-editor-saved-status">
            <CheckCircleIcon size={14} />
            <span>Saved locally</span>
          </div>
        </div>

        <div className="cv-editor-toolbar__right">
          {/* Quick template selector to verify data preservation */}
          <div className="cv-template-quick-select">
            <label htmlFor="quick-tpl" className="sr-only">Switch Template</label>
            <select
              id="quick-tpl"
              value={currentTemplate.id}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="cv-quick-tpl-select"
              aria-label="Switch CV Template"
            >
              {TEMPLATES_REGISTRY.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.categoryLabel})
                </option>
              ))}
            </select>
          </div>

          <Button
            to="/templates"
            variant="ghost"
            size="sm"
            leftIcon={<LayersIcon size={16} />}
          >
            All Templates
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<DownloadIcon size={16} />}
            onClick={() =>
              alert(
                'PDF Export Engine will be attached in Stage 2. Your document and template layout are active.'
              )
            }
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Editor Main Two-Pane Workspace */}
      <div className="cv-editor-workspace">
        {/* Left Side: Navigation & Form Controls */}
        <aside className="cv-editor-sidebar" aria-label="Editor sections">
          <div className="cv-sidebar-tabs">
            <button
              className={`cv-sidebar-tab ${activeTab === 'content' ? 'cv-sidebar-tab--active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              Content
            </button>
            <button
              className={`cv-sidebar-tab ${activeTab === 'appearance' ? 'cv-sidebar-tab--active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              Design & Colors
            </button>
            <button
              className={`cv-sidebar-tab ${activeTab === 'sections' ? 'cv-sidebar-tab--active' : ''}`}
              onClick={() => setActiveTab('sections')}
            >
              Manage Sections
            </button>
          </div>

          <div className="cv-sidebar-section-list">
            <div className="cv-sidebar-section-list__title">CV Sections</div>
            {editorSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSection(sec.id)}
                className={`cv-section-nav-item ${
                  selectedSection === sec.id ? 'cv-section-nav-item--active' : ''
                }`}
              >
                <div className="cv-section-nav-item__left">
                  <FileTextIcon size={16} />
                  <span>{sec.label}</span>
                </div>
                {sec.completed && (
                  <span className="cv-section-status-check">
                    <CheckCircleIcon size={14} />
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Form Editing / Foundation Box */}
          <div className="cv-section-form-container">
            <div className="cv-form-header">
              <h3 className="cv-form-title">
                {editorSections.find((s) => s.id === selectedSection)?.label || 'Section Details'}
              </h3>
              <Badge variant="neutral" size="sm">
                Interactive Preview
              </Badge>
            </div>

            <div className="cv-form-placeholder-body">
              {selectedSection === 'personal' ? (
                <div className="cv-edit-fields">
                  <div className="cv-form-group">
                    <label className="cv-label" htmlFor="edit-name">Full Name</label>
                    <input
                      id="edit-name"
                      type="text"
                      className="cv-input"
                      value={cvData.personal.fullName}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label className="cv-label" htmlFor="edit-role">Target Role / Title</label>
                    <input
                      id="edit-role"
                      type="text"
                      className="cv-input"
                      value={cvData.personal.targetRole}
                      onChange={(e) => updatePersonalInfo('targetRole', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label className="cv-label" htmlFor="edit-email">Email Address</label>
                    <input
                      id="edit-email"
                      type="email"
                      className="cv-input"
                      value={cvData.personal.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    />
                  </div>
                  <div className="cv-form-group">
                    <label className="cv-label" htmlFor="edit-phone">Phone Number</label>
                    <input
                      id="edit-phone"
                      type="text"
                      className="cv-input"
                      value={cvData.personal.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    />
                  </div>
                </div>
              ) : selectedSection === 'summary' ? (
                <div className="cv-edit-fields">
                  <div className="cv-form-group">
                    <label className="cv-label" htmlFor="edit-summary">Professional Summary</label>
                    <textarea
                      id="edit-summary"
                      className="cv-textarea"
                      rows={5}
                      value={cvData.summary}
                      onChange={(e) =>
                        setCvData((prev) => ({ ...prev, summary: e.target.value }))
                      }
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p className="cv-form-notice">
                    Full structured controls for {selectedSection} will integrate with Tiptap rich-text editing in the next stage.
                  </p>
                  <p className="cv-form-notice" style={{ marginTop: '8px' }}>
                    Current data is safely preserved across all template switches.
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Right Side: Live A4 Document Preview Canvas */}
        <section className="cv-editor-preview-canvas" aria-label="Live CV Preview">
          <div className="cv-canvas-bar">
            <div className="cv-canvas-bar__info">
              <SparklesIcon size={16} />
              <span>
                Standard A4 Preview • Active Template: <strong>{currentTemplate.name}</strong>
              </span>
            </div>
            <div className="cv-canvas-bar__actions">
              <span className="cv-canvas-badge">Dynamic Template Renderer</span>
            </div>
          </div>

          <div className="cv-preview-scroll-area">
            {/* Template-aware dynamic CV Renderer */}
            <CVRenderer cvData={cvData} template={currentTemplate} />
          </div>
        </section>
      </div>
    </div>
  );
};
