import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  FileTextIcon,
  CheckCircleIcon,
  SparklesIcon,
  AlertCircleIcon,
  PlusIcon,
  XIcon,
} from '../components/common/Icons';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import type { CVData, ExperienceItem, EducationItem } from '../types/cv';
import { generateStableId } from '../types/cv';
import { TEMPLATES_REGISTRY } from '../data/templates';
import { parseUploadedFile, type ParseWarning, type ImportFormat } from '../utils/importers';
import './ImportPage.css';

const STORAGE_KEY = 'cvforge_active_document';

export const ImportPage: React.FC = () => {
  const navigate = useNavigate();

  // Page state
  const [step, setStep] = useState<'upload' | 'review'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractingStatus, setExtractingStatus] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<{ title: string; description: string } | null>(null);
  const [warnings, setWarnings] = useState<ParseWarning[]>([]);
  const [detectedFormat, setDetectedFormat] = useState<ImportFormat>('txt');

  // Review state
  const [reviewCV, setReviewCV] = useState<CVData | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('silicon-modern');
  const [newSkillInput, setNewSkillInput] = useState<string>('');

  const processFile = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    setWarnings([]);
    setIsExtracting(true);
    setExtractingStatus(`Extracting ${file.name} locally in browser...`);

    try {
      const result = await parseUploadedFile(file);

      if (!result.success || !result.cvData) {
        setError({
          title: 'Document Extraction Notice',
          description: result.error || 'Failed to extract content from the document.',
        });
        setIsExtracting(false);
        return;
      }

      setReviewCV(result.cvData);
      setWarnings(result.warnings);
      setDetectedFormat(result.format);
      setSelectedTemplateId(result.cvData.templateId || 'silicon-modern');
      setStep('review');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError({
        title: 'Extraction Error',
        description: msg,
      });
    } finally {
      setIsExtracting(false);
    }
  };

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
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
    e.target.value = '';
  };

  // Preset Demonstrators for testing and immediate evaluation
  const handleLoadSample = (sampleType: 'pdf' | 'docx' | 'json' | 'txt' | 'scanned-pdf' | 'empty' | 'malformed') => {
    if (sampleType === 'txt') {
      const txtContent = `Sarah Jenkins, Ph.D.
Senior Lead Cloud Architect & Distributed Systems Specialist
sarah.jenkins@example.com | +1 (415) 555-8921 | Seattle, WA
linkedin.com/in/sarahjenkins | github.com/sjenkins-cloud

PROFESSIONAL SUMMARY
Visionary enterprise cloud architect with 12+ years of leadership designing multi-region distributed backends, zero-downtime microservices architectures, and leading teams of 25+ cloud engineers.

CORE COMPETENCIES
Kubernetes, Docker, Go, Python, TypeScript, Apache Kafka, AWS Architecture, Terraform, PostgreSQL, Distributed Systems, Microservices, CI/CD

WORK EXPERIENCE
Principal Cloud Solutions Architect — CloudScale Global
2021 — Present
• Spearheaded migration of legacy monolithic banking core to Kubernetes microservices, cutting p99 latency by 58%.
• Architected high-availability data replication across 3 continents supporting 18,000 requests per second.
• Mentored 12 staff engineers and reduced cloud operational expenditure by $1.8M annually.

Senior Backend Engineer — DataPulse Analytics
2017 — 2021
• Built real-time analytics streaming engine utilizing Apache Kafka and Go processing 4.2B events per day.
• Automated infrastructure as code deployment with Terraform, improving deployment velocity from bi-weekly to 14 deployments/day.

EDUCATION
Ph.D. in Computer Science — University of Washington
2014 — 2017
B.S. in Software Engineering — Stanford University
2010 — 2014
Honors: Summa Cum Laude

KEY PROJECTS
OpenScale Mesh (github.com/sjenkins-cloud/openscale)
• Open-source lightweight service mesh runtime with 3,500+ GitHub stars.`;

      const file = new File([txtContent], 'sarah_jenkins_resume.txt', { type: 'text/plain' });
      processFile(file);
    } else if (sampleType === 'json') {
      const jsonContent = JSON.stringify({
        personal: {
          fullName: 'Marcus Vance',
          targetRole: 'VP of Product Strategy',
          email: 'marcus.vance@vanceproduct.com',
          phone: '+1 (212) 555-0149',
          location: 'New York, NY',
          linkedin: 'https://linkedin.com/in/marcusvance',
          website: 'https://marcusvance.io',
        },
        summary:
          '<p>Accomplished Product Executive with 14 years driving enterprise SaaS growth, 0-to-1 product incubation, and orchestrating product-led revenue initiatives generating over <strong>$80M in ARR</strong>.</p>',
        experience: [
          {
            title: 'Vice President of Product',
            company: 'OmniChannel Technologies',
            startDate: '2020',
            endDate: 'Present',
            bullets: [
              'Spearheaded enterprise product roadmap expanding annual platform gross merchandise value from $120M to $580M.',
              'Grew product and design organization from 8 to 34 members across 3 continents.',
            ],
            description: '<p>Directly responsible for full product lifecycle and executive P&L.</p>',
          },
          {
            title: 'Director of Product Management',
            company: 'NextGen Financial Systems',
            startDate: '2016',
            endDate: '2020',
            bullets: [
              'Launched AI-driven fraud detection dashboard used by 12 Tier-1 retail banks.',
              'Increased product retention from 84% to 96.2% over a 3-year transformation.',
            ],
          },
        ],
        education: [
          {
            degree: 'M.B.A. in Technology & Strategy',
            school: 'Columbia Business School',
            endDate: '2016',
          },
          {
            degree: 'B.A. in Economics',
            school: 'Princeton University',
            endDate: '2012',
          },
        ],
        skills: [
          'Product Strategy',
          'Enterprise SaaS',
          'Go-to-Market Execution',
          'Roadmap Prioritization',
          'Design Thinking',
          'User Research',
          'Executive Leadership',
        ],
      });

      const file = new File([jsonContent], 'marcus_vance_resume.json', { type: 'application/json' });
      processFile(file);
    } else if (sampleType === 'pdf') {
      // Create minimal selectable-text PDF in memory
      // Standard minimal PDF with text stream containing resume text
      const resumeStream = `BT
/F1 18 Tf
50 750 Td
(David Chen) Tj
0 -24 Td
/F1 12 Tf
(Senior Full Stack Architect | david.chen@devmail.org | San Francisco, CA) Tj
0 -20 Td
(linkedin.com/in/dchen-arch | github.com/dchen-code) Tj
0 -30 Td
/F1 14 Tf
(PROFESSIONAL SUMMARY) Tj
0 -18 Td
/F1 11 Tf
(Full-stack architect with 9+ years engineering web platforms, distributed APIs, and TypeScript apps.) Tj
0 -30 Td
/F1 14 Tf
(WORK EXPERIENCE) Tj
0 -18 Td
/F1 11 Tf
(Lead Software Engineer - Helix Systems | 2021 - Present) Tj
0 -16 Td
(- Designed scalable micro-frontends with React and Vite decreasing bundle size by 40%.) Tj
0 -16 Td
(- Implemented event-driven GraphQL API handling 25,000 requests per minute.) Tj
0 -30 Td
/F1 14 Tf
(EDUCATION) Tj
0 -18 Td
/F1 11 Tf
(B.S. in Computer Engineering - UCLA | 2016) Tj
0 -30 Td
/F1 14 Tf
(SKILLS) Tj
0 -18 Td
/F1 11 Tf
(React, TypeScript, Node.js, GraphQL, Docker, PostgreSQL, Redis, TailwindCSS, AWS) Tj
ET`;

      const streamLength = resumeStream.length;
      const pdfString = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${resumeStream}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000${(244 + streamLength + 35).toString().padStart(3, '0')} 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${350 + streamLength}
%%EOF`;

      const blob = new Blob([pdfString], { type: 'application/pdf' });
      const file = new File([blob], 'david_chen_resume.pdf', { type: 'application/pdf' });
      processFile(file);
    } else if (sampleType === 'docx') {
      // Trigger a sample TXT as stand-in or mock docx
      // For testing DOCX, create text file with DOCX extension content or sample
      const docxText = `Elena Rostova
Principal Data Scientist & Machine Learning Engineer
elena.rostova@datascience.net | +1 (617) 555-4389 | Boston, MA
linkedin.com/in/erostova | github.com/erostova-ml

PROFESSIONAL SUMMARY
Machine Learning Specialist with 8 years applying deep neural networks, LLM fine-tuning, and scalable inference pipelines in production healthcare systems.

CORE COMPETENCIES
Python, PyTorch, TensorFlow, Scikit-learn, SQL, Docker, Kubernetes, MLOps, LLMs, NLP, AWS SageMaker

WORK EXPERIENCE
Lead Machine Learning Scientist — BioHealth AI
2021 — Present
• Built transformer diagnostic assistant improving triage decision accuracy by 34%.
• Reduced model inference latency from 450ms to 68ms through ONNX runtime quantization.

Data Scientist — QuantMetrics
2018 — 2021
• Developed customer lifetime value prediction algorithms improving ad spend ROAS by 28%.

EDUCATION
M.S. in Computational Data Analytics — MIT
2018
B.S. in Applied Mathematics — Harvard University
2016`;

      const file = new File([docxText], 'elena_rostova_resume.txt', { type: 'text/plain' });
      processFile(file);
    } else if (sampleType === 'scanned-pdf') {
      // Minimal PDF with blank image / zero text stream to test scanned PDF detection
      const blankPdf = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj
4 0 obj << /Length 0 >> stream
endstream endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000056 00000 n 
0000000113 00000 n 
0000000216 00000 n 
trailer << /Size 5 /Root 1 0 R >>
startxref
265
%%EOF`;
      const blob = new Blob([blankPdf], { type: 'application/pdf' });
      const file = new File([blob], 'scanned_image_document.pdf', { type: 'application/pdf' });
      processFile(file);
    } else if (sampleType === 'empty') {
      const file = new File([''], 'empty_file.txt', { type: 'text/plain' });
      processFile(file);
    } else if (sampleType === 'malformed') {
      const file = new File(['{ "invalidJson": true, unexpected_token }'], 'corrupted.json', {
        type: 'application/json',
      });
      processFile(file);
    }
  };

  // Review Screen Item Handlers
  const updatePersonalInfo = (field: keyof CVData['personal'], value: string) => {
    if (!reviewCV) return;
    setReviewCV({
      ...reviewCV,
      personal: {
        ...reviewCV.personal,
        [field]: value,
      },
    });
  };

  const updateSummary = (value: string) => {
    if (!reviewCV) return;
    setReviewCV({
      ...reviewCV,
      summary: value.startsWith('<p>') ? value : `<p>${value}</p>`,
    });
  };

  const updateExperienceItem = (id: string, updates: Partial<ExperienceItem>) => {
    if (!reviewCV) return;
    setReviewCV({
      ...reviewCV,
      experience: reviewCV.experience.map((it) => (it.id === id ? { ...it, ...updates } : it)),
    });
  };

  const removeExperienceItem = (id: string) => {
    if (!reviewCV) return;
    setReviewCV({
      ...reviewCV,
      experience: reviewCV.experience.filter((it) => it.id !== id),
    });
  };

  const addExperienceItem = () => {
    if (!reviewCV) return;
    const newItem: ExperienceItem = {
      id: generateStableId('exp'),
      title: 'New Position',
      company: 'Company Name',
      startDate: '2023',
      endDate: 'Present',
      bullets: ['Key achievement or responsibility'],
      description: '',
    };
    setReviewCV({
      ...reviewCV,
      experience: [...reviewCV.experience, newItem],
    });
  };

  const updateEducationItem = (id: string, updates: Partial<EducationItem>) => {
    if (!reviewCV) return;
    setReviewCV({
      ...reviewCV,
      education: reviewCV.education.map((it) => (it.id === id ? { ...it, ...updates } : it)),
    });
  };

  const removeEducationItem = (id: string) => {
    if (!reviewCV) return;
    setReviewCV({
      ...reviewCV,
      education: reviewCV.education.filter((it) => it.id !== id),
    });
  };

  const addEducationItem = () => {
    if (!reviewCV) return;
    const newItem: EducationItem = {
      id: generateStableId('edu'),
      degree: 'Degree / Major',
      school: 'University or College',
      endDate: '2024',
    };
    setReviewCV({
      ...reviewCV,
      education: [...reviewCV.education, newItem],
    });
  };

  const removeSkill = (skillToRemove: string) => {
    if (!reviewCV) return;
    setReviewCV({
      ...reviewCV,
      skills: reviewCV.skills.filter((s) => s !== skillToRemove),
    });
  };

  const addSkill = () => {
    if (!reviewCV || !newSkillInput.trim()) return;
    const trimmed = newSkillInput.trim();
    if (!reviewCV.skills.includes(trimmed)) {
      setReviewCV({
        ...reviewCV,
        skills: [...reviewCV.skills, trimmed],
      });
    }
    setNewSkillInput('');
  };

  // Final Action: Save to localStorage and open existing EditorPage
  const handleApplyAndOpenEditor = () => {
    if (!reviewCV) return;

    const finalCVData: CVData = {
      ...reviewCV,
      templateId: selectedTemplateId,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalCVData));
    } catch {
      // ignore storage errors
    }

    navigate(`/editor/${selectedTemplateId}`, {
      state: { importedData: finalCVData },
    });
  };

  return (
    <div className="cv-import-page">
      <div className="container">
        {step === 'upload' ? (
          <>
            <div className="cv-import-header">
              <Badge variant="accent" icon={<SparklesIcon size={14} />}>
                Client-Side Extraction Engine
              </Badge>
              <h1 className="cv-import-title">Import your existing document</h1>
              <p className="cv-import-subtitle">
                Skip manual retyping. Upload your current resume in PDF, Word (DOCX), JSON, or TXT.
                Our in-browser parser will extract your experience, skills, and education into any design.
              </p>
            </div>

            <div className="cv-import-content">
              {/* Error Alert Display */}
              {error && (
                <div className="cv-import-error-card" role="alert">
                  <AlertCircleIcon size={24} className="cv-import-error-icon" />
                  <div>
                    <div className="cv-import-error-title">{error.title}</div>
                    <p className="cv-import-error-desc">{error.description}</p>
                  </div>
                </div>
              )}

              {/* Upload Dropzone */}
              <Card variant="default" padding="lg" className="cv-dropzone-card">
                {isExtracting ? (
                  <div className="cv-import-loading-box">
                    <div className="cv-spinner" />
                    <div className="cv-import-loading-text">{extractingStatus}</div>
                    <div className="cv-import-loading-hint">
                      Parsing in client memory. No files are uploaded to any server.
                    </div>
                  </div>
                ) : (
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
                      aria-label="Upload document file"
                    />
                    <label htmlFor="file-upload-input" className="cv-dropzone-label">
                      <div className="cv-dropzone-icon">
                        <UploadIcon size={32} />
                      </div>
                      <div className="cv-dropzone-prompt">
                        <span className="cv-dropzone-browse">Click to browse</span> or drag and drop your file here
                      </div>
                      <p className="cv-dropzone-formats">
                        Supported formats: PDF (selectable), Word (DOCX), JSON (CVForge / JSON Resume), Plain Text (.TXT) up to 15MB
                      </p>
                    </label>
                  </div>
                )}

                <div className="cv-import-formats-strip">
                  <span className="cv-format-badge">.PDF (PDF.js Selectable)</span>
                  <span className="cv-format-badge">.DOCX (Mammoth.js)</span>
                  <span className="cv-format-badge">.JSON (Structured Resume)</span>
                  <span className="cv-format-badge">Plain Text (.TXT)</span>
                </div>

                {/* Instant Verification Triggers */}
                <div className="cv-import-sample-strip">
                  <span>Quick test samples:</span>
                  <button
                    type="button"
                    className="cv-import-sample-btn"
                    onClick={() => handleLoadSample('pdf')}
                  >
                    Selectable PDF
                  </button>
                  <button
                    type="button"
                    className="cv-import-sample-btn"
                    onClick={() => handleLoadSample('json')}
                  >
                    JSON Resume
                  </button>
                  <button
                    type="button"
                    className="cv-import-sample-btn"
                    onClick={() => handleLoadSample('txt')}
                  >
                    Plain Text
                  </button>
                  <button
                    type="button"
                    className="cv-import-sample-btn"
                    onClick={() => handleLoadSample('scanned-pdf')}
                  >
                    Scanned PDF (OCR Test)
                  </button>
                  <button
                    type="button"
                    className="cv-import-sample-btn"
                    onClick={() => handleLoadSample('empty')}
                  >
                    Empty File
                  </button>
                  <button
                    type="button"
                    className="cv-import-sample-btn"
                    onClick={() => handleLoadSample('malformed')}
                  >
                    Malformed JSON
                  </button>
                </div>
              </Card>

              {/* Privacy & Security Guarantees */}
              <div className="cv-import-security-grid">
                <div className="cv-security-item">
                  <ShieldCheckIcon size={22} />
                  <div>
                    <h3 className="cv-security-title">100% In-Browser Extraction</h3>
                    <p className="cv-security-desc">
                      Your files are parsed strictly in local client memory using PDF.js and Mammoth.js.
                      No resumes or personal contact details ever leave your device.
                    </p>
                  </div>
                </div>

                <div className="cv-security-item">
                  <CheckCircleIcon size={22} />
                  <div>
                    <h3 className="cv-security-title">Deterministic Data Preservation</h3>
                    <p className="cv-security-desc">
                      Dates, role titles, companies, bullet points, and degree qualifications are
                      preserved into structured fields with zero hallucinated data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Alternative action */}
              <div className="cv-import-fallback">
                <span>Prefer to pick a design first?</span>
                <Button to="/templates" variant="secondary" size="sm">
                  Explore 10+ Art-Directed Templates
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* =========================================================================
             STEP 2: REVIEW & VERIFICATION SCREEN (Requirement 7)
             ========================================================================= */
          reviewCV && (
            <div className="cv-review-container">
              {/* Header Status Bar */}
              <div className="cv-review-header-bar">
                <div className="cv-review-doc-info">
                  <FileTextIcon size={28} className="cv-selected-file__icon" />
                  <div>
                    <div className="cv-review-doc-name">
                      {selectedFile ? selectedFile.name : `${reviewCV.personal.fullName || 'Imported'} Resume`}
                    </div>
                    <div className="cv-review-doc-meta">
                      Format: {detectedFormat.toUpperCase()} • {reviewCV.experience.length} Positions •{' '}
                      {reviewCV.education.length} Degrees • {reviewCV.skills.length} Skills Extracted
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStep('upload');
                    setReviewCV(null);
                  }}
                >
                  ← Upload Different File
                </Button>
              </div>

              {/* Warnings Banner if any */}
              {warnings.length > 0 && (
                <div className="cv-review-warnings-box">
                  <strong>Verification Notices:</strong>
                  {warnings.map((w, i) => (
                    <div key={i}>• {w.message}</div>
                  ))}
                </div>
              )}

              {/* Template Picker */}
              <div className="cv-review-template-section">
                <h3 className="cv-review-template-title">Choose Initial Template</h3>
                <div className="cv-review-template-grid">
                  {TEMPLATES_REGISTRY.map((t) => (
                    <div
                      key={t.id}
                      className={`cv-review-tpl-card ${
                        selectedTemplateId === t.id ? 'cv-review-tpl-card--active' : ''
                      }`}
                      onClick={() => setSelectedTemplateId(t.id)}
                    >
                      <div className="cv-review-tpl-card__name">{t.name}</div>
                      <div className="cv-review-tpl-card__meta">
                        {t.family} • {t.photoConfig.supported ? 'Photo Ready' : 'Photo-Free'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1. Personal Information */}
              <div className="cv-review-card">
                <div className="cv-review-card__header">
                  <h2 className="cv-review-card__title">1. Personal Information</h2>
                  <Badge variant="accent" size="sm">
                    Verified
                  </Badge>
                </div>
                <div className="cv-review-grid-2">
                  <div className="cv-review-field">
                    <label className="cv-review-label">Full Name</label>
                    <input
                      type="text"
                      className="cv-review-input"
                      value={reviewCV.personal.fullName}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    />
                  </div>
                  <div className="cv-review-field">
                    <label className="cv-review-label">Target Role / Title</label>
                    <input
                      type="text"
                      className="cv-review-input"
                      value={reviewCV.personal.targetRole}
                      onChange={(e) => updatePersonalInfo('targetRole', e.target.value)}
                    />
                  </div>
                  <div className="cv-review-field">
                    <label className="cv-review-label">Email Address</label>
                    <input
                      type="email"
                      className="cv-review-input"
                      value={reviewCV.personal.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    />
                  </div>
                  <div className="cv-review-field">
                    <label className="cv-review-label">Phone Number</label>
                    <input
                      type="text"
                      className="cv-review-input"
                      value={reviewCV.personal.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    />
                  </div>
                  <div className="cv-review-field">
                    <label className="cv-review-label">Location</label>
                    <input
                      type="text"
                      className="cv-review-input"
                      value={reviewCV.personal.location}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    />
                  </div>
                  <div className="cv-review-field">
                    <label className="cv-review-label">LinkedIn URL</label>
                    <input
                      type="text"
                      className="cv-review-input"
                      value={reviewCV.personal.linkedin || ''}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* 2. Professional Summary */}
              <div className="cv-review-card">
                <div className="cv-review-card__header">
                  <h2 className="cv-review-card__title">2. Professional Summary</h2>
                  <span className="cv-review-doc-meta">Rich-Text HTML</span>
                </div>
                <div className="cv-review-field">
                  <textarea
                    className="cv-review-textarea"
                    rows={4}
                    value={reviewCV.summary.replace(/<[^>]+>/g, '')}
                    onChange={(e) => updateSummary(e.target.value)}
                    placeholder="Enter or refine your professional summary..."
                  />
                </div>
              </div>

              {/* 3. Work Experience */}
              <div className="cv-review-card">
                <div className="cv-review-card__header">
                  <h2 className="cv-review-card__title">
                    3. Work Experience ({reviewCV.experience.length})
                  </h2>
                  <button type="button" className="cv-review-add-btn" onClick={addExperienceItem}>
                    + Add Position
                  </button>
                </div>

                <div className="cv-review-items-list">
                  {reviewCV.experience.map((exp, index) => (
                    <div key={exp.id} className="cv-review-item-box">
                      <div className="cv-review-item-header">
                        <span className="cv-review-label">Position #{index + 1}</span>
                        <button
                          type="button"
                          className="cv-review-delete-btn"
                          onClick={() => removeExperienceItem(exp.id)}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="cv-review-grid-2">
                        <div className="cv-review-field">
                          <label className="cv-review-label">Job Title</label>
                          <input
                            type="text"
                            className="cv-review-input"
                            value={exp.title}
                            onChange={(e) => updateExperienceItem(exp.id, { title: e.target.value })}
                          />
                        </div>
                        <div className="cv-review-field">
                          <label className="cv-review-label">Company / Organization</label>
                          <input
                            type="text"
                            className="cv-review-input"
                            value={exp.company}
                            onChange={(e) => updateExperienceItem(exp.id, { company: e.target.value })}
                          />
                        </div>
                        <div className="cv-review-field">
                          <label className="cv-review-label">Start Date</label>
                          <input
                            type="text"
                            className="cv-review-input"
                            value={exp.startDate}
                            onChange={(e) => updateExperienceItem(exp.id, { startDate: e.target.value })}
                          />
                        </div>
                        <div className="cv-review-field">
                          <label className="cv-review-label">End Date</label>
                          <input
                            type="text"
                            className="cv-review-input"
                            value={exp.endDate}
                            onChange={(e) => updateExperienceItem(exp.id, { endDate: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="cv-review-field">
                        <label className="cv-review-label">Key Bullets / Achievements</label>
                        <textarea
                          className="cv-review-textarea"
                          rows={3}
                          value={exp.bullets.join('\n')}
                          onChange={(e) =>
                            updateExperienceItem(exp.id, {
                              bullets: e.target.value.split('\n').filter(Boolean),
                            })
                          }
                          placeholder="One achievement per line..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Education */}
              <div className="cv-review-card">
                <div className="cv-review-card__header">
                  <h2 className="cv-review-card__title">
                    4. Education ({reviewCV.education.length})
                  </h2>
                  <button type="button" className="cv-review-add-btn" onClick={addEducationItem}>
                    + Add Education
                  </button>
                </div>

                <div className="cv-review-items-list">
                  {reviewCV.education.map((edu, index) => (
                    <div key={edu.id} className="cv-review-item-box">
                      <div className="cv-review-item-header">
                        <span className="cv-review-label">Education #{index + 1}</span>
                        <button
                          type="button"
                          className="cv-review-delete-btn"
                          onClick={() => removeEducationItem(edu.id)}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="cv-review-grid-2">
                        <div className="cv-review-field">
                          <label className="cv-review-label">Degree / Program</label>
                          <input
                            type="text"
                            className="cv-review-input"
                            value={edu.degree}
                            onChange={(e) => updateEducationItem(edu.id, { degree: e.target.value })}
                          />
                        </div>
                        <div className="cv-review-field">
                          <label className="cv-review-label">School / Institution</label>
                          <input
                            type="text"
                            className="cv-review-input"
                            value={edu.school}
                            onChange={(e) => updateEducationItem(edu.id, { school: e.target.value })}
                          />
                        </div>
                        <div className="cv-review-field">
                          <label className="cv-review-label">Graduation Year / Date</label>
                          <input
                            type="text"
                            className="cv-review-input"
                            value={edu.endDate}
                            onChange={(e) => updateEducationItem(edu.id, { endDate: e.target.value })}
                          />
                        </div>
                        <div className="cv-review-field">
                          <label className="cv-review-label">Honors / GPA</label>
                          <input
                            type="text"
                            className="cv-review-input"
                            value={edu.honors || ''}
                            onChange={(e) => updateEducationItem(edu.id, { honors: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Core Skills */}
              <div className="cv-review-card">
                <div className="cv-review-card__header">
                  <h2 className="cv-review-card__title">
                    5. Core Skills ({reviewCV.skills.length})
                  </h2>
                </div>

                <div className="cv-review-skills-tags">
                  {reviewCV.skills.map((skill, idx) => (
                    <span key={idx} className="cv-review-skill-pill">
                      <span>{skill}</span>
                      <button
                        type="button"
                        className="cv-review-skill-remove"
                        onClick={() => removeSkill(skill)}
                        aria-label={`Remove skill ${skill}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="cv-review-add-skill-row">
                  <input
                    type="text"
                    className="cv-review-input"
                    placeholder="Add a new skill..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button variant="secondary" size="sm" onClick={addSkill} leftIcon={<PlusIcon size={14} />}>
                    Add
                  </Button>
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="cv-review-actions-bar">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setStep('upload');
                    setReviewCV(null);
                  }}
                  leftIcon={<XIcon size={16} />}
                >
                  Discard & Re-upload
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleApplyAndOpenEditor}
                  rightIcon={<ArrowRightIcon size={18} />}
                >
                  Create CV & Open Editor
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
