export interface TemplateConfig {
  id: string;
  name: string;
  category: 'all' | 'modern' | 'executive' | 'minimal' | 'academic' | 'creative';
  categoryLabel: string;
  description: string;
  pages: string;
  tag?: string;
  primaryColor: string;
  secondaryColor?: string;
  headerStyle: 'standard' | 'centered' | 'split' | 'accent-banner' | 'clean-border';
  fontFamily: 'inter' | 'serif' | 'system';
}

export const TEMPLATES_REGISTRY: TemplateConfig[] = [
  {
    id: 'silicon-modern',
    name: 'Silicon Modern',
    category: 'modern',
    categoryLabel: 'Tech & Engineering',
    description: 'Crisp two-column hierarchy tailored for software engineers, product managers, and technical leads.',
    pages: '1 Page',
    tag: 'Popular',
    primaryColor: '#2563eb',
    secondaryColor: '#3b82f6',
    headerStyle: 'split',
    fontFamily: 'inter',
  },
  {
    id: 'apex-executive',
    name: 'Apex Executive',
    category: 'executive',
    categoryLabel: 'Leadership & Strategy',
    description: 'Refined header with high-impact metrics focus for directors, VPs, and C-suite leaders.',
    pages: '1-2 Pages',
    tag: 'Executive',
    primaryColor: '#1e3a8a',
    secondaryColor: '#1d4ed8',
    headerStyle: 'accent-banner',
    fontFamily: 'serif',
  },
  {
    id: 'nordic-minimal',
    name: 'Nordic Clean',
    category: 'minimal',
    categoryLabel: 'Minimalist',
    description: 'Generous white space, subtle typographical contrast, and razor-sharp ATS compliance.',
    pages: '1 Page',
    tag: 'ATS Optimized',
    primaryColor: '#0f172a',
    secondaryColor: '#475569',
    headerStyle: 'clean-border',
    fontFamily: 'system',
  },
  {
    id: 'oxford-academic',
    name: 'Oxford Scholar',
    category: 'academic',
    categoryLabel: 'Academia & Research',
    description: 'Designed for publications, research grants, teaching appointments, and detailed citations.',
    pages: 'Multi-Page',
    tag: 'Comprehensive',
    primaryColor: '#0f766e',
    secondaryColor: '#14b8a6',
    headerStyle: 'centered',
    fontFamily: 'serif',
  },
  {
    id: 'vanguard-tech',
    name: 'Vanguard Systems',
    category: 'modern',
    categoryLabel: 'Data & Cloud',
    description: 'Dedicated sections for technical stacks, cloud certifications, and high-scale architectures.',
    pages: '1 Page',
    tag: 'Technical',
    primaryColor: '#4f46e5',
    secondaryColor: '#6366f1',
    headerStyle: 'split',
    fontFamily: 'inter',
  },
  {
    id: 'prism-creative',
    name: 'Prism Creative',
    category: 'creative',
    categoryLabel: 'Design & Marketing',
    description: 'Balanced accent touches showcasing portfolio highlights, case studies, and brand narrative.',
    pages: '1-2 Pages',
    tag: 'Portfolio',
    primaryColor: '#7c3aed',
    secondaryColor: '#9333ea',
    headerStyle: 'accent-banner',
    fontFamily: 'inter',
  },
];

// Mapping for aliases or legacy route IDs to ensure seamless fallback and backwards compatibility
const TEMPLATE_ALIASES: Record<string, string> = {
  'template-executive': 'apex-executive',
  'template-tech-minimal': 'silicon-modern',
  'template-nordic': 'nordic-minimal',
  'template-academic': 'oxford-academic',
  'sample-preview': 'silicon-modern',
  'default-modern': 'silicon-modern',
};

export function getTemplateById(id: string | undefined): TemplateConfig {
  if (!id) return TEMPLATES_REGISTRY[0];
  const targetId = TEMPLATE_ALIASES[id] || id;
  const found = TEMPLATES_REGISTRY.find((t) => t.id === targetId);
  return found || TEMPLATES_REGISTRY[0];
}
