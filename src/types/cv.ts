export interface PersonalInfo {
  fullName: string;
  targetRole: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location?: string;
  startDate?: string;
  endDate: string;
  honors?: string;
}

export interface CVData {
  id: string;
  title: string;
  templateId: string;
  personal: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
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
    'Engineering leader with 10+ years specializing in distributed systems, real-time data streaming, and leading high-velocity frontend architecture teams. Proven track record scaling consumer services from seed stage to 50M+ monthly active users.',
  experience: [
    {
      id: 'exp-1',
      title: 'Principal Software Engineer',
      company: 'Apex Systems Cloud',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      bullets: [
        'Designed micro-frontend architecture decreasing page bundle sizes by 48% across 6 core user portals.',
        'Architected high-throughput event processing pipeline handling 120,000 req/sec at sub-10ms p99 latency.',
        'Mentored 14 senior engineers and established company-wide TypeScript quality guidelines.',
      ],
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
        'Reduced continuous integration build times from 18 minutes to 4.2 minutes.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science & Mathematics',
      school: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      endDate: '2018',
      honors: 'Graduated with Honors',
    },
  ],
  skills: [
    'TypeScript / JavaScript',
    'React & Next.js',
    'Node.js',
    'PostgreSQL / Redis',
    'Kubernetes & Docker',
    'GraphQL / REST',
    'System Architecture',
  ],
  updatedAt: new Date().toISOString(),
};
