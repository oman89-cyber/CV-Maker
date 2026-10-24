import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileTextIcon,
  DownloadIcon,
  SparklesIcon,
  CheckCircleIcon,
  LayersIcon,
  Edit3Icon,
} from '../components/common/Icons';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import './EditorPage.css';

export const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [docTitle, setDocTitle] = useState('Senior Software Engineer CV');
  const [activeTab, setActiveTab] = useState<'content' | 'appearance' | 'sections'>('content');
  const [selectedSection, setSelectedSection] = useState('personal');

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
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="cv-doc-title-input"
              aria-label="Document Title"
            />
          </div>
          <Badge variant="accent" size="sm">
            Template: {id || 'default-modern'}
          </Badge>
          <div className="cv-editor-saved-status">
            <CheckCircleIcon size={14} />
            <span>Saved locally</span>
          </div>
        </div>

        <div className="cv-editor-toolbar__right">
          <Button
            to="/templates"
            variant="ghost"
            size="sm"
            leftIcon={<LayersIcon size={16} />}
          >
            Change Template
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<DownloadIcon size={16} />}
            onClick={() =>
              alert(
                'PDF Export Engine will be attached in Stage 2. The foundation and layout are ready.'
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

          {/* Form Foundation Box */}
          <div className="cv-section-form-container">
            <div className="cv-form-header">
              <h3 className="cv-form-title">
                {editorSections.find((s) => s.id === selectedSection)?.label || 'Section Details'}
              </h3>
              <Badge variant="neutral" size="sm">
                Stage 1 Foundation
              </Badge>
            </div>

            <div className="cv-form-placeholder-body">
              <p className="cv-form-notice">
                Form inputs and rich-text editing controls will plug into this modular container in
                Stage 2.
              </p>

              <div className="cv-form-sample-fields">
                <div className="cv-form-sample-row">
                  <div className="cv-form-sample-input" />
                  <div className="cv-form-sample-input" />
                </div>
                <div className="cv-form-sample-input" style={{ width: '85%' }} />
                <div className="cv-form-sample-textarea" />
              </div>

              <div className="cv-form-cta-strip">
                <Button
                  to="/templates"
                  variant="secondary"
                  size="sm"
                  leftIcon={<LayersIcon size={14} />}
                >
                  Explore other layouts
                </Button>
                <Button
                  to="/import"
                  variant="ghost"
                  size="sm"
                  leftIcon={<Edit3Icon size={14} />}
                >
                  Import existing data
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side: Live A4 Document Preview Canvas */}
        <section className="cv-editor-preview-canvas" aria-label="Live CV Preview">
          <div className="cv-canvas-bar">
            <div className="cv-canvas-bar__info">
              <SparklesIcon size={16} />
              <span>Standard A4 Preview • Scale 100%</span>
            </div>
            <div className="cv-canvas-bar__actions">
              <span className="cv-canvas-badge">Ready for Stage 2 Rich-Text Engine</span>
            </div>
          </div>

          <div className="cv-preview-scroll-area">
            {/* A4 Sheet Container */}
            <div className="cv-a4-sheet">
              {/* Document Header */}
              <div className="cv-doc-header">
                <div>
                  <h1 className="cv-doc-name">Alexander Wright</h1>
                  <div className="cv-doc-role">Principal Platform Architect & Engineering Lead</div>
                </div>
                <div className="cv-doc-contact">
                  <div>alexander.wright@domain.com</div>
                  <div>+1 (555) 019-2834</div>
                  <div>San Francisco, CA • linkedin.com/in/awright</div>
                </div>
              </div>

              <div className="cv-doc-divider" />

              {/* Summary */}
              <div className="cv-doc-section">
                <h2 className="cv-doc-section-heading">Professional Summary</h2>
                <p className="cv-doc-body-text">
                  Engineering leader with 10+ years specializing in distributed systems, real-time
                  data streaming, and leading high-velocity frontend architecture teams. Proven track
                  record scaling consumer services from seed stage to 50M+ monthly active users.
                </p>
              </div>

              {/* Experience */}
              <div className="cv-doc-section">
                <h2 className="cv-doc-section-heading">Work Experience</h2>

                <div className="cv-doc-item">
                  <div className="cv-doc-item__header">
                    <div>
                      <span className="cv-doc-item__title">Principal Software Engineer</span> —{' '}
                      <span className="cv-doc-item__company">Apex Systems Cloud</span>
                    </div>
                    <span className="cv-doc-item__date">2022 — Present</span>
                  </div>
                  <ul className="cv-doc-bullet-list">
                    <li>
                      Designed micro-frontend architecture decreasing page bundle sizes by 48% across 6
                      core user portals.
                    </li>
                    <li>
                      Architected high-throughput event processing pipeline handling 120,000 req/sec at
                      sub-10ms p99 latency.
                    </li>
                    <li>
                      Mentored 14 senior engineers and established company-wide TypeScript quality
                      guidelines.
                    </li>
                  </ul>
                </div>

                <div className="cv-doc-item">
                  <div className="cv-doc-item__header">
                    <div>
                      <span className="cv-doc-item__title">Senior Full Stack Engineer</span> —{' '}
                      <span className="cv-doc-item__company">Hyperion Labs</span>
                    </div>
                    <span className="cv-doc-item__date">2018 — 2022</span>
                  </div>
                  <ul className="cv-doc-bullet-list">
                    <li>
                      Led delivery of collaborative real-time editor using WebSocket protocols and CRDTs.
                    </li>
                    <li>Reduced continuous integration build times from 18 minutes to 4.2 minutes.</li>
                  </ul>
                </div>
              </div>

              {/* Skills */}
              <div className="cv-doc-section">
                <h2 className="cv-doc-section-heading">Technical Expertise</h2>
                <div className="cv-doc-skills-row">
                  <span className="cv-doc-skill-pill">TypeScript / JavaScript</span>
                  <span className="cv-doc-skill-pill">React & Next.js</span>
                  <span className="cv-doc-skill-pill">Node.js</span>
                  <span className="cv-doc-skill-pill">PostgreSQL / Redis</span>
                  <span className="cv-doc-skill-pill">Kubernetes & Docker</span>
                  <span className="cv-doc-skill-pill">GraphQL / REST</span>
                  <span className="cv-doc-skill-pill">System Architecture</span>
                </div>
              </div>

              {/* Education */}
              <div className="cv-doc-section">
                <h2 className="cv-doc-section-heading">Education</h2>
                <div className="cv-doc-item__header">
                  <div>
                    <span className="cv-doc-item__title">B.S. in Computer Science & Mathematics</span>{' '}
                    — <span className="cv-doc-item__company">University of California, Berkeley</span>
                  </div>
                  <span className="cv-doc-item__date">Graduated with Honors</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
