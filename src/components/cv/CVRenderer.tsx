import React from 'react';
import type { CVData } from '../../types/cv';
import type { TemplateConfig } from '../../data/templates';
import './CVRenderer.css';

interface CVRendererProps {
  cvData: CVData;
  template: TemplateConfig;
}

export const CVRenderer: React.FC<CVRendererProps> = ({ cvData, template }) => {
  const { personal, summary, experience, education, skills } = cvData;

  const fontClass =
    template.fontFamily === 'serif'
      ? 'cv-renderer--font-serif'
      : template.fontFamily === 'system'
      ? 'cv-renderer--font-system'
      : 'cv-renderer--font-inter';

  const headerClass = `cv-renderer__header cv-renderer__header--${template.headerStyle}`;

  const customStyle = {
    '--tpl-primary': template.primaryColor,
    '--tpl-secondary': template.secondaryColor || template.primaryColor,
  } as React.CSSProperties;

  return (
    <div className={`cv-renderer ${fontClass}`} style={customStyle}>
      {/* Header */}
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

      {/* Main Content Body */}
      <main className="cv-renderer__body">
        {/* Professional Summary */}
        {summary && (
          <section className="cv-renderer__section">
            <h2 className="cv-renderer__section-heading">Professional Summary</h2>
            <p className="cv-renderer__text">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="cv-renderer__section">
            <h2 className="cv-renderer__section-heading">Work Experience</h2>
            {experience.map((item) => (
              <div key={item.id} className="cv-renderer__item">
                <div className="cv-renderer__item-header">
                  <div>
                    <span className="cv-renderer__item-title">{item.title}</span>
                    <span className="cv-renderer__item-sub"> — {item.company}</span>
                  </div>
                  <span className="cv-renderer__item-date">
                    {item.startDate} — {item.endDate}
                  </span>
                </div>
                {item.bullets && item.bullets.length > 0 && (
                  <ul className="cv-renderer__bullets">
                    {item.bullets.map((bullet, idx) => (
                      <li key={idx} className="cv-renderer__bullet">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section className="cv-renderer__section">
            <h2 className="cv-renderer__section-heading">Key Competencies & Technical Skills</h2>
            <div className="cv-renderer__skills">
              {skills.map((skill, idx) => (
                <span key={idx} className="cv-renderer__skill-badge">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
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
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};
