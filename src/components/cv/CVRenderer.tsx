import React from 'react';
import type { CVData } from '../../types/cv';
import type { TemplateConfig } from '../../data/templates';
import './CVRenderer.css';

interface CVRendererProps {
  cvData: CVData;
  template: TemplateConfig;
}

const FormattedContent: React.FC<{ content?: string; className?: string }> = ({
  content,
  className = 'cv-rich-content',
}) => {
  if (!content) return null;
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return <p className="cv-renderer__text">{content}</p>;
};

export const CVRenderer: React.FC<CVRendererProps> = ({ cvData, template }) => {
  const {
    personal,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections,
  } = cvData;

  const fontClass =
    template.fontFamily === 'serif'
      ? 'cv-renderer--font-serif'
      : template.fontFamily === 'system'
      ? 'cv-renderer--font-system'
      : 'cv-renderer--font-inter';

  const spacingClass =
    template.spacingScale === 'compact'
      ? 'cv-renderer--spacing-compact'
      : template.spacingScale === 'relaxed'
      ? 'cv-renderer--spacing-relaxed'
      : 'cv-renderer--spacing-standard';

  const layoutClass = `cv-renderer--layout-${template.layoutEngine}`;
  const headerClass = `cv-renderer__header cv-renderer__header--${template.headerStyle}`;

  const customStyle = {
    '--tpl-primary': template.primaryColor,
    '--tpl-secondary': template.secondaryColor || template.primaryColor,
    '--tpl-accent': template.accentColor || template.primaryColor,
  } as React.CSSProperties;

  const isPhotoSupported = !!template.photoConfig?.supported && !!personal.photo?.url;

  // Profile Photo Renderer
  const renderProfilePhoto = (extraClass = '') => {
    if (!isPhotoSupported || !personal.photo?.url) return null;
    const photo = personal.photo;
    const shape = photo.shape || template.photoConfig?.defaultShape || 'rounded';
    const size = template.photoConfig?.size || 'md';
    const aspectRatio = photo.aspectRatio || template.photoConfig?.aspectRatio || '1:1';

    const shapeClass =
      shape === 'circle'
        ? 'cv-photo--circle'
        : shape === 'square'
        ? 'cv-photo--square'
        : 'cv-photo--rounded';

    const sizeClass = `cv-photo--size-${size}`;
    const ratioClass = aspectRatio === '4:5' ? 'cv-photo--ratio-4-5' : 'cv-photo--ratio-1-1';

    const imgStyle: React.CSSProperties = {
      objectFit: 'cover',
      transform: `scale(${photo.zoom || 1})`,
      objectPosition: `${50 + (photo.position?.x || 0)}% ${50 + (photo.position?.y || 0)}%`,
    };

    return (
      <div
        className={`cv-profile-photo-frame ${shapeClass} ${sizeClass} ${ratioClass} ${extraClass}`}
        aria-label={`${personal.fullName || 'User'} profile photo`}
      >
        <img
          src={photo.url}
          alt={personal.fullName || 'Profile'}
          className="cv-profile-photo-img"
          style={imgStyle}
          onError={(e) => {
            // Graceful fallback: hide corrupted image cleanly without breaking layout
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  };

  // Reusable Section Renderers
  const renderSummary = () =>
    summary ? (
      <section className="cv-renderer__section">
        <h2 className="cv-renderer__section-heading">Professional Summary</h2>
        <FormattedContent content={summary} />
      </section>
    ) : null;

  const renderExperience = () =>
    experience && experience.length > 0 ? (
      <section className="cv-renderer__section">
        <h2 className="cv-renderer__section-heading">Work Experience</h2>
        {experience.map((item) => (
          <div key={item.id} className="cv-renderer__item">
            <div className="cv-renderer__item-header">
              <div>
                <span className="cv-renderer__item-title">{item.title}</span>
                <span className="cv-renderer__item-sub"> — {item.company}</span>
                {item.location && <span className="cv-renderer__item-sub"> ({item.location})</span>}
              </div>
              <span className="cv-renderer__item-date">
                {item.startDate} — {item.endDate}
              </span>
            </div>
            {item.description && <FormattedContent content={item.description} />}
            {item.bullets && item.bullets.length > 0 && (
              <ul className="cv-renderer__bullets">
                {item.bullets.map((bullet, idx) => (
                  <li key={idx} className="cv-renderer__bullet">
                    {/<[a-z][\s\S]*>/i.test(bullet) ? (
                      <span dangerouslySetInnerHTML={{ __html: bullet }} />
                    ) : (
                      bullet
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    ) : null;

  const renderProjects = () =>
    projects && projects.length > 0 ? (
      <section className="cv-renderer__section">
        <h2 className="cv-renderer__section-heading">Key Projects & Initiatives</h2>
        {projects.map((proj) => (
          <div key={proj.id} className="cv-renderer__item">
            <div className="cv-renderer__item-header">
              <div>
                <span className="cv-renderer__item-title">{proj.title}</span>
                {proj.subtitle && <span className="cv-renderer__item-sub"> • {proj.subtitle}</span>}
                {proj.link && <span className="cv-renderer__item-sub"> ({proj.link})</span>}
              </div>
              {(proj.startDate || proj.endDate) && (
                <span className="cv-renderer__item-date">
                  {proj.startDate} {proj.startDate && proj.endDate ? '—' : ''} {proj.endDate}
                </span>
              )}
            </div>
            {proj.description && <FormattedContent content={proj.description} />}
            {proj.highlights && proj.highlights.length > 0 && (
              <ul className="cv-renderer__bullets">
                {proj.highlights.map((h, idx) => (
                  <li key={idx} className="cv-renderer__bullet">
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    ) : null;

  const renderSkills = () =>
    skills && skills.length > 0 ? (
      <section className="cv-renderer__section">
        <h2 className="cv-renderer__section-heading">Core Skills & Competencies</h2>
        <div className="cv-renderer__skills">
          {skills.map((skill, idx) => (
            <span key={idx} className="cv-renderer__skill-badge">
              {skill}
            </span>
          ))}
        </div>
      </section>
    ) : null;

  const renderEducation = () =>
    education && education.length > 0 ? (
      <section className="cv-renderer__section">
        <h2 className="cv-renderer__section-heading">Education</h2>
        {education.map((item) => (
          <div key={item.id} className="cv-renderer__item">
            <div className="cv-renderer__item-header">
              <div>
                <span className="cv-renderer__item-title">{item.degree}</span>
                <span className="cv-renderer__item-sub"> — {item.school}</span>
              </div>
              <span className="cv-renderer__item-date">{item.endDate}</span>
            </div>
            {item.honors && <p className="cv-renderer__text">{item.honors}</p>}
            {item.description && <FormattedContent content={item.description} />}
          </div>
        ))}
      </section>
    ) : null;

  const renderCertifications = () =>
    certifications && certifications.length > 0 ? (
      <section className="cv-renderer__section">
        <h2 className="cv-renderer__section-heading">Certifications & Credentials</h2>
        {certifications.map((cert) => (
          <div key={cert.id} className="cv-renderer__item">
            <div className="cv-renderer__item-header">
              <div>
                <span className="cv-renderer__item-title">{cert.name}</span>
                <span className="cv-renderer__item-sub"> — {cert.issuer}</span>
              </div>
              {cert.date && <span className="cv-renderer__item-date">{cert.date}</span>}
            </div>
          </div>
        ))}
      </section>
    ) : null;

  const renderAchievements = () =>
    achievements && achievements.length > 0 ? (
      <section className="cv-renderer__section">
        <h2 className="cv-renderer__section-heading">Key Achievements</h2>
        {achievements.map((ach) => (
          <div key={ach.id} className="cv-renderer__item">
            <div className="cv-renderer__item-header">
              <span className="cv-renderer__item-title">{ach.title}</span>
              {ach.date && <span className="cv-renderer__item-date">{ach.date}</span>}
            </div>
            {ach.description && <FormattedContent content={ach.description} />}
          </div>
        ))}
      </section>
    ) : null;

  const renderLanguages = () =>
    languages && languages.length > 0 ? (
      <section className="cv-renderer__section">
        <h2 className="cv-renderer__section-heading">Languages</h2>
        <div className="cv-renderer__languages-grid">
          {languages.map((lang) => (
            <div key={lang.id} className="cv-renderer__language-item">
              <span className="cv-renderer__lang-name">{lang.language}</span>
              <span className="cv-renderer__lang-level">{lang.proficiency}</span>
            </div>
          ))}
        </div>
      </section>
    ) : null;

  const renderCustomSections = () =>
    customSections && customSections.length > 0
      ? customSections.map((cs) => (
          <section key={cs.id} className="cv-renderer__section">
            <h2 className="cv-renderer__section-heading">{cs.sectionTitle}</h2>
            {cs.items.map((it) => (
              <div key={it.id} className="cv-renderer__item">
                {it.title && <div className="cv-renderer__item-title">{it.title}</div>}
                <FormattedContent content={it.content} />
              </div>
            ))}
          </section>
        ))
      : null;

  // Header Layout with Photo Placement
  const renderHeader = () => {
    const photoPlacement = template.photoConfig?.placement;

    if (isPhotoSupported && photoPlacement === 'header-right') {
      return (
        <header className={headerClass}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '20px' }}>
            <div>
              <h1 className="cv-renderer__name">{personal.fullName || 'Your Name'}</h1>
              <div className="cv-renderer__role">{personal.targetRole || 'Professional Title'}</div>
              <div className="cv-renderer__contact">
                {personal.email && <span className="cv-renderer__contact-item">{personal.email}</span>}
                {personal.phone && <span className="cv-renderer__contact-item">{personal.phone}</span>}
                {personal.location && <span className="cv-renderer__contact-item">{personal.location}</span>}
                {personal.linkedin && <span className="cv-renderer__contact-item">{personal.linkedin}</span>}
                {personal.website && <span className="cv-renderer__contact-item">{personal.website}</span>}
              </div>
            </div>
            {renderProfilePhoto()}
          </div>
        </header>
      );
    }

    if (isPhotoSupported && photoPlacement === 'header-left') {
      return (
        <header className={headerClass}>
          <div className="cv-header-photo-row">
            {renderProfilePhoto()}
            <div style={{ flex: 1 }}>
              <h1 className="cv-renderer__name">{personal.fullName || 'Your Name'}</h1>
              <div className="cv-renderer__role">{personal.targetRole || 'Professional Title'}</div>
              <div className="cv-renderer__contact">
                {personal.email && <span className="cv-renderer__contact-item">{personal.email}</span>}
                {personal.phone && <span className="cv-renderer__contact-item">{personal.phone}</span>}
                {personal.location && <span className="cv-renderer__contact-item">{personal.location}</span>}
                {personal.linkedin && <span className="cv-renderer__contact-item">{personal.linkedin}</span>}
                {personal.website && <span className="cv-renderer__contact-item">{personal.website}</span>}
              </div>
            </div>
          </div>
        </header>
      );
    }

    // Default Header without photo or sidebar placement
    return (
      <header className={headerClass}>
        <div>
          <h1 className="cv-renderer__name">{personal.fullName || 'Your Name'}</h1>
          <div className="cv-renderer__role">{personal.targetRole || 'Professional Title'}</div>
        </div>

        <div className="cv-renderer__contact">
          {personal.email && <span className="cv-renderer__contact-item">{personal.email}</span>}
          {personal.phone && <span className="cv-renderer__contact-item">{personal.phone}</span>}
          {personal.location && <span className="cv-renderer__contact-item">{personal.location}</span>}
          {personal.linkedin && <span className="cv-renderer__contact-item">{personal.linkedin}</span>}
          {personal.website && <span className="cv-renderer__contact-item">{personal.website}</span>}
        </div>
      </header>
    );
  };

  return (
    <div className={`cv-renderer ${fontClass} ${spacingClass} ${layoutClass}`} style={customStyle}>
      {renderHeader()}

      {/* Main Body per Layout Engine */}
      {template.layoutEngine === 'left-sidebar' ? (
        <div className="cv-renderer__body-split">
          <aside className="cv-sidebar-col">
            {isPhotoSupported && template.photoConfig?.placement === 'sidebar' && (
              <div className="cv-sidebar-photo-wrap">{renderProfilePhoto()}</div>
            )}
            {renderSkills()}
            {renderEducation()}
            {renderCertifications()}
            {renderLanguages()}
          </aside>
          <main className="cv-main-col">
            {renderSummary()}
            {renderExperience()}
            {renderProjects()}
            {renderAchievements()}
            {renderCustomSections()}
          </main>
        </div>
      ) : template.layoutEngine === 'right-sidebar' ? (
        <div className="cv-renderer__body-split">
          <main className="cv-main-col">
            {renderSummary()}
            {renderExperience()}
            {renderProjects()}
            {renderCustomSections()}
          </main>
          <aside className="cv-sidebar-col">
            {isPhotoSupported && template.photoConfig?.placement === 'sidebar' && (
              <div className="cv-sidebar-photo-wrap">{renderProfilePhoto()}</div>
            )}
            {renderSkills()}
            {renderEducation()}
            {renderCertifications()}
            {renderLanguages()}
            {renderAchievements()}
          </aside>
        </div>
      ) : template.layoutEngine === 'two-column' ? (
        <main className="cv-renderer__body">
          <div className="cv-col-main">
            {renderSummary()}
            {renderExperience()}
            {renderProjects()}
            {renderCustomSections()}
          </div>
          <div className="cv-col-side">
            {renderSkills()}
            {renderEducation()}
            {renderCertifications()}
            {renderLanguages()}
            {renderAchievements()}
          </div>
        </main>
      ) : template.layoutEngine === 'academic-centered' ? (
        <main className="cv-renderer__body">
          {renderEducation()}
          {renderSummary()}
          {renderExperience()}
          {renderCustomSections()}
          {renderCertifications()}
          {renderSkills()}
          {renderAchievements()}
          {renderLanguages()}
        </main>
      ) : (
        /* single-column, compact-grid, asymmetric */
        <main className="cv-renderer__body">
          {renderSummary()}
          {renderExperience()}
          {renderProjects()}
          {renderSkills()}
          {renderEducation()}
          {renderCertifications()}
          {renderAchievements()}
          {renderLanguages()}
          {renderCustomSections()}
        </main>
      )}
    </div>
  );
};
