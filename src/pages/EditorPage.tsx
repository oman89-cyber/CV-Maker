import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FileTextIcon,
  DownloadIcon,
  SparklesIcon,
  CheckCircleIcon,
  LayersIcon,
  UploadIcon,
} from '../components/common/Icons';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CVRenderer } from '../components/cv/CVRenderer';
import { RichTextEditor } from '../components/editor/RichTextEditor';
import {
  type CVData,
  DEFAULT_CV_DATA,
  normalizeCVData,
  generateStableId,
  type ProfilePhotoSettings,
  type ExperienceItem,
  type EducationItem,
  type ProjectItem,
  type CertificationItem,
  type AchievementItem,
  type LanguageItem,
  type CustomSection,
} from '../types/cv';
import { TEMPLATES_REGISTRY, getTemplateById } from '../data/templates';
import { savePhotoBlob, getPhotoBlob, deletePhotoBlob } from '../utils/photoStorage';
import './EditorPage.css';

const STORAGE_KEY = 'cvforge_active_document';

export const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const currentTemplate = getTemplateById(id);

  // Initialize CV Data with backwards-compatible normalization and preservation
  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : null;
      const baseData = normalizeCVData(parsed || DEFAULT_CV_DATA);

      // If user came from ImportPage or CreatePage with state
      const navState = location.state as {
        fullName?: string;
        targetRole?: string;
        importedData?: CVData;
      } | null;

      if (navState && navState.importedData) {
        return normalizeCVData(navState.importedData);
      }
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
  const [newSkillInput, setNewSkillInput] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');

  const isFirstRender = React.useRef(true);
  const photoInputRef = React.useRef<HTMLInputElement | null>(null);

  // Hydrate profile photo from IndexedDB on initial mount if key exists but url is missing
  useEffect(() => {
    const photoKey = cvData.personal.photo?.key;
    if (photoKey && !cvData.personal.photo?.url) {
      let isMounted = true;
      getPhotoBlob(photoKey).then((blob) => {
        if (isMounted && blob) {
          const objectUrl = URL.createObjectURL(blob);
          setCvData((prev) => {
            if (!prev.personal.photo || prev.personal.photo.url) return prev;
            return {
              ...prev,
              personal: {
                ...prev.personal,
                photo: {
                  ...prev.personal.photo,
                  url: objectUrl,
                },
              },
            };
          });
        }
      });
      return () => {
        isMounted = false;
      };
    }
  }, [cvData.personal.photo?.key, cvData.personal.photo?.url]);

  // Debounced persistence to localStorage (400ms delay) - strips ephemeral object URLs
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      try {
        const sanitizedData: CVData = {
          ...cvData,
          personal: {
            ...cvData.personal,
            photo: cvData.personal.photo
              ? {
                  key: cvData.personal.photo.key,
                  shape: cvData.personal.photo.shape,
                  zoom: cvData.personal.photo.zoom,
                  position: cvData.personal.photo.position,
                  aspectRatio: cvData.personal.photo.aspectRatio,
                }
              : undefined,
          },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedData));
      } catch {
        // ignore storage errors
      }
      setSaveStatus('saved');
    }, 400);

    return () => clearTimeout(timer);
  }, [cvData]);

  const handleTemplateChange = (newTemplateId: string) => {
    navigate(`/editor/${newTemplateId}`);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50));
  };

  const handleZoomReset = () => {
    setZoomLevel(100);
  };

  const updatePersonalInfo = (field: keyof typeof cvData.personal, value: string) => {
    setSaveStatus('saving');
    setCvData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  // Profile Photo Upload & Control Handlers
  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so identical file can be re-selected if user removed then re-added
    e.target.value = '';

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, or WebP).');
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      alert('Image file is too large. Please select an image under 5MB.');
      return;
    }

    const tempUrl = URL.createObjectURL(file);
    const testImg = new Image();
    testImg.src = tempUrl;

    testImg.onload = async () => {
      try {
        setSaveStatus('saving');
        const photoKey = `photo_${Date.now()}`;
        await savePhotoBlob(photoKey, file);

        if (cvData.personal.photo?.key) {
          deletePhotoBlob(cvData.personal.photo.key);
        }

        const defaultShape = currentTemplate.photoConfig?.defaultShape || 'rounded';
        const defaultRatio = currentTemplate.photoConfig?.aspectRatio || '1:1';

        setCvData((prev) => ({
          ...prev,
          personal: {
            ...prev.personal,
            photo: {
              key: photoKey,
              url: tempUrl,
              shape: prev.personal.photo?.shape || defaultShape,
              zoom: prev.personal.photo?.zoom || 1,
              position: prev.personal.photo?.position || { x: 0, y: 0 },
              aspectRatio: prev.personal.photo?.aspectRatio || defaultRatio,
            },
          },
          updatedAt: new Date().toISOString(),
        }));
      } catch (err) {
        console.error('Failed to save photo locally:', err);
        alert('Failed to save photo locally. Please try again.');
        URL.revokeObjectURL(tempUrl);
      }
    };

    testImg.onerror = () => {
      URL.revokeObjectURL(tempUrl);
      alert('The selected file could not be decoded as an image. Please choose another file.');
    };
  };

  const handleUseSamplePhoto = async () => {
    try {
      setSaveStatus('saving');
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw modern gradient backdrop
      const grad = ctx.createLinearGradient(0, 0, 300, 300);
      grad.addColorStop(0, '#2563eb');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 300, 300);

      // Draw head
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(150, 115, 60, 0, Math.PI * 2);
      ctx.fill();

      // Draw shoulders / bust
      ctx.beginPath();
      ctx.arc(150, 290, 115, Math.PI, 0, false);
      ctx.fill();

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const photoKey = `photo_${Date.now()}`;
        await savePhotoBlob(photoKey, blob);
        const objectUrl = URL.createObjectURL(blob);

        if (cvData.personal.photo?.key) {
          deletePhotoBlob(cvData.personal.photo.key);
        }

        const defaultShape = currentTemplate.photoConfig?.defaultShape || 'rounded';
        const defaultRatio = currentTemplate.photoConfig?.aspectRatio || '1:1';

        setCvData((prev) => ({
          ...prev,
          personal: {
            ...prev.personal,
            photo: {
              key: photoKey,
              url: objectUrl,
              shape: prev.personal.photo?.shape || defaultShape,
              zoom: prev.personal.photo?.zoom || 1,
              position: prev.personal.photo?.position || { x: 0, y: 0 },
              aspectRatio: prev.personal.photo?.aspectRatio || defaultRatio,
            },
          },
          updatedAt: new Date().toISOString(),
        }));
      }, 'image/png');
    } catch (err) {
      console.error('Failed to generate sample photo:', err);
    }
  };

  const handleRemovePhoto = async () => {
    if (cvData.personal.photo?.key) {
      await deletePhotoBlob(cvData.personal.photo.key);
    }
    if (cvData.personal.photo?.url) {
      URL.revokeObjectURL(cvData.personal.photo.url);
    }

    setSaveStatus('saving');
    setCvData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        photo: undefined,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  const updatePhotoSettings = (updates: Partial<ProfilePhotoSettings>) => {
    setSaveStatus('saving');
    setCvData((prev) => {
      if (!prev.personal.photo) return prev;
      return {
        ...prev,
        personal: {
          ...prev.personal,
          photo: {
            ...prev.personal.photo,
            ...updates,
          },
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  // Reorder utility
  function moveItem<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
    if (toIndex < 0 || toIndex >= arr.length) return arr;
    const copy = [...arr];
    const [moved] = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, moved);
    return copy;
  }

  // Experience Handlers
  const addExperience = () => {
    setSaveStatus('saving');
    const newItem: ExperienceItem = {
      id: generateStableId('exp'),
      title: 'New Position',
      company: 'Company / Organization',
      startDate: '2023',
      endDate: 'Present',
      bullets: [],
      description: '<p>Describe your responsibilities, leadership, and key achievements here.</p>',
    };
    setCvData((prev) => ({
      ...prev,
      experience: [...prev.experience, newItem],
    }));
  };

  const updateExperience = (expId: string, updates: Partial<ExperienceItem>) => {
    setSaveStatus('saving');
    setCvData((prev) => ({
      ...prev,
      experience: prev.experience.map((item) =>
        item.id === expId ? { ...item, ...updates } : item
      ),
    }));
  };

  const removeExperience = (expId: string) => {
    setSaveStatus('saving');
    setCvData((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== expId),
    }));
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    setSaveStatus('saving');
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    setCvData((prev) => ({
      ...prev,
      experience: moveItem(prev.experience, index, targetIndex),
    }));
  };

  // Education Handlers
  const addEducation = () => {
    setSaveStatus('saving');
    const newItem: EducationItem = {
      id: generateStableId('edu'),
      degree: 'Degree / Major',
      school: 'University or College',
      endDate: '2024',
      honors: '',
      description: '',
    };
    setCvData((prev) => ({
      ...prev,
      education: [...prev.education, newItem],
    }));
  };

  const updateEducation = (eduId: string, updates: Partial<EducationItem>) => {
    setSaveStatus('saving');
    setCvData((prev) => ({
      ...prev,
      education: prev.education.map((item) =>
        item.id === eduId ? { ...item, ...updates } : item
      ),
    }));
  };

  const removeEducation = (eduId: string) => {
    setSaveStatus('saving');
    setCvData((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== eduId),
    }));
  };

  const moveEducation = (index: number, direction: 'up' | 'down') => {
    setSaveStatus('saving');
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    setCvData((prev) => ({
      ...prev,
      education: moveItem(prev.education, index, targetIndex),
    }));
  };

  // Projects Handlers
  const addProject = () => {
    setSaveStatus('saving');
    const newItem: ProjectItem = {
      id: generateStableId('proj'),
      title: 'New Project Title',
      subtitle: 'Key Technology / Role',
      link: 'github.com/project',
      startDate: '2023',
      endDate: '2024',
      description: '<p>Key technical accomplishments, architecture, and impact.</p>',
      highlights: [],
    };
    setCvData((prev) => ({
      ...prev,
      projects: [...prev.projects, newItem],
    }));
  };

  const updateProject = (projId: string, updates: Partial<ProjectItem>) => {
    setSaveStatus('saving');
    setCvData((prev) => ({
      ...prev,
      projects: prev.projects.map((item) =>
        item.id === projId ? { ...item, ...updates } : item
      ),
    }));
  };

  const removeProject = (projId: string) => {
    setSaveStatus('saving');
    setCvData((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== projId),
    }));
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    setSaveStatus('saving');
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    setCvData((prev) => ({
      ...prev,
      projects: moveItem(prev.projects, index, targetIndex),
    }));
  };

  // Skills Handlers
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (!cvData.skills.includes(trimmed)) {
      setSaveStatus('saving');
      setCvData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
    }
    setNewSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    setSaveStatus('saving');
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Certifications Handlers
  const addCertification = () => {
    setSaveStatus('saving');
    const newItem: CertificationItem = {
      id: generateStableId('cert'),
      name: 'Certification Title',
      issuer: 'Issuing Organization',
      date: '2024',
      url: '',
    };
    setCvData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newItem],
    }));
  };

  const updateCertification = (certId: string, updates: Partial<CertificationItem>) => {
    setSaveStatus('saving');
    setCvData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((item) =>
        item.id === certId ? { ...item, ...updates } : item
      ),
    }));
  };

  const removeCertification = (certId: string) => {
    setSaveStatus('saving');
    setCvData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((item) => item.id !== certId),
    }));
  };

  // Achievements Handlers
  const addAchievement = () => {
    setSaveStatus('saving');
    const newItem: AchievementItem = {
      id: generateStableId('ach'),
      title: 'Award / Honor / Achievement',
      description: 'Recognized for outstanding impact, publication, or metric.',
      date: '2024',
    };
    setCvData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, newItem],
    }));
  };

  const updateAchievement = (achId: string, updates: Partial<AchievementItem>) => {
    setSaveStatus('saving');
    setCvData((prev) => ({
      ...prev,
      achievements: prev.achievements.map((item) =>
        item.id === achId ? { ...item, ...updates } : item
      ),
    }));
  };

  const removeAchievement = (achId: string) => {
    setSaveStatus('saving');
    setCvData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((item) => item.id !== achId),
    }));
  };

  // Languages Handlers
  const addLanguage = () => {
    setSaveStatus('saving');
    const newItem: LanguageItem = {
      id: generateStableId('lang'),
      language: 'New Language',
      proficiency: 'Professional Working',
    };
    setCvData((prev) => ({
      ...prev,
      languages: [...prev.languages, newItem],
    }));
  };

  const updateLanguage = (langId: string, updates: Partial<LanguageItem>) => {
    setSaveStatus('saving');
    setCvData((prev) => ({
      ...prev,
      languages: prev.languages.map((item) =>
        item.id === langId ? { ...item, ...updates } : item
      ),
    }));
  };

  const removeLanguage = (langId: string) => {
    setSaveStatus('saving');
    setCvData((prev) => ({
      ...prev,
      languages: prev.languages.filter((item) => item.id !== langId),
    }));
  };

  // Custom Sections Handlers
  const addCustomSection = () => {
    setSaveStatus('saving');
    const newSection: CustomSection = {
      id: generateStableId('custom'),
      sectionTitle: 'Special Honors & Engagements',
      items: [
        {
          id: generateStableId('cust-item'),
          title: 'Notable Highlight',
          content: '<p>Details about your specific project, publication, or engagement.</p>',
        },
      ],
    };
    setCvData((prev) => ({
      ...prev,
      customSections: [...prev.customSections, newSection],
    }));
  };

  const updateCustomSection = (sectionId: string, title: string) => {
    setSaveStatus('saving');
    setCvData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((cs) =>
        cs.id === sectionId ? { ...cs, sectionTitle: title } : cs
      ),
    }));
  };

  const removeCustomSection = (sectionId: string) => {
    setSaveStatus('saving');
    setCvData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((cs) => cs.id !== sectionId),
    }));
  };

  const addCustomItem = (sectionId: string) => {
    setSaveStatus('saving');
    const newItem = {
      id: generateStableId('cust-item'),
      title: 'New Item',
      content: '<p>Description of the item.</p>',
    };
    setCvData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((cs) =>
        cs.id === sectionId ? { ...cs, items: [...cs.items, newItem] } : cs
      ),
    }));
  };

  const updateCustomItem = (
    sectionId: string,
    itemId: string,
    updates: { title?: string; content?: string }
  ) => {
    setSaveStatus('saving');
    setCvData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((cs) =>
        cs.id === sectionId
          ? {
              ...cs,
              items: cs.items.map((it) => (it.id === itemId ? { ...it, ...updates } : it)),
            }
          : cs
      ),
    }));
  };

  const removeCustomItem = (sectionId: string, itemId: string) => {
    setSaveStatus('saving');
    setCvData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((cs) =>
        cs.id === sectionId ? { ...cs, items: cs.items.filter((it) => it.id !== itemId) } : cs
      ),
    }));
  };

  const editorSections = [
    { id: 'personal', label: 'Personal Information', shortLabel: 'Personal' },
    { id: 'summary', label: 'Professional Summary', shortLabel: 'Summary' },
    { id: 'experience', label: 'Work Experience', shortLabel: 'Experience' },
    { id: 'projects', label: 'Projects & Highlights', shortLabel: 'Projects' },
    { id: 'skills', label: 'Skills & Competencies', shortLabel: 'Skills' },
    { id: 'education', label: 'Education & Degrees', shortLabel: 'Education' },
    { id: 'certifications', label: 'Certifications', shortLabel: 'Certifications' },
    { id: 'achievements', label: 'Key Achievements', shortLabel: 'Achievements' },
    { id: 'languages', label: 'Languages', shortLabel: 'Languages' },
    { id: 'custom', label: 'Custom Sections', shortLabel: 'Custom' },
  ];

  const workspaceMobileClass =
    mobileView === 'edit'
      ? 'cv-editor-workspace--mobile-edit'
      : 'cv-editor-workspace--mobile-preview';

  return (
    <div className="cv-editor-page">
      {/* 1. Sub-Header Toolbar */}
      <div className="cv-editor-toolbar">
        <div className="cv-editor-toolbar__left">
          <Link to="/templates" className="cv-editor-back-link">
            ← Templates
          </Link>
          <div className="cv-editor-doc-title">
            <input
              type="text"
              value={cvData.title}
              onChange={(e) => {
                setSaveStatus('saving');
                setCvData((prev) => ({ ...prev, title: e.target.value }));
              }}
              className="cv-doc-title-input"
              aria-label="Document Title"
            />
          </div>
          <Badge variant="accent" size="sm">
            {currentTemplate.name}
          </Badge>
          <div className="cv-editor-saved-status">
            <CheckCircleIcon size={14} />
            <span>{saveStatus === 'saving' ? 'Saving draft...' : 'Saved locally'}</span>
          </div>
        </div>

        <div className="cv-editor-toolbar__right">
          {/* Responsive Mobile / Tablet View Switcher */}
          <div className="cv-mobile-view-toggle">
            <button
              type="button"
              className={`cv-mobile-toggle-btn ${
                mobileView === 'edit' ? 'cv-mobile-toggle-btn--active' : ''
              }`}
              onClick={() => setMobileView('edit')}
            >
              Edit Form
            </button>
            <button
              type="button"
              className={`cv-mobile-toggle-btn ${
                mobileView === 'preview' ? 'cv-mobile-toggle-btn--active' : ''
              }`}
              onClick={() => setMobileView('preview')}
            >
              Live Preview
            </button>
          </div>

          {/* Quick template selector */}
          <div className="cv-template-quick-select">
            <label htmlFor="quick-tpl" className="sr-only">
              Switch Template
            </label>
            <select
              id="quick-tpl"
              value={currentTemplate.id}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="cv-quick-tpl-select"
              aria-label="Switch CV Template"
            >
              {TEMPLATES_REGISTRY.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
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
            Templates
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

      {/* 2. Split-Pane Workspace: Left 42% (Form), Right 58% (Preview) */}
      <div className={`cv-editor-workspace ${workspaceMobileClass}`}>
        {/* =========================================================================
            LEFT PANEL: EDITING CONTROLS (42% width)
            Fixed Top Header + Independent Scrollable Area
            ========================================================================= */}
        <aside className="cv-editor-sidebar" aria-label="Editor sections and controls">
          {/* Fixed Sub-Header inside Left Panel */}
          <div className="cv-sidebar-top-bar">
            {/* Primary View Tabs */}
            <div className="cv-sidebar-tabs">
              <button
                className={`cv-sidebar-tab ${
                  activeTab === 'content' ? 'cv-sidebar-tab--active' : ''
                }`}
                onClick={() => setActiveTab('content')}
              >
                Content
              </button>
              <button
                className={`cv-sidebar-tab ${
                  activeTab === 'appearance' ? 'cv-sidebar-tab--active' : ''
                }`}
                onClick={() => setActiveTab('appearance')}
              >
                Design & Layout
              </button>
              <button
                className={`cv-sidebar-tab ${
                  activeTab === 'sections' ? 'cv-sidebar-tab--active' : ''
                }`}
                onClick={() => setActiveTab('sections')}
              >
                Manage Sections
              </button>
            </div>

            {/* Section Switcher Pills Strip (when on Content tab) */}
            {activeTab === 'content' && (
              <div
                className="cv-section-nav-strip"
                role="tablist"
                aria-label="CV Sections Navigation"
              >
                {editorSections.map((sec) => (
                  <button
                    key={sec.id}
                    role="tab"
                    aria-selected={selectedSection === sec.id}
                    className={`cv-section-nav-pill ${
                      selectedSection === sec.id ? 'cv-section-nav-pill--active' : ''
                    }`}
                    onClick={() => setSelectedSection(sec.id)}
                  >
                    <FileTextIcon size={13} />
                    <span>{sec.shortLabel}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Independent Scroll Container for Left Panel */}
          <div className="cv-sidebar-scroll-area">
            {/* TAB 1: CONTENT EDITING */}
            {activeTab === 'content' && (
              <div className="cv-section-form-container">
                <div className="cv-form-header">
                  <h2 className="cv-form-title">
                    {editorSections.find((s) => s.id === selectedSection)?.label ||
                      'Section Details'}
                  </h2>
                  <Badge variant="accent" size="sm">
                    Interactive
                  </Badge>
                </div>

                {/* 1. PERSONAL INFORMATION */}
                {selectedSection === 'personal' && (
                  <div className="cv-edit-fields">
                    {/* Profile Photo Manager */}
                    <div className="cv-photo-manager">
                      <div className="cv-photo-manager__header">
                        <span className="cv-photo-manager__title">Profile Photo (Optional)</span>
                        {currentTemplate.photoConfig?.supported ? (
                          <span className="cv-photo-template-badge cv-photo-template-badge--supported">
                            ✓ Displayed in {currentTemplate.name}
                          </span>
                        ) : (
                          <span
                            className="cv-photo-template-badge cv-photo-template-badge--unsupported"
                            title="This template design is photo-free. Your photo is safely preserved if you switch to a photo-supported template."
                          >
                            Hidden in {currentTemplate.name}
                          </span>
                        )}
                      </div>

                      {/* Hidden File Input */}
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        style={{ display: 'none' }}
                        onChange={handlePhotoFileChange}
                        aria-label="Upload profile photo"
                      />

                      {!cvData.personal.photo?.url ? (
                        <div className="cv-photo-dropzone-wrapper">
                          <div
                            className="cv-photo-dropzone"
                            onClick={() => photoInputRef.current?.click()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                photoInputRef.current?.click();
                              }
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label="Click to upload profile photo"
                          >
                            <UploadIcon size={24} className="cv-photo-dropzone__icon" />
                            <div className="cv-photo-dropzone__heading">Upload Profile Photo</div>
                            <div className="cv-photo-dropzone__hint">
                              JPG, PNG, WebP up to 5MB. Stored 100% locally in your browser.
                            </div>
                          </div>
                          <div className="cv-photo-sample-cta">
                            <span>Want a quick test?</span>
                            <button
                              type="button"
                              className="cv-photo-sample-btn"
                              onClick={handleUseSamplePhoto}
                            >
                              Use Sample Photo
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="cv-photo-edit-layout">
                          <div className="cv-photo-preview-row">
                            <div
                              className={`cv-photo-thumbnail-box shape-${
                                cvData.personal.photo.shape || 'rounded'
                              } ${
                                cvData.personal.photo.aspectRatio === '4:5' ? 'ratio-4-5' : ''
                              }`}
                            >
                              <img
                                src={cvData.personal.photo.url}
                                alt="Profile Thumbnail"
                                className="cv-photo-thumbnail-img"
                                style={{
                                  objectFit: 'cover',
                                  transform: `scale(${cvData.personal.photo.zoom || 1})`,
                                  objectPosition: `${50 + (cvData.personal.photo.position?.x || 0)}% ${
                                    50 + (cvData.personal.photo.position?.y || 0)
                                  }%`,
                                }}
                              />
                            </div>

                            <div className="cv-photo-meta">
                              <span className="cv-label" style={{ marginBottom: 4 }}>
                                Shape & Framing
                              </span>
                              <div className="cv-photo-shape-toggles">
                                <button
                                  type="button"
                                  className={`cv-photo-shape-btn ${
                                    cvData.personal.photo.shape === 'circle'
                                      ? 'cv-photo-shape-btn--active'
                                      : ''
                                  }`}
                                  onClick={() => updatePhotoSettings({ shape: 'circle' })}
                                >
                                  Circle
                                </button>
                                <button
                                  type="button"
                                  className={`cv-photo-shape-btn ${
                                    cvData.personal.photo.shape === 'rounded' ||
                                    !cvData.personal.photo.shape
                                      ? 'cv-photo-shape-btn--active'
                                      : ''
                                  }`}
                                  onClick={() => updatePhotoSettings({ shape: 'rounded' })}
                                >
                                  Rounded
                                </button>
                                <button
                                  type="button"
                                  className={`cv-photo-shape-btn ${
                                    cvData.personal.photo.shape === 'square'
                                      ? 'cv-photo-shape-btn--active'
                                      : ''
                                  }`}
                                  onClick={() => updatePhotoSettings({ shape: 'square' })}
                                >
                                  Square
                                </button>
                              </div>

                              <div className="cv-photo-actions-row" style={{ marginTop: 8 }}>
                                <button
                                  type="button"
                                  className="cv-photo-replace-btn"
                                  onClick={() => photoInputRef.current?.click()}
                                >
                                  Change Photo
                                </button>
                                <button
                                  type="button"
                                  className="cv-photo-remove-btn"
                                  onClick={handleRemovePhoto}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Adjustment Sliders */}
                          <div className="cv-photo-controls-grid">
                            <div className="cv-photo-slider-group">
                              <div className="cv-photo-slider-label">
                                <span>Zoom</span>
                                <span className="cv-photo-slider-val">
                                  {Math.round((cvData.personal.photo.zoom || 1) * 100)}%
                                </span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="2.5"
                                step="0.05"
                                value={cvData.personal.photo.zoom || 1}
                                onChange={(e) =>
                                  updatePhotoSettings({ zoom: parseFloat(e.target.value) })
                                }
                                className="cv-photo-slider"
                                aria-label="Photo Zoom Slider"
                              />
                            </div>

                            <div className="cv-photo-slider-group">
                              <div className="cv-photo-slider-label">
                                <span>Horizontal Pan</span>
                                <span className="cv-photo-slider-val">
                                  {cvData.personal.photo.position?.x || 0}%
                                </span>
                              </div>
                              <input
                                type="range"
                                min="-50"
                                max="50"
                                step="1"
                                value={cvData.personal.photo.position?.x || 0}
                                onChange={(e) =>
                                  updatePhotoSettings({
                                    position: {
                                      x: parseInt(e.target.value, 10),
                                      y: cvData.personal.photo?.position?.y || 0,
                                    },
                                  })
                                }
                                className="cv-photo-slider"
                                aria-label="Photo Horizontal Pan Slider"
                              />
                            </div>

                            <div className="cv-photo-slider-group">
                              <div className="cv-photo-slider-label">
                                <span>Vertical Pan</span>
                                <span className="cv-photo-slider-val">
                                  {cvData.personal.photo.position?.y || 0}%
                                </span>
                              </div>
                              <input
                                type="range"
                                min="-50"
                                max="50"
                                step="1"
                                value={cvData.personal.photo.position?.y || 0}
                                onChange={(e) =>
                                  updatePhotoSettings({
                                    position: {
                                      x: cvData.personal.photo?.position?.x || 0,
                                      y: parseInt(e.target.value, 10),
                                    },
                                  })
                                }
                                className="cv-photo-slider"
                                aria-label="Photo Vertical Pan Slider"
                              />
                            </div>
                          </div>

                          <p className="cv-photo-privacy-note">
                            🔒 <strong>Privacy:</strong> Your photo is kept 100% in local browser storage (IndexedDB). It is never sent to any server or third party.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="cv-form-group">
                      <label className="cv-label" htmlFor="edit-name">
                        Full Name
                      </label>
                      <input
                        id="edit-name"
                        type="text"
                        className="cv-input"
                        value={cvData.personal.fullName}
                        onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      />
                    </div>
                    <div className="cv-form-group">
                      <label className="cv-label" htmlFor="edit-role">
                        Target Role / Title
                      </label>
                      <input
                        id="edit-role"
                        type="text"
                        className="cv-input"
                        value={cvData.personal.targetRole}
                        onChange={(e) => updatePersonalInfo('targetRole', e.target.value)}
                      />
                    </div>
                    <div className="cv-grid-2">
                      <div className="cv-form-group">
                        <label className="cv-label" htmlFor="edit-email">
                          Email Address
                        </label>
                        <input
                          id="edit-email"
                          type="email"
                          className="cv-input"
                          value={cvData.personal.email}
                          onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        />
                      </div>
                      <div className="cv-form-group">
                        <label className="cv-label" htmlFor="edit-phone">
                          Phone Number
                        </label>
                        <input
                          id="edit-phone"
                          type="text"
                          className="cv-input"
                          value={cvData.personal.phone}
                          onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="cv-grid-2">
                      <div className="cv-form-group">
                        <label className="cv-label" htmlFor="edit-loc">
                          Location
                        </label>
                        <input
                          id="edit-loc"
                          type="text"
                          className="cv-input"
                          value={cvData.personal.location}
                          onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        />
                      </div>
                      <div className="cv-form-group">
                        <label className="cv-label" htmlFor="edit-linkedin">
                          LinkedIn
                        </label>
                        <input
                          id="edit-linkedin"
                          type="text"
                          className="cv-input"
                          value={cvData.personal.linkedin || ''}
                          onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PROFESSIONAL SUMMARY */}
                {selectedSection === 'summary' && (
                  <div className="cv-edit-fields">
                    <div className="cv-form-group">
                      <label className="cv-label">Professional Summary (Rich-Text)</label>
                      <RichTextEditor
                        value={cvData.summary}
                        onChange={(html) => {
                          setSaveStatus('saving');
                          setCvData((prev) => ({ ...prev, summary: html }));
                        }}
                        minHeight="140px"
                        ariaLabel="Professional summary editor"
                      />
                    </div>
                  </div>
                )}

                {/* 3. WORK EXPERIENCE */}
                {selectedSection === 'experience' && (
                  <div className="cv-repeatable-list">
                    {cvData.experience.map((exp, index) => (
                      <div key={exp.id} className="cv-repeatable-card">
                        <div className="cv-card-header">
                          <span className="cv-card-title">
                            {exp.title || 'Untitled Role'} — {exp.company || 'Company'}
                          </span>
                          <div className="cv-card-actions">
                            <button
                              type="button"
                              className="cv-btn-icon"
                              onClick={() => moveExperience(index, 'up')}
                              disabled={index === 0}
                              title="Move Up"
                              aria-label="Move Up"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              className="cv-btn-icon"
                              onClick={() => moveExperience(index, 'down')}
                              disabled={index === cvData.experience.length - 1}
                              title="Move Down"
                              aria-label="Move Down"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              className="cv-btn-icon cv-btn-icon--danger"
                              onClick={() => removeExperience(exp.id)}
                              title="Delete Entry"
                              aria-label="Delete Entry"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        <div className="cv-grid-2">
                          <div className="cv-form-group">
                            <label className="cv-label">Job Title</label>
                            <input
                              type="text"
                              className="cv-input"
                              value={exp.title}
                              onChange={(e) =>
                                updateExperience(exp.id, { title: e.target.value })
                              }
                            />
                          </div>
                          <div className="cv-form-group">
                            <label className="cv-label">Company</label>
                            <input
                              type="text"
                              className="cv-input"
                              value={exp.company}
                              onChange={(e) =>
                                updateExperience(exp.id, { company: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div className="cv-grid-2">
                          <div className="cv-form-group">
                            <label className="cv-label">Start Date</label>
                            <input
                              type="text"
                              className="cv-input"
                              value={exp.startDate}
                              onChange={(e) =>
                                updateExperience(exp.id, { startDate: e.target.value })
                              }
                            />
                          </div>
                          <div className="cv-form-group">
                            <label className="cv-label">End Date</label>
                            <input
                              type="text"
                              className="cv-input"
                              value={exp.endDate}
                              onChange={(e) =>
                                updateExperience(exp.id, { endDate: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div className="cv-form-group">
                          <label className="cv-label">
                            Role Description & Key Accomplishments (Rich-Text)
                          </label>
                          <RichTextEditor
                            value={exp.description || ''}
                            onChange={(html) =>
                              updateExperience(exp.id, { description: html })
                            }
                            minHeight="110px"
                            ariaLabel={`Experience description for ${exp.title}`}
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="cv-btn-add"
                      onClick={addExperience}
                    >
                      + Add Work Experience Entry
                    </button>
                  </div>
                )}

                {/* 4. PROJECTS */}
                {selectedSection === 'projects' && (
                  <div className="cv-repeatable-list">
                    {cvData.projects.map((proj, index) => (
                      <div key={proj.id} className="cv-repeatable-card">
                        <div className="cv-card-header">
                          <span className="cv-card-title">
                            {proj.title || 'Untitled Project'}
                          </span>
                          <div className="cv-card-actions">
                            <button
                              type="button"
                              className="cv-btn-icon"
                              onClick={() => moveProject(index, 'up')}
                              disabled={index === 0}
                              title="Move Up"
                              aria-label="Move Up"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              className="cv-btn-icon"
                              onClick={() => moveProject(index, 'down')}
                              disabled={index === cvData.projects.length - 1}
                              title="Move Down"
                              aria-label="Move Down"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              className="cv-btn-icon cv-btn-icon--danger"
                              onClick={() => removeProject(proj.id)}
                              title="Delete Project"
                              aria-label="Delete Project"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        <div className="cv-grid-2">
                          <div className="cv-form-group">
                            <label className="cv-label">Project Title</label>
                            <input
                              type="text"
                              className="cv-input"
                              value={proj.title}
                              onChange={(e) =>
                                updateProject(proj.id, { title: e.target.value })
                              }
                            />
                          </div>
                          <div className="cv-form-group">
                            <label className="cv-label">Role / Subtitle</label>
                            <input
                              type="text"
                              className="cv-input"
                              value={proj.subtitle || ''}
                              onChange={(e) =>
                                updateProject(proj.id, { subtitle: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div className="cv-form-group">
                          <label className="cv-label">Link / Repository</label>
                          <input
                            type="text"
                            className="cv-input"
                            value={proj.link || ''}
                            onChange={(e) =>
                              updateProject(proj.id, { link: e.target.value })
                            }
                          />
                        </div>

                        <div className="cv-form-group">
                          <label className="cv-label">Description (Rich-Text)</label>
                          <RichTextEditor
                            value={proj.description}
                            onChange={(html) =>
                              updateProject(proj.id, { description: html })
                            }
                            minHeight="100px"
                            ariaLabel={`Project description for ${proj.title}`}
                          />
                        </div>
                      </div>
                    ))}

                    <button type="button" className="cv-btn-add" onClick={addProject}>
                      + Add Project Entry
                    </button>
                  </div>
                )}

                {/* 5. SKILLS */}
                {selectedSection === 'skills' && (
                  <div className="cv-edit-fields">
                    <form onSubmit={handleAddSkill} className="cv-add-skill-row">
                      <input
                        type="text"
                        className="cv-input"
                        placeholder="Add a new skill (e.g. Next.js, Docker)..."
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                      />
                      <Button variant="secondary" size="sm" type="submit">
                        Add
                      </Button>
                    </form>

                    <div className="cv-skills-pills">
                      {cvData.skills.map((skill) => (
                        <span key={skill} className="cv-skill-chip">
                          <span>{skill}</span>
                          <button
                            type="button"
                            className="cv-skill-remove-btn"
                            onClick={() => removeSkill(skill)}
                            title={`Remove ${skill}`}
                            aria-label={`Remove ${skill}`}
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. EDUCATION */}
                {selectedSection === 'education' && (
                  <div className="cv-repeatable-list">
                    {cvData.education.map((edu, index) => (
                      <div key={edu.id} className="cv-repeatable-card">
                        <div className="cv-card-header">
                          <span className="cv-card-title">
                            {edu.degree || 'Degree'} — {edu.school || 'School'}
                          </span>
                          <div className="cv-card-actions">
                            <button
                              type="button"
                              className="cv-btn-icon"
                              onClick={() => moveEducation(index, 'up')}
                              disabled={index === 0}
                              title="Move Up"
                              aria-label="Move Up"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              className="cv-btn-icon"
                              onClick={() => moveEducation(index, 'down')}
                              disabled={index === cvData.education.length - 1}
                              title="Move Down"
                              aria-label="Move Down"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              className="cv-btn-icon cv-btn-icon--danger"
                              onClick={() => removeEducation(edu.id)}
                              title="Delete Education"
                              aria-label="Delete Education"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        <div className="cv-grid-2">
                          <div className="cv-form-group">
                            <label className="cv-label">Degree / Field</label>
                            <input
                              type="text"
                              className="cv-input"
                              value={edu.degree}
                              onChange={(e) =>
                                updateEducation(edu.id, { degree: e.target.value })
                              }
                            />
                          </div>
                          <div className="cv-form-group">
                            <label className="cv-label">School / Institution</label>
                            <input
                              type="text"
                              className="cv-input"
                              value={edu.school}
                              onChange={(e) =>
                                updateEducation(edu.id, { school: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div className="cv-grid-2">
                          <div className="cv-form-group">
                            <label className="cv-label">Graduation Year</label>
                            <input
                              type="text"
                              className="cv-input"
                              value={edu.endDate}
                              onChange={(e) =>
                                updateEducation(edu.id, { endDate: e.target.value })
                              }
                            />
                          </div>
                          <div className="cv-form-group">
                            <label className="cv-label">Honors / GPA</label>
                            <input
                              type="text"
                              className="cv-input"
                              value={edu.honors || ''}
                              onChange={(e) =>
                                updateEducation(edu.id, { honors: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="cv-btn-add"
                      onClick={addEducation}
                    >
                      + Add Education Entry
                    </button>
                  </div>
                )}

                {/* 7. CERTIFICATIONS */}
                {selectedSection === 'certifications' && (
                  <div className="cv-repeatable-list">
                    {cvData.certifications.map((cert) => (
                      <div key={cert.id} className="cv-repeatable-card">
                        <div className="cv-card-header">
                          <span className="cv-card-title">
                            {cert.name || 'Certification'}
                          </span>
                          <button
                            type="button"
                            className="cv-btn-icon cv-btn-icon--danger"
                            onClick={() => removeCertification(cert.id)}
                            title="Delete Certification"
                            aria-label="Delete Certification"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="cv-grid-2">
                          <div className="cv-form-group">
                            <label className="cv-label">Certificate Name</label>
                            <input
                              type="text"
                              className="cv-input"
                              value={cert.name}
                              onChange={(e) =>
                                updateCertification(cert.id, { name: e.target.value })
                              }
                            />
                          </div>
                          <div className="cv-form-group">
                            <label className="cv-label">Issuer</label>
                            <input
                              type="text"
                              className="cv-input"
                              value={cert.issuer}
                              onChange={(e) =>
                                updateCertification(cert.id, { issuer: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="cv-btn-add"
                      onClick={addCertification}
                    >
                      + Add Certification
                    </button>
                  </div>
                )}

                {/* 8. ACHIEVEMENTS */}
                {selectedSection === 'achievements' && (
                  <div className="cv-repeatable-list">
                    {cvData.achievements.map((ach) => (
                      <div key={ach.id} className="cv-repeatable-card">
                        <div className="cv-card-header">
                          <span className="cv-card-title">
                            {ach.title || 'Achievement'}
                          </span>
                          <button
                            type="button"
                            className="cv-btn-icon cv-btn-icon--danger"
                            onClick={() => removeAchievement(ach.id)}
                            title="Delete Achievement"
                            aria-label="Delete Achievement"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="cv-form-group">
                          <label className="cv-label">Title / Recognition</label>
                          <input
                            type="text"
                            className="cv-input"
                            value={ach.title}
                            onChange={(e) =>
                              updateAchievement(ach.id, { title: e.target.value })
                            }
                          />
                        </div>

                        <div className="cv-form-group">
                          <label className="cv-label">Description (Rich-Text)</label>
                          <RichTextEditor
                            value={ach.description}
                            onChange={(html) =>
                              updateAchievement(ach.id, { description: html })
                            }
                            minHeight="90px"
                            ariaLabel={`Achievement description for ${ach.title}`}
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="cv-btn-add"
                      onClick={addAchievement}
                    >
                      + Add Key Achievement
                    </button>
                  </div>
                )}

                {/* 9. LANGUAGES */}
                {selectedSection === 'languages' && (
                  <div className="cv-repeatable-list">
                    {cvData.languages.map((lang) => (
                      <div key={lang.id} className="cv-repeatable-card">
                        <div className="cv-card-header">
                          <span className="cv-card-title">{lang.language}</span>
                          <button
                            type="button"
                            className="cv-btn-icon cv-btn-icon--danger"
                            onClick={() => removeLanguage(lang.id)}
                            title="Delete Language"
                            aria-label="Delete Language"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="cv-grid-2">
                          <div className="cv-form-group">
                            <label className="cv-label">Language</label>
                            <input
                              type="text"
                              className="cv-input"
                              value={lang.language}
                              onChange={(e) =>
                                updateLanguage(lang.id, { language: e.target.value })
                              }
                            />
                          </div>
                          <div className="cv-form-group">
                            <label className="cv-label">Proficiency Level</label>
                            <input
                              type="text"
                              className="cv-input"
                              value={lang.proficiency}
                              onChange={(e) =>
                                updateLanguage(lang.id, { proficiency: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="cv-btn-add"
                      onClick={addLanguage}
                    >
                      + Add Language
                    </button>
                  </div>
                )}

                {/* 10. CUSTOM SECTIONS */}
                {selectedSection === 'custom' && (
                  <div className="cv-repeatable-list">
                    {cvData.customSections.map((sec) => (
                      <div key={sec.id} className="cv-repeatable-card">
                        <div className="cv-card-header">
                          <input
                            type="text"
                            className="cv-input"
                            style={{ fontWeight: 600, width: '70%' }}
                            value={sec.sectionTitle}
                            onChange={(e) =>
                              updateCustomSection(sec.id, e.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="cv-btn-icon cv-btn-icon--danger"
                            onClick={() => removeCustomSection(sec.id)}
                            title="Delete Section"
                            aria-label="Delete Section"
                          >
                            ✕
                          </button>
                        </div>

                        {sec.items.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              padding: '10px',
                              background: 'var(--bg-secondary)',
                              borderRadius: '4px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <input
                                type="text"
                                className="cv-input"
                                placeholder="Item heading / title"
                                value={item.title}
                                onChange={(e) =>
                                  updateCustomItem(sec.id, item.id, {
                                    title: e.target.value,
                                  })
                                }
                              />
                              <button
                                type="button"
                                className="cv-btn-icon cv-btn-icon--danger"
                                onClick={() => removeCustomItem(sec.id, item.id)}
                                title="Delete Item"
                                aria-label="Delete Item"
                              >
                                ✕
                              </button>
                            </div>

                            <RichTextEditor
                              value={item.content}
                              onChange={(html) =>
                                updateCustomItem(sec.id, item.id, { content: html })
                              }
                              minHeight="90px"
                              ariaLabel={`Custom content for ${item.title}`}
                            />
                          </div>
                        ))}

                        <button
                          type="button"
                          className="cv-btn-add"
                          onClick={() => addCustomItem(sec.id)}
                        >
                          + Add Item to {sec.sectionTitle}
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="cv-btn-add"
                      onClick={addCustomSection}
                    >
                      + Add New Custom Section
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: DESIGN & APPEARANCE */}
            {activeTab === 'appearance' && (
              <div className="cv-appearance-box">
                <div className="cv-form-header">
                  <h2 className="cv-form-title">Template & Typography</h2>
                  <Badge variant="accent" size="sm">
                    {currentTemplate.name}
                  </Badge>
                </div>

                <div className="cv-form-group">
                  <label className="cv-label">Select Active Template</label>
                  <div className="cv-template-cards-grid">
                    {TEMPLATES_REGISTRY.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className={`cv-template-mini-card ${
                          t.id === currentTemplate.id
                            ? 'cv-template-mini-card--active'
                            : ''
                        }`}
                        onClick={() => handleTemplateChange(t.id)}
                      >
                        <div className="cv-mini-card-header">
                          <span
                            className="cv-mini-card-color"
                            style={{ backgroundColor: t.primaryColor }}
                          />
                          <Badge variant="neutral" size="sm">
                            {t.categoryLabel}
                          </Badge>
                        </div>
                        <div className="cv-mini-card-name">{t.name}</div>
                        <div className="cv-mini-card-desc">{t.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="cv-form-group" style={{ marginTop: '12px' }}>
                  <label className="cv-label">Template Details</label>
                  <p className="cv-form-notice">
                    Current active layout: <strong>{currentTemplate.name}</strong> (
                    {currentTemplate.headerStyle} header,{' '}
                    {currentTemplate.fontFamily} typography).
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: MANAGE SECTIONS */}
            {activeTab === 'sections' && (
              <div className="cv-appearance-box">
                <div className="cv-form-header">
                  <h2 className="cv-form-title">Manage CV Sections</h2>
                  <Badge variant="neutral" size="sm">
                    {editorSections.length} Sections
                  </Badge>
                </div>

                <div className="cv-manage-sections-list">
                  {editorSections.map((sec) => (
                    <div key={sec.id} className="cv-manage-section-item">
                      <div className="cv-manage-section-name">
                        <FileTextIcon size={16} />
                        <span>{sec.label}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedSection(sec.id);
                          setActiveTab('content');
                        }}
                      >
                        Edit →
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={addCustomSection}
                  style={{ marginTop: '12px' }}
                >
                  + Add Custom Section
                </Button>
              </div>
            )}
          </div>
        </aside>

        {/* =========================================================================
            RIGHT PANEL: LIVE A4 PREVIEW (58% width)
            Fixed Top Bar with Zoom Controls + Independent Scroll Area
            ========================================================================= */}
        <section
          className="cv-editor-preview-canvas"
          aria-label="Live CV Document Preview"
        >
          {/* Fixed Toolbar within Preview Panel */}
          <div className="cv-canvas-bar">
            <div className="cv-canvas-bar__info">
              <SparklesIcon size={16} />
              <span>
                Live A4 Preview • Template: <strong>{currentTemplate.name}</strong>
              </span>
            </div>

            <div className="cv-canvas-bar__actions">
              {/* Zoom Controls */}
              <div
                className="cv-zoom-controls"
                role="group"
                aria-label="Preview zoom controls"
              >
                <button
                  type="button"
                  className="cv-zoom-btn"
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  −
                </button>
                <span className="cv-zoom-level">{zoomLevel}%</span>
                <button
                  type="button"
                  className="cv-zoom-btn"
                  onClick={handleZoomIn}
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  +
                </button>
                <button
                  type="button"
                  className="cv-zoom-btn"
                  onClick={handleZoomReset}
                  title="Reset Zoom to 100%"
                  aria-label="Reset Zoom"
                >
                  Reset
                </button>
              </div>

              <span className="cv-canvas-badge">Auto-Synced</span>
            </div>
          </div>

          {/* Independent Scroll Container for Right Panel */}
          <div className="cv-preview-scroll-area">
            <div
              className="cv-preview-zoom-container"
              style={{
                transform: `scale(${zoomLevel / 100})`,
              }}
            >
              <CVRenderer cvData={cvData} template={currentTemplate} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
