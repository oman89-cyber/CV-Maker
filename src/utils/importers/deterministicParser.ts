import type {
  CVData,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  CertificationItem,
  AchievementItem,
  LanguageItem,
} from '../../types/cv';
import { generateStableId } from '../../types/cv';
import type { ExtractedDocument, ImportResult, ParseWarning } from './types';
import { escapeHtml, plainTextToSafeHtml, cleanBullet } from './textSanitizer';

// Common Section Header Patterns
const SECTION_PATTERNS = {
  summary: /^(professional summary|executive summary|summary|profile|about me|career objective|objective)$/i,
  experience: /^(work experience|professional experience|employment history|experience|career history|work history|professional background)$/i,
  education: /^(education|academic background|academic qualifications|qualifications|degrees|academic history)$/i,
  skills: /^(skills & competencies|technical skills|core competencies|skills|technologies|tools & technologies|key skills|areas of expertise)$/i,
  projects: /^(projects|key projects|notable projects|technical projects|personal projects|selected projects)$/i,
  certifications: /^(certifications & licenses|certifications|credentials|certificates|licenses & certifications|professional certifications)$/i,
  achievements: /^(key achievements|achievements|honors & awards|awards & honors|awards|accomplishments)$/i,
  languages: /^(languages|language proficiency|language skills)$/i,
};

type SectionKey = keyof typeof SECTION_PATTERNS;

// Email regex
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
// International / domestic phone regex
const PHONE_REGEX = /(?:(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}|\+?\d[\d\s.-]{8,}\d)/;
// LinkedIn regex
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in\/)?([a-zA-Z0-9_-]+)/i;
// GitHub or Portfolio website regex
const GITHUB_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i;
const URL_REGEX = /(https?:\/\/[^\s]+|[a-zA-Z0-9.-]+\.(?:com|org|io|dev|net|me)(?:\/[^\s]*)?)/i;

// Date range regex
const DATE_RANGE_REGEX = /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}\s*(?:[-–—to]+|\s+to\s+)\s*(?:(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}|Present|Current)/i;
const SINGLE_YEAR_REGEX = /\b(19\d{2}|20\d{2})\b/;

export function parseDocumentText(doc: ExtractedDocument): ImportResult {
  const warnings: ParseWarning[] = [];
  const lines = doc.rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return {
      success: false,
      error: 'The extracted document contains no readable text.',
      warnings,
      fileName: doc.fileName,
      format: doc.format,
    };
  }

  // 1. Identify Sections & Split Lines
  const headerIndices: Array<{ index: number; key: SectionKey }> = [];

  lines.forEach((line, index) => {
    // Only lines that look like headers (short, not containing contact info)
    if (line.length <= 45 && !EMAIL_REGEX.test(line) && !PHONE_REGEX.test(line)) {
      const normalized = line.replace(/[:_#-]/g, '').trim();
      for (const [key, regex] of Object.entries(SECTION_PATTERNS)) {
        if (regex.test(normalized)) {
          headerIndices.push({ index, key: key as SectionKey });
          break;
        }
      }
    }
  });

  // Collect text before the first section header as Header / Contact Info
  const firstHeaderIndex = headerIndices.length > 0 ? headerIndices[0].index : Math.min(lines.length, 12);
  const headerLines = lines.slice(0, firstHeaderIndex);

  // Group lines into sections
  const sectionBuckets: Record<SectionKey, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
  };

  for (let i = 0; i < headerIndices.length; i++) {
    const current = headerIndices[i];
    const next = headerIndices[i + 1];
    const endIndex = next ? next.index : lines.length;
    const bodyLines = lines.slice(current.index + 1, endIndex);
    sectionBuckets[current.key].push(...bodyLines);
  }

  // 2. Extract Contact Information from header lines and whole document
  let email = '';
  let phone = '';
  let linkedin = '';
  let website = '';
  let locationStr = '';
  let fullName: string;
  let targetRole = '';

  // Extract email
  const fullText = doc.rawText;
  const emailMatch = fullText.match(EMAIL_REGEX);
  if (emailMatch) {
    email = emailMatch[0].trim();
  } else {
    warnings.push({ field: 'email', message: 'No email address detected.' });
  }

  // Extract phone
  const phoneMatch = fullText.match(PHONE_REGEX);
  if (phoneMatch) {
    phone = phoneMatch[0].trim();
  }

  // Extract LinkedIn
  const linkedinMatch = fullText.match(LINKEDIN_REGEX);
  if (linkedinMatch) {
    linkedin = linkedinMatch[0].startsWith('http')
      ? linkedinMatch[0]
      : `https://${linkedinMatch[0]}`;
  }

  // Extract Website / GitHub
  const githubMatch = fullText.match(GITHUB_REGEX);
  if (githubMatch) {
    website = githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`;
  } else {
    const urlMatch = fullText.match(URL_REGEX);
    if (urlMatch && !urlMatch[0].includes('linkedin.com')) {
      website = urlMatch[0].startsWith('http') ? urlMatch[0] : `https://${urlMatch[0]}`;
    }
  }

  // Determine Full Name and Target Role from header lines
  const candidateNameLines = headerLines.filter((l) => {
    // Exclude contact lines, emails, phone numbers, urls, or resume header noise
    if (EMAIL_REGEX.test(l) || PHONE_REGEX.test(l) || LINKEDIN_REGEX.test(l)) return false;
    if (/^(curriculum vitae|resume|cv|personal profile|contact information)$/i.test(l)) return false;
    return l.length >= 2 && l.length <= 45;
  });

  if (candidateNameLines.length > 0) {
    fullName = candidateNameLines[0].replace(/^(name\s*:\s*)/i, '').trim();

    if (candidateNameLines.length > 1) {
      const secondLine = candidateNameLines[1];
      // If second line has a comma, it might be location, otherwise target role
      if (secondLine.includes(',') && !secondLine.toLowerCase().includes('engineer') && !secondLine.toLowerCase().includes('manager')) {
        locationStr = secondLine.trim();
      } else {
        targetRole = secondLine.trim();
      }
    }
  } else {
    // Fallback name from file name
    fullName = doc.fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/(cv|resume|curriculum|vitae)/gi, '')
      .trim();
    warnings.push({
      field: 'fullName',
      message: 'Name was inferred from file name. Please verify your full name.',
    });
  }

  // Look for location if not set
  if (!locationStr) {
    for (const l of headerLines) {
      // Split pipe, bullet, or comma separated contact items
      const parts = l.split(/[|•·]/).map((p) => p.trim());
      for (const part of parts) {
        if (
          !part.includes('@') &&
          !PHONE_REGEX.test(part) &&
          !LINKEDIN_REGEX.test(part) &&
          !URL_REGEX.test(part) &&
          part !== fullName &&
          part !== targetRole &&
          part.length >= 2 &&
          part.length <= 45 &&
          (part.includes(',') ||
            /\b(CA|NY|TX|FL|WA|UK|USA|London|Berlin|Toronto|San Francisco|New York|Seattle|Boston|Mountain View|Austin|Chicago)\b/i.test(
              part
            ))
        ) {
          locationStr = part;
          break;
        }
      }
      if (locationStr) break;
    }
  }

  // 3. Parse Summary
  let summary = '';
  if (sectionBuckets.summary.length > 0) {
    summary = plainTextToSafeHtml(sectionBuckets.summary.join('\n'));
  }

  // 4. Parse Skills
  const rawSkillsLines = sectionBuckets.skills;
  const skills: string[] = [];

  rawSkillsLines.forEach((line) => {
    // Remove category prefixes like "Programming Languages: ", "Frameworks: "
    const cleanedLine = line.replace(/^[A-Za-z\s]+:\s*/, '');
    const tokens = cleanedLine.split(/[,;•|\u2022\u25E6\u25AA\u25AB]+/).map((s) => s.trim());
    tokens.forEach((token) => {
      if (token && token.length > 1 && token.length < 35 && !/^(skills|technologies)$/i.test(token)) {
        skills.push(token);
      }
    });
  });

  // Deduplicate skills
  const uniqueSkills = Array.from(new Set(skills));

  // 5. Parse Work Experience
  const experience: ExperienceItem[] = [];
  const expLines = sectionBuckets.experience;

  if (expLines.length > 0) {
    let currentExp: Partial<ExperienceItem> | null = null;

    for (const line of expLines) {
      const isDate = DATE_RANGE_REGEX.test(line);
      const isBullet = /^[\s•\-*–—\u2022\u25E6\u25AA\u25AB]/.test(line);

      // If currentExp already exists but doesn't have dates yet, and this line is a date range
      if (currentExp && !currentExp.startDate && isDate && !isBullet && line.length < 40) {
        const m = line.match(DATE_RANGE_REGEX);
        if (m) {
          const dateParts = m[0].split(/[-–—to]+/i).map((s) => s.trim());
          currentExp.startDate = dateParts[0] || '';
          currentExp.endDate = dateParts[1] || 'Present';
          continue;
        }
      }

      // Check if this line looks like a new position / header
      if ((isDate && !isBullet) || (line.length < 80 && (line.includes(' — ') || line.includes(' - ') || line.includes(' at ')) && !isBullet)) {
        if (currentExp && (currentExp.title || currentExp.company)) {
          experience.push({
            id: generateStableId('exp'),
            title: currentExp.title || 'Position',
            company: currentExp.company || 'Company',
            location: currentExp.location || '',
            startDate: currentExp.startDate || '',
            endDate: currentExp.endDate || 'Present',
            bullets: currentExp.bullets || [],
            description: currentExp.description || '',
          });
        }

        // Start new position
        const dateMatch = line.match(DATE_RANGE_REGEX);
        const dateStr = dateMatch ? dateMatch[0].trim() : '';
        const titleLine = dateMatch ? line.replace(DATE_RANGE_REGEX, '').trim() : line;

        let title: string;
        let company = '';

        if (titleLine.includes(' — ')) {
          [title, company] = titleLine.split(' — ').map((s) => s.trim());
        } else if (titleLine.includes(' - ')) {
          [title, company] = titleLine.split(' - ').map((s) => s.trim());
        } else if (titleLine.toLowerCase().includes(' at ')) {
          const parts = titleLine.split(/\s+at\s+/i);
          title = parts[0].trim();
          company = parts[1]?.trim() || '';
        } else {
          title = titleLine;
        }

        let startDate = '';
        let endDate = 'Present';
        if (dateStr) {
          const dateParts = dateStr.split(/[-–—to]+/i).map((s) => s.trim());
          startDate = dateParts[0] || '';
          endDate = dateParts[1] || 'Present';
        }

        currentExp = {
          title,
          company,
          startDate,
          endDate,
          bullets: [],
          description: '',
        };
      } else if (currentExp) {
        if (isBullet) {
          const cleaned = cleanBullet(line);
          if (cleaned) {
            currentExp.bullets = currentExp.bullets || [];
            currentExp.bullets.push(cleaned);
          }
        } else {
          // Additional narrative or metadata
          if (!currentExp.startDate && DATE_RANGE_REGEX.test(line)) {
            const m = line.match(DATE_RANGE_REGEX);
            if (m) {
              const dateParts = m[0].split(/[-–—to]+/i).map((s) => s.trim());
              currentExp.startDate = dateParts[0] || '';
              currentExp.endDate = dateParts[1] || 'Present';
            }
          } else if (!currentExp.description) {
            currentExp.description = `<p>${escapeHtml(line)}</p>`;
          }
        }
      }
    }

    if (currentExp && (currentExp.title || currentExp.company)) {
      experience.push({
        id: generateStableId('exp'),
        title: currentExp.title || 'Position',
        company: currentExp.company || 'Company',
        location: currentExp.location || '',
        startDate: currentExp.startDate || '',
        endDate: currentExp.endDate || 'Present',
        bullets: currentExp.bullets || [],
        description: currentExp.description || '',
      });
    }
  }

  // 6. Parse Education
  const education: EducationItem[] = [];
  const eduLines = sectionBuckets.education;

  if (eduLines.length > 0) {
    let currentEdu: Partial<EducationItem> | null = null;

    for (const line of eduLines) {
      const isDegree = /\b(bachelor|master|ph\.?d|b\.?s\.?|b\.?a\.?|m\.?s\.?|m\.?a\.?|diploma|associate|degree)\b/i.test(line);
      const isSchool = /\b(university|college|institute|school|academy)\b/i.test(line);
      const isDate = DATE_RANGE_REGEX.test(line);
      const yearMatch = line.match(SINGLE_YEAR_REGEX);

      // If line is just a date or date range for the current education entry
      if (currentEdu && (!currentEdu.endDate || !currentEdu.startDate) && (isDate || yearMatch) && !isDegree && !isSchool && line.length < 35) {
        if (isDate) {
          const m = line.match(DATE_RANGE_REGEX);
          if (m) {
            const parts = m[0].split(/[-–—to]+/i).map((s) => s.trim());
            currentEdu.startDate = parts[0] || '';
            currentEdu.endDate = parts[1] || parts[0] || '';
            continue;
          }
        }
        if (yearMatch) {
          currentEdu.endDate = yearMatch[0];
          continue;
        }
      }

      if (isDegree || isSchool) {
        if (currentEdu && (currentEdu.degree || currentEdu.school)) {
          education.push({
            id: generateStableId('edu'),
            degree: currentEdu.degree || 'Degree',
            school: currentEdu.school || 'University',
            location: currentEdu.location || '',
            startDate: currentEdu.startDate || '',
            endDate: currentEdu.endDate || '',
            honors: currentEdu.honors || '',
            description: currentEdu.description || '',
          });
        }

        let degreeStr: string;
        let schoolStr: string;

        if (line.includes(' — ') || line.includes(' - ')) {
          const parts = line.split(/[-—]/).map((s) => s.replace(SINGLE_YEAR_REGEX, '').trim());
          if (parts[0] && isDegree) {
            degreeStr = parts[0];
            schoolStr = parts[1] || '';
          } else {
            schoolStr = parts[0];
            degreeStr = parts[1] || '';
          }
        } else {
          degreeStr = isDegree ? line.replace(SINGLE_YEAR_REGEX, '').trim() : '';
          schoolStr = isSchool && !isDegree ? line.replace(SINGLE_YEAR_REGEX, '').trim() : '';
        }

        currentEdu = {
          degree: degreeStr,
          school: schoolStr,
          endDate: yearMatch ? yearMatch[0] : '',
          bullets: [],
        } as Partial<EducationItem>;
      } else if (currentEdu) {
        if (!currentEdu.school && isSchool) {
          currentEdu.school = line.replace(SINGLE_YEAR_REGEX, '').trim();
        } else if (!currentEdu.endDate && yearMatch) {
          currentEdu.endDate = yearMatch[0];
        } else if (!currentEdu.honors && /(honors|magna|cum laude|gpa|dean)/i.test(line)) {
          currentEdu.honors = line.trim();
        }
      }
    }

    if (currentEdu && (currentEdu.degree || currentEdu.school)) {
      education.push({
        id: generateStableId('edu'),
        degree: currentEdu.degree || 'Degree',
        school: currentEdu.school || 'University',
        location: currentEdu.location || '',
        startDate: currentEdu.startDate || '',
        endDate: currentEdu.endDate || '',
        honors: currentEdu.honors || '',
        description: currentEdu.description || '',
      });
    }
  }

  // 7. Parse Projects
  const projects: ProjectItem[] = [];
  const projLines = sectionBuckets.projects;

  if (projLines.length > 0) {
    let currentProj: Partial<ProjectItem> | null = null;

    for (const line of projLines) {
      const isBullet = /^[\s•\-*–—\u2022\u25E6\u25AA\u25AB]/.test(line);

      if (!isBullet && line.length < 50) {
        if (currentProj && currentProj.title) {
          projects.push({
            id: generateStableId('proj'),
            title: currentProj.title,
            subtitle: currentProj.subtitle || '',
            link: currentProj.link || '',
            startDate: currentProj.startDate || '',
            endDate: currentProj.endDate || '',
            description: currentProj.description || '',
            highlights: currentProj.highlights || [],
          });
        }
        currentProj = {
          title: line.trim(),
          highlights: [],
          description: '',
        };
      } else if (currentProj) {
        if (isBullet) {
          const cleaned = cleanBullet(line);
          if (cleaned) {
            currentProj.highlights = currentProj.highlights || [];
            currentProj.highlights.push(cleaned);
          }
        } else if (!currentProj.description) {
          currentProj.description = `<p>${escapeHtml(line)}</p>`;
        }
      }
    }

    if (currentProj && currentProj.title) {
      projects.push({
        id: generateStableId('proj'),
        title: currentProj.title,
        subtitle: currentProj.subtitle || '',
        link: currentProj.link || '',
        startDate: currentProj.startDate || '',
        endDate: currentProj.endDate || '',
        description: currentProj.description || '',
        highlights: currentProj.highlights || [],
      });
    }
  }

  // 8. Parse Certifications
  const certifications: CertificationItem[] = [];
  const certLines = sectionBuckets.certifications;

  certLines.forEach((line) => {
    const cleaned = cleanBullet(line);
    if (cleaned && cleaned.length > 3) {
      const yearMatch = cleaned.match(SINGLE_YEAR_REGEX);
      const name = cleaned.replace(SINGLE_YEAR_REGEX, '').replace(/[-–—,]\s*$/, '').trim();
      certifications.push({
        id: generateStableId('cert'),
        name,
        issuer: '',
        date: yearMatch ? yearMatch[0] : '',
      });
    }
  });

  // Construct complete clean CVData without inventing missing information
  const cvData: CVData = {
    id: generateStableId('imported-cv'),
    title: `${fullName || 'Imported'} Resume`,
    templateId: 'silicon-modern',
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
    skills: uniqueSkills,
    projects,
    certifications,
    achievements: [] as AchievementItem[],
    languages: [] as LanguageItem[],
    customSections: [],
    updatedAt: new Date().toISOString(),
  };

  return {
    success: true,
    cvData,
    warnings,
    rawText: doc.rawText,
    fileName: doc.fileName,
    format: doc.format,
  };
}
