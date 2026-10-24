import type { CVData } from '../../../types/cv';
import { generateStableId } from '../../../types/cv';
import { escapeHtml, plainTextToSafeHtml } from '../textSanitizer';

interface JsonResumeItem {
  name?: string;
  position?: string;
  company?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  description?: string;
  highlights?: string[];
  institution?: string;
  school?: string;
  area?: string;
  studyType?: string;
  degree?: string;
  location?: string | { city?: string; region?: string; countryCode?: string; address?: string };
  url?: string;
  website?: string;
  issuer?: string;
  date?: string;
  language?: string;
  fluency?: string;
  proficiency?: string;
  keywords?: string[];
}

export function validateAndParseJson(jsonContent: string, fileName: string): CVData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonContent);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Invalid JSON syntax';
    throw new Error(`Failed to parse JSON file "${fileName}": ${msg}`, { cause: err });
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Invalid JSON structure: Root must be a JSON object representing resume data.');
  }

  const obj = parsed as Record<string, unknown>;

  // Check if it's JSON Resume standard (has `basics`) or CVForge standard (has `personal` or `experience`)
  const hasBasics = obj.basics && typeof obj.basics === 'object';
  const hasPersonal = obj.personal && typeof obj.personal === 'object';
  const hasExp = Array.isArray(obj.experience) || Array.isArray(obj.work);
  const hasEdu = Array.isArray(obj.education);
  const hasSkills = Array.isArray(obj.skills);
  const hasSummary = typeof obj.summary === 'string';

  if (!hasBasics && !hasPersonal && !hasExp && !hasEdu && !hasSkills && !hasSummary) {
    throw new Error(
      'The JSON document does not contain recognizable resume sections (such as personal/basics, experience/work, education, or skills).'
    );
  }

  // Extract Personal Info
  let fullName = '';
  let targetRole = '';
  let email = '';
  let phone = '';
  let locationStr = '';
  let linkedin = '';
  let website = '';
  let summary = '';

  if (hasPersonal) {
    const p = obj.personal as Record<string, unknown>;
    fullName = typeof p.fullName === 'string' ? p.fullName.trim() : '';
    targetRole = typeof p.targetRole === 'string' ? p.targetRole.trim() : '';
    email = typeof p.email === 'string' ? p.email.trim() : '';
    phone = typeof p.phone === 'string' ? p.phone.trim() : '';
    locationStr = typeof p.location === 'string' ? p.location.trim() : '';
    linkedin = typeof p.linkedin === 'string' ? p.linkedin.trim() : '';
    website = typeof p.website === 'string' ? p.website.trim() : '';
  } else if (hasBasics) {
    const b = obj.basics as Record<string, unknown>;
    fullName = typeof b.name === 'string' ? b.name.trim() : '';
    targetRole = typeof b.label === 'string' ? b.label.trim() : '';
    email = typeof b.email === 'string' ? b.email.trim() : '';
    phone = typeof b.phone === 'string' ? b.phone.trim() : '';
    website = typeof b.url === 'string' ? b.url.trim() : '';

    if (typeof b.summary === 'string') {
      summary = b.summary.startsWith('<p>') ? b.summary : plainTextToSafeHtml(b.summary);
    }

    if (typeof b.location === 'string') {
      locationStr = b.location.trim();
    } else if (b.location && typeof b.location === 'object') {
      const loc = b.location as Record<string, unknown>;
      const parts = [loc.city, loc.region, loc.countryCode].filter(
        (part): part is string => typeof part === 'string' && part.trim().length > 0
      );
      locationStr = parts.join(', ');
    }

    // Check profiles for LinkedIn
    if (Array.isArray(b.profiles)) {
      for (const prof of b.profiles) {
        if (prof && typeof prof === 'object') {
          const pObj = prof as { network?: string; url?: string };
          if (pObj.network && pObj.network.toLowerCase().includes('linkedin') && pObj.url) {
            linkedin = pObj.url;
          } else if (pObj.network && pObj.network.toLowerCase().includes('github') && pObj.url && !website) {
            website = pObj.url;
          }
        }
      }
    }
  }

  if (!summary && typeof obj.summary === 'string') {
    summary = obj.summary.startsWith('<p>') ? obj.summary : plainTextToSafeHtml(obj.summary);
  }

  // Extract Experience
  const rawExp = Array.isArray(obj.experience)
    ? (obj.experience as JsonResumeItem[])
    : Array.isArray(obj.work)
    ? (obj.work as JsonResumeItem[])
    : [];

  const experience = rawExp.map((item, idx) => {
    const desc = item.description || item.summary || '';
    const safeDesc = desc.startsWith('<p>') ? desc : plainTextToSafeHtml(desc);
    return {
      id: generateStableId(`exp-${idx + 1}`),
      title: item.title || item.position || '',
      company: item.company || item.name || '',
      location: typeof item.location === 'string' ? item.location : '',
      startDate: item.startDate || '',
      endDate: item.endDate || 'Present',
      bullets: Array.isArray(item.highlights)
        ? item.highlights.map((h) => escapeHtml(String(h)))
        : [],
      description: safeDesc,
    };
  });

  // Extract Education
  const rawEdu = Array.isArray(obj.education) ? (obj.education as JsonResumeItem[]) : [];
  const education = rawEdu.map((item, idx) => {
    let degreeStr = item.degree || '';
    if (!degreeStr && (item.studyType || item.area)) {
      degreeStr = [item.studyType, item.area].filter(Boolean).join(' in ');
    }
    const desc = item.description || item.summary || '';
    return {
      id: generateStableId(`edu-${idx + 1}`),
      degree: degreeStr,
      school: item.school || item.institution || '',
      location: typeof item.location === 'string' ? item.location : '',
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      honors: '',
      description: desc ? plainTextToSafeHtml(desc) : '',
    };
  });

  // Extract Skills
  const rawSkills = Array.isArray(obj.skills) ? obj.skills : [];
  const skills: string[] = [];
  for (const s of rawSkills) {
    if (typeof s === 'string' && s.trim()) {
      skills.push(s.trim());
    } else if (s && typeof s === 'object') {
      const sObj = s as { name?: string; keywords?: string[] };
      if (sObj.name) skills.push(sObj.name.trim());
      if (Array.isArray(sObj.keywords)) {
        for (const kw of sObj.keywords) {
          if (typeof kw === 'string' && kw.trim()) {
            skills.push(kw.trim());
          }
        }
      }
    }
  }

  // Extract Projects
  const rawProj = Array.isArray(obj.projects) ? (obj.projects as JsonResumeItem[]) : [];
  const projects = rawProj.map((item, idx) => {
    const desc = item.description || item.summary || '';
    return {
      id: generateStableId(`proj-${idx + 1}`),
      title: item.title || item.name || '',
      subtitle: item.position || '',
      link: item.url || item.website || '',
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      description: desc ? plainTextToSafeHtml(desc) : '',
      highlights: Array.isArray(item.highlights)
        ? item.highlights.map((h) => escapeHtml(String(h)))
        : [],
    };
  });

  // Extract Certifications
  const rawCerts = Array.isArray(obj.certifications)
    ? (obj.certifications as JsonResumeItem[])
    : Array.isArray(obj.certificates)
    ? (obj.certificates as JsonResumeItem[])
    : [];

  const certifications = rawCerts.map((item, idx) => ({
    id: generateStableId(`cert-${idx + 1}`),
    name: item.name || item.title || '',
    issuer: item.issuer || '',
    date: item.date || item.startDate || '',
    url: item.url || '',
  }));

  const cvData: CVData = {
    id: generateStableId('imported-cv'),
    title: (typeof obj.title === 'string' && obj.title.trim()) || `${fullName || 'Imported'} CV`,
    templateId: (typeof obj.templateId === 'string' && obj.templateId.trim()) || 'silicon-modern',
    personal: {
      fullName,
      targetRole,
      email,
      phone,
      location: locationStr,
      linkedin,
      website,
    },
    summary,
    experience,
    education,
    skills: Array.from(new Set(skills)),
    projects,
    certifications,
    achievements: [],
    languages: [],
    customSections: [],
    updatedAt: new Date().toISOString(),
  };

  return cvData;
}
