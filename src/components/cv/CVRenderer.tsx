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
  // If content contains HTML tags, render it with dangerouslySetInnerHTML
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
            <FormattedContent content={summary} />
          </section>
        )}

        {/* Work Experience */}
        {experience && experience.length > 0 && (
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
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="cv-renderer__section">
            <h2 className="cv-renderer__section-heading">Projects & Initiatives</h2>
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
                {item.description && <FormattedContent content={item.description} />}
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section className="cv-renderer__section">
            <h2 className="cv-renderer__section-heading">Licenses & Certifications</h2>
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
        )}

        {/* Key Achievements */}
        {achievements && achievements.length > 0 && (
          <section className="cv-renderer__section">
            <h2 className="cv-renderer__section-heading">Key Achievements & Honors</h2>
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
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
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
        )}

        {/* Custom Sections */}
        {customSections &&
          customSections.map((cs) => (
            <section key={cs.id} className="cv-renderer__section">
              <h2 className="cv-renderer__section-heading">{cs.sectionTitle}</h2>
              {cs.items.map((it) => (
                <div key={it.id} className="cv-renderer__item">
                  {it.title && <div className="cv-renderer__item-title">{it.title}</div>}
                  <FormattedContent content={it.content} />
                </div>
              ))}
            </section>
          ))}
      </main>
    </div>
  );
};
