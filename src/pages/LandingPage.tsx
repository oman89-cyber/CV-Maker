import React from 'react';
import {
  SparklesIcon,
  LayersIcon,
  Edit3Icon,
  UploadIcon,
  DownloadIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ZapIcon,
  EyeIcon,
} from '../components/common/Icons';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const featuredTemplates = [
    {
      id: 'apex-executive',
      name: 'Executive Prestige',
      category: 'Leadership & Strategy',
      tag: 'Executive',
      color: '#1e3a8a',
      accentLabel: 'Navy Prestige',
    },
    {
      id: 'silicon-modern',
      name: 'Silicon Elite',
      category: 'Tech & Engineering',
      tag: 'Most Popular',
      color: '#2563eb',
      accentLabel: 'Cobalt Elite',
    },
    {
      id: 'nordic-minimal',
      name: 'Swiss Editorial',
      category: 'Minimalist & Design',
      tag: 'ATS Optimized',
      color: '#0f172a',
      accentLabel: 'Slate Neutral',
    },
    {
      id: 'oxford-academic',
      name: 'Academic Research',
      category: 'Academia & Science',
      tag: 'Comprehensive',
      color: '#0f766e',
      accentLabel: 'Oxford Teal',
    },
  ];

  return (
    <div className="cv-landing">
      {/* 1. Hero Section */}
      <section className="cv-hero-section" aria-labelledby="hero-heading">
        <div className="container">
          <div className="cv-hero-grid">
            <div className="cv-hero-content">
              <Badge variant="accent" icon={<SparklesIcon size={14} />}>
                Built for modern ATS scanners & recruiters
              </Badge>

              <h1 id="hero-heading" className="cv-hero-title">
                Build a CV that <span className="cv-hero-title__highlight">opens doors.</span>
              </h1>

              <p className="cv-hero-subtitle">
                Craft a standout, ATS-optimized curriculum vitae in minutes. Choose from 50+
                designer templates, tailor your narrative with rich-text controls, and export
                pixel-perfect PDFs — 100% private in your browser.
              </p>

              <div className="cv-hero-actions">
                <Button
                  to="/create"
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRightIcon size={18} />}
                >
                  Create my CV
                </Button>
                <Button
                  to="/templates"
                  variant="secondary"
                  size="lg"
                  leftIcon={<LayersIcon size={18} />}
                >
                  Explore templates
                </Button>
              </div>

              <div className="cv-hero-trust-list">
                <span className="cv-trust-item">
                  <CheckCircleIcon size={16} /> Free & Frontend-Only
                </span>
                <span className="cv-trust-item">
                  <CheckCircleIcon size={16} /> ATS-Friendly Formatting
                </span>
                <span className="cv-trust-item">
                  <CheckCircleIcon size={16} /> No Sign-Up Needed
                </span>
              </div>
            </div>

            {/* Hero Visual Mockup */}
            <div className="cv-hero-visual" aria-hidden="true">
              <div className="cv-mockup-wrapper">
                <div className="cv-mockup-badge">
                  <SparklesIcon size={14} /> 98% ATS Match Rating
                </div>

                <div className="cv-resume-sheet">
                  {/* Resume Header */}
                  <div className="cv-sheet-header">
                    <div className="cv-sheet-avatar">AM</div>
                    <div className="cv-sheet-heading">
                      <div className="cv-sheet-name">Alex Morgan</div>
                      <div className="cv-sheet-role">Staff Software Engineer</div>
                      <div className="cv-sheet-contact">
                        San Francisco, CA • alex.morgan@example.com • github.com/alexm
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="cv-sheet-section">
                    <div className="cv-sheet-section-title">Professional Summary</div>
                    <p className="cv-sheet-text">
                      High-impact engineer with 8+ years architecting scalable cloud systems and
                      leading cross-functional product teams. Specialized in TypeScript, React, and
                      distributed microservices.
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="cv-sheet-section">
                    <div className="cv-sheet-section-title">Experience</div>
                    <div className="cv-sheet-item">
                      <div className="cv-sheet-item-row">
                        <span className="cv-sheet-item-bold">Lead Platform Architect</span>
                        <span className="cv-sheet-item-meta">2021 — Present</span>
                      </div>
                      <div className="cv-sheet-item-sub">Vanguard Systems • San Francisco, CA</div>
                      <ul className="cv-sheet-bullets">
                        <li>Scaled core API throughput by 340% serving 45M+ daily requests.</li>
                        <li>Spearheaded design system migration reducing UI release cycles by 60%.</li>
                      </ul>
                    </div>

                    <div className="cv-sheet-item">
                      <div className="cv-sheet-item-row">
                        <span className="cv-sheet-item-bold">Senior Full Stack Engineer</span>
                        <span className="cv-sheet-item-meta">2018 — 2021</span>
                      </div>
                      <div className="cv-sheet-item-sub">CloudScale Technologies</div>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="cv-sheet-section">
                    <div className="cv-sheet-section-title">Core Competencies</div>
                    <div className="cv-sheet-tags">
                      <span>TypeScript</span>
                      <span>React</span>
                      <span>Next.js</span>
                      <span>System Design</span>
                      <span>PostgreSQL</span>
                      <span>Cloud Architecture</span>
                    </div>
                  </div>
                </div>

                {/* Floating pill */}
                <div className="cv-mockup-floating-pill">
                  <DownloadIcon size={16} />
                  <span>Pixel-Perfect Vector PDF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats & Proof Strip */}
      <section className="cv-stats-section">
        <div className="container">
          <div className="cv-stats-grid">
            <div className="cv-stat-box">
              <div className="cv-stat-number">50+</div>
              <div className="cv-stat-label">Designer Templates</div>
            </div>
            <div className="cv-stat-divider" />
            <div className="cv-stat-box">
              <div className="cv-stat-number">100%</div>
              <div className="cv-stat-label">Client-Side Privacy</div>
            </div>
            <div className="cv-stat-divider" />
            <div className="cv-stat-box">
              <div className="cv-stat-number">&lt; 5m</div>
              <div className="cv-stat-label">Average Build Time</div>
            </div>
            <div className="cv-stat-divider" />
            <div className="cv-stat-box">
              <div className="cv-stat-number">0</div>
              <div className="cv-stat-label">Paywalls or Subscriptions</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Feature Pillars Section */}
      <section className="cv-features-section" aria-labelledby="features-heading">
        <div className="container">
          <div className="cv-section-header">
            <Badge variant="accent">Everything You Need</Badge>
            <h2 id="features-heading" className="cv-section-title">
              Engineered for job seekers who want results
            </h2>
            <p className="cv-section-subtitle">
              CVForge pairs professional typographical standards with effortless controls so your
              skills and career trajectory shine on every recruiter's screen.
            </p>
          </div>

          <div className="cv-features-grid">
            {/* Feature 1: 50+ Templates */}
            <Card variant="interactive" padding="lg" className="cv-feature-card">
              <div className="cv-feature-icon-wrapper">
                <LayersIcon size={24} />
              </div>
              <h3 className="cv-feature-card__title">50+ Designer Templates</h3>
              <p className="cv-feature-card__desc">
                Curated by hiring managers across tech, executive leadership, finance, healthcare, and
                creative fields. Every layout strictly adheres to modern ATS readability guidelines.
              </p>
              <ul className="cv-feature-card__checklist">
                <li>
                  <CheckCircleIcon size={16} /> 1-page & multi-page optimized
                </li>
                <li>
                  <CheckCircleIcon size={16} /> Clean visual hierarchy
                </li>
                <li>
                  <CheckCircleIcon size={16} /> Industry-specific structure
                </li>
              </ul>
              <Button to="/templates" variant="outline" size="sm" rightIcon={<ArrowRightIcon size={14} />}>
                Browse templates
              </Button>
            </Card>

            {/* Feature 2: Rich-Text Editing */}
            <Card variant="interactive" padding="lg" className="cv-feature-card">
              <div className="cv-feature-icon-wrapper">
                <Edit3Icon size={24} />
              </div>
              <h3 className="cv-feature-card__title">Rich-Text Editing</h3>
              <p className="cv-feature-card__desc">
                Format your achievements with real-time feedback. Bullet points, bold keywords,
                dynamic section reordering, and smart content tips help you highlight your value.
              </p>
              <ul className="cv-feature-card__checklist">
                <li>
                  <CheckCircleIcon size={16} /> Instant side-by-side preview
                </li>
                <li>
                  <CheckCircleIcon size={16} /> Drag-and-drop section flow
                </li>
                <li>
                  <CheckCircleIcon size={16} /> Custom typography & spacing
                </li>
              </ul>
              <Button to="/create" variant="outline" size="sm" rightIcon={<ArrowRightIcon size={14} />}>
                Try editor preview
              </Button>
            </Card>

            {/* Feature 3: Document Import */}
            <Card variant="interactive" padding="lg" className="cv-feature-card">
              <div className="cv-feature-icon-wrapper">
                <UploadIcon size={24} />
              </div>
              <h3 className="cv-feature-card__title">Document Import</h3>
              <p className="cv-feature-card__desc">
                Never start from a blank page again. Import your existing resume in PDF, DOCX, or
                structured JSON. CVForge extracts your history directly into any template.
              </p>
              <ul className="cv-feature-card__checklist">
                <li>
                  <CheckCircleIcon size={16} /> PDF, DOCX, and JSON parsing
                </li>
                <li>
                  <CheckCircleIcon size={16} /> Auto-maps work experience
                </li>
                <li>
                  <CheckCircleIcon size={16} /> 100% client-side file reading
                </li>
              </ul>
              <Button to="/import" variant="outline" size="sm" rightIcon={<ArrowRightIcon size={14} />}>
                Import your file
              </Button>
            </Card>

            {/* Feature 4: PDF Export */}
            <Card variant="interactive" padding="lg" className="cv-feature-card">
              <div className="cv-feature-icon-wrapper">
                <DownloadIcon size={24} />
              </div>
              <h3 className="cv-feature-card__title">Pixel-Perfect PDF Export</h3>
              <p className="cv-feature-card__desc">
                Generate sharp, vector-quality PDF documents that look identical in print and on
                screen. ATS scanners read every line of text without formatting degradation.
              </p>
              <ul className="cv-feature-card__checklist">
                <li>
                  <CheckCircleIcon size={16} /> Vector-sharp selectable text
                </li>
                <li>
                  <CheckCircleIcon size={16} /> Standard A4 & Letter dimensions
                </li>
                <li>
                  <CheckCircleIcon size={16} /> Instant 1-click download
                </li>
              </ul>
              <Button to="/editor/demo-sample" variant="outline" size="sm" rightIcon={<ArrowRightIcon size={14} />}>
                View sample export
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Featured Templates Showcase */}
      <section className="cv-showcase-section" aria-labelledby="showcase-heading">
        <div className="container">
          <div className="cv-section-header">
            <Badge variant="neutral">Curated Collection</Badge>
            <h2 id="showcase-heading" className="cv-section-title">
              Designed for every industry and career level
            </h2>
            <p className="cv-section-subtitle">
              From Fortune 500 boardrooms to fast-growing tech startups, select a template that
              elevates your personal brand.
            </p>
          </div>

          <div className="cv-showcase-grid">
            {featuredTemplates.map((template) => (
              <Card key={template.id} variant="default" padding="none" className="cv-template-preview-card">
                <div className="cv-template-card__visual">
                  <div className="cv-template-miniature">
                    <div
                      className="cv-template-miniature__top"
                      style={{ borderTopColor: template.color }}
                    >
                      <div className="cv-miniature-line cv-miniature-line--bold" />
                      <div className="cv-miniature-line cv-miniature-line--sub" />
                      <div className="cv-miniature-divider" />
                      <div className="cv-miniature-row">
                        <div className="cv-miniature-col cv-miniature-col--wide">
                          <div className="cv-miniature-line" />
                          <div className="cv-miniature-line" />
                          <div className="cv-miniature-line" />
                        </div>
                        <div className="cv-miniature-col">
                          <div className="cv-miniature-line cv-miniature-line--short" />
                          <div className="cv-miniature-line cv-miniature-line--short" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cv-template-card__tag">
                    <Badge variant="accent" size="sm">
                      {template.tag}
                    </Badge>
                  </div>
                </div>

                <div className="cv-template-card__info">
                  <div>
                    <h3 className="cv-template-card__name">{template.name}</h3>
                    <p className="cv-template-card__cat">{template.category}</p>
                  </div>
                  <div className="cv-template-card__actions">
                    <Button
                      to={`/editor/${template.id}`}
                      variant="primary"
                      size="sm"
                      fullWidth
                      rightIcon={<ArrowRightIcon size={14} />}
                    >
                      Use template
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="cv-showcase-footer">
            <Button
              to="/templates"
              variant="secondary"
              size="md"
              rightIcon={<ArrowRightIcon size={16} />}
            >
              Explore all 50+ templates
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Workflow: 3 Steps */}
      <section className="cv-workflow-section" aria-labelledby="workflow-heading">
        <div className="container">
          <div className="cv-section-header">
            <Badge variant="accent">Seamless Process</Badge>
            <h2 id="workflow-heading" className="cv-section-title">
              Three steps to a job-winning resume
            </h2>
            <p className="cv-section-subtitle">
              No bloated wizards, no paywalls at the end. An efficient workflow built for busy
              professionals.
            </p>
          </div>

          <div className="cv-steps-grid">
            <div className="cv-step-item">
              <div className="cv-step-number">01</div>
              <h3 className="cv-step-title">Select your layout</h3>
              <p className="cv-step-desc">
                Choose from 50+ ATS-ready layouts or import your current resume file to transfer all
                details instantly.
              </p>
            </div>

            <div className="cv-step-item">
              <div className="cv-step-number">02</div>
              <h3 className="cv-step-title">Tailor your content</h3>
              <p className="cv-step-desc">
                Use our rich-text controls to add work experience, skills, projects, and metrics with
                instant real-time preview.
              </p>
            </div>

            <div className="cv-step-item">
              <div className="cv-step-number">03</div>
              <h3 className="cv-step-title">Export & submit</h3>
              <p className="cv-step-desc">
                Download a clean, vector-grade PDF ready for applicant tracking systems and hiring
                managers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why CVForge / Trust Pillars */}
      <section className="cv-trust-section">
        <div className="container">
          <div className="cv-trust-card">
            <div className="cv-trust-card__col">
              <div className="cv-trust-icon">
                <ShieldCheckIcon size={28} />
              </div>
              <h3 className="cv-trust-card__title">100% Private & Browser-Based</h3>
              <p className="cv-trust-card__text">
                Your personal contact details, employment history, and career data remain strictly in
                your web browser. CVForge doesn’t send your information to external servers or sell
                your data to third parties.
              </p>
            </div>

            <div className="cv-trust-card__divider" />

            <div className="cv-trust-card__col">
              <div className="cv-trust-icon">
                <ZapIcon size={28} />
              </div>
              <h3 className="cv-trust-card__title">Lightning Fast & Offline Ready</h3>
              <p className="cv-trust-card__text">
                Built with modern React and Vite, CVForge loads instantly and saves your edits to
                browser local storage so you never lose your progress during an application crunch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Bottom Call to Action */}
      <section className="cv-cta-section" aria-labelledby="cta-heading">
        <div className="container">
          <div className="cv-cta-banner">
            <div className="cv-cta-content">
              <Badge variant="accent">Ready To Stand Out?</Badge>
              <h2 id="cta-heading" className="cv-cta-title">
                Build a CV that gets you hired today.
              </h2>
              <p className="cv-cta-desc">
                Join thousands of candidates who landed roles at Google, Stripe, Microsoft, and
                leading companies using CVForge.
              </p>
              <div className="cv-cta-actions">
                <Button
                  to="/create"
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRightIcon size={18} />}
                >
                  Create my CV
                </Button>
                <Button
                  to="/templates"
                  variant="secondary"
                  size="lg"
                  leftIcon={<EyeIcon size={18} />}
                >
                  Explore templates
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
