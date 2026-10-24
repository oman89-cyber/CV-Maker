export interface ProfilePhotoSettings {
  key?: string;
  url?: string;
  shape?: 'circle' | 'square' | 'rounded';
  zoom?: number;
  position?: { x: number; y: number };
  aspectRatio?: '1:1' | '4:5';
}

export interface PersonalInfo {
  fullName: string;
  targetRole: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  photo?: ProfilePhotoSettings;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  bullets: string[];
  description?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location?: string;
  startDate?: string;
  endDate: string;
  honors?: string;
  description?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  link?: string;
  startDate?: string;
  endDate?: string;
  description: string;
  highlights?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  url?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  date?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string; // e.g. "Native", "Fluent", "Professional", "Conversational"
}

export interface CustomSectionItem {
  id: string;
  title: string;
  content: string;
}

export interface CustomSection {
  id: string;
  sectionTitle: string;
  items: CustomSectionItem[];
}

export interface CVData {
  id: string;
  title: string;
  templateId: string;
  personal: PersonalInfo;
  summary: string; // Rich-text HTML or string
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  languages: LanguageItem[];
  customSections: CustomSection[];
  updatedAt: string;
}

export const DEFAULT_CV_DATA: CVData = {
  id: 'default-cv',
  title: 'Senior Software Engineer CV',
  templateId: 'silicon-modern',
  personal: {
    fullName: 'Alexander Wright',
    targetRole: 'Principal Platform Architect & Engineering Lead',
    email: 'alexander.wright@domain.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/awright',
    website: 'alexwright.dev',
  },
  summary:
    '<p>Engineering leader with <strong>10+ years specializing</strong> in distributed cloud systems, real-time data streaming, and scaling high-velocity engineering organizations. Proven track record growing platforms to <em>50M+ monthly active users</em> with 99.99% availability.</p>',
  experience: [
    {
      id: 'exp-1',
      title: 'Principal Software Engineer',
      company: 'Apex Systems Cloud',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      bullets: [
        'Designed micro-frontend architecture decreasing page bundle sizes by <strong>48%</strong> across 6 core user portals.',
        'Architected high-throughput event processing pipeline handling <strong>120,000 req/sec</strong> at sub-10ms p99 latency.',
        'Mentored 14 senior engineers and established company-wide TypeScript quality guidelines.',
      ],
      description:
        '<p>Spearheaded enterprise infrastructure modernization and distributed systems migration across 4 cross-functional agile teams.</p>',
    },
    {
      id: 'exp-2',
      title: 'Senior Full Stack Engineer',
      company: 'Hyperion Labs',
      location: 'San Francisco, CA',
      startDate: '2018',
      endDate: '2022',
      bullets: [
        'Led delivery of collaborative real-time editor using WebSocket protocols and CRDTs.',
        'Reduced continuous integration build times from <strong>18 minutes to 4.2 minutes</strong>.',
      ],
      description:
        '<p>Engineered core collaborative workspace components for Fortune 500 enterprise clients.</p>',
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science & Mathematics',
      school: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: '2014',
      endDate: '2018',
      honors: 'Summa Cum Laude • Dean’s Honor List',
      description:
        '<p>Concentration in Distributed Algorithms, Advanced Operating Systems, and Applied Cryptography.</p>',
    },
  ],
  skills: [
    'TypeScript / JavaScript',
    'React & Next.js',
    'Node.js & Go',
    'PostgreSQL / Redis',
    'Kubernetes & Docker',
    'GraphQL / REST APIs',
    'System Architecture',
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'ForgeCloud Engine',
      subtitle: 'Open-Source Distributed Cache Layer',
      link: 'github.com/awright/forge-cloud',
      startDate: '2023',
      endDate: 'Present',
      description:
        '<p>High-performance in-memory cache proxy achieving <strong>3.2x throughput</strong> over standard Redis clustering in microservice topologies.</p>',
      highlights: [
        'Adopted by over 450 production engineering teams globally.',
        'Over 3,800 GitHub stars and 40+ active open-source contributors.',
      ],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Professional',
      issuer: 'Amazon Web Services',
      date: '2023',
      url: 'aws.amazon.com/verification',
    },
    {
      id: 'cert-2',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation',
      date: '2022',
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Apex Cloud Innovator of the Year',
      description:
        'Awarded for designing zero-downtime database migration strategy serving 20M+ concurrent accounts.',
      date: '2023',
    },
  ],
  languages: [
    { id: 'lang-1', language: 'English', proficiency: 'Native / Bilingual' },
    { id: 'lang-2', language: 'German', proficiency: 'Professional Working' },
  ],
  customSections: [
    {
      id: 'custom-1',
      sectionTitle: 'Publications & Patents',
      items: [
        {
          id: 'cust-item-1',
          title: 'Optimizing P2P Consensus in High-Latency Wireless Networks',
          content:
            '<p>Co-authored paper presented at <em>ACM SIGCOMM 2021</em>, demonstrating 35% latency reductions in edge nodes.</p>',
        },
      ],
    },
  ],
  updatedAt: new Date().toISOString(),
};

/**
 * Migration & normalization function to safely hydrate saved CV data,
 * handling backwards compatibility for older drafts without newer sections.
 */
export function normalizeCVData(raw: unknown): CVData {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_CV_DATA;
  }

  const d = raw as Partial<CVData>;

  return {
    id: typeof d.id === 'string' ? d.id : DEFAULT_CV_DATA.id,
    title: typeof d.title === 'string' && d.title.trim() ? d.title : DEFAULT_CV_DATA.title,
    templateId: typeof d.templateId === 'string' ? d.templateId : DEFAULT_CV_DATA.templateId,
    personal: {
      fullName: d.personal?.fullName ?? DEFAULT_CV_DATA.personal.fullName,
      targetRole: d.personal?.targetRole ?? DEFAULT_CV_DATA.personal.targetRole,
      email: d.personal?.email ?? DEFAULT_CV_DATA.personal.email,
      phone: d.personal?.phone ?? DEFAULT_CV_DATA.personal.phone,
      location: d.personal?.location ?? DEFAULT_CV_DATA.personal.location,
      linkedin: d.personal?.linkedin ?? DEFAULT_CV_DATA.personal.linkedin,
      website: d.personal?.website ?? DEFAULT_CV_DATA.personal.website,
      photo: d.personal?.photo
        ? {
            key: typeof d.personal.photo.key === 'string' ? d.personal.photo.key : undefined,
            url: typeof d.personal.photo.url === 'string' ? d.personal.photo.url : undefined,
            shape: d.personal.photo.shape || 'rounded',
            zoom: typeof d.personal.photo.zoom === 'number' ? d.personal.photo.zoom : 1,
            position: d.personal.photo.position || { x: 0, y: 0 },
            aspectRatio: d.personal.photo.aspectRatio || '1:1',
          }
        : undefined,
    },
    summary:
      typeof d.summary === 'string' && d.summary.trim()
        ? d.summary.startsWith('<')
          ? d.summary
          : `<p>${d.summary}</p>`
        : DEFAULT_CV_DATA.summary,
    experience: Array.isArray(d.experience)
      ? d.experience.map((exp, idx) => ({
          id: exp.id || `exp-${idx + 1}`,
          title: exp.title || '',
          company: exp.company || '',
          location: exp.location || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
          description: exp.description || '',
        }))
      : DEFAULT_CV_DATA.experience,
    education: Array.isArray(d.education)
      ? d.education.map((edu, idx) => ({
          id: edu.id || `edu-${idx + 1}`,
          degree: edu.degree || '',
          school: edu.school || '',
          location: edu.location || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          honors: edu.honors || '',
          description: edu.description || '',
        }))
      : DEFAULT_CV_DATA.education,
    skills: Array.isArray(d.skills) ? d.skills : DEFAULT_CV_DATA.skills,
    projects: Array.isArray(d.projects)
      ? d.projects.map((p, idx) => ({
          id: p.id || `proj-${idx + 1}`,
          title: p.title || '',
          subtitle: p.subtitle || '',
          link: p.link || '',
          startDate: p.startDate || '',
          endDate: p.endDate || '',
          description: p.description || '',
          highlights: Array.isArray(p.highlights) ? p.highlights : [],
        }))
      : DEFAULT_CV_DATA.projects,
    certifications: Array.isArray(d.certifications)
      ? d.certifications.map((c, idx) => ({
          id: c.id || `cert-${idx + 1}`,
          name: c.name || '',
          issuer: c.issuer || '',
          date: c.date || '',
          url: c.url || '',
        }))
      : DEFAULT_CV_DATA.certifications,
    achievements: Array.isArray(d.achievements)
      ? d.achievements.map((a, idx) => ({
          id: a.id || `ach-${idx + 1}`,
          title: a.title || '',
          description: a.description || '',
          date: a.date || '',
        }))
      : DEFAULT_CV_DATA.achievements,
    languages: Array.isArray(d.languages)
      ? d.languages.map((l, idx) => ({
          id: l.id || `lang-${idx + 1}`,
          language: l.language || '',
          proficiency: l.proficiency || '',
        }))
      : DEFAULT_CV_DATA.languages,
    customSections: Array.isArray(d.customSections)
      ? d.customSections.map((cs, idx) => ({
          id: cs.id || `custom-${idx + 1}`,
          sectionTitle: cs.sectionTitle || 'Custom Section',
          items: Array.isArray(cs.items)
            ? cs.items.map((it, itemIdx) => ({
                id: it.id || `item-${itemIdx + 1}`,
                title: it.title || '',
                content: it.content || '',
              }))
            : [],
        }))
      : DEFAULT_CV_DATA.customSections,
    updatedAt: typeof d.updatedAt === 'string' ? d.updatedAt : new Date().toISOString(),
  };
}

export function generateStableId(prefix = 'item'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
