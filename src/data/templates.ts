export type LayoutEngine =
  | 'single-column'
  | 'two-column'
  | 'left-sidebar'
  | 'right-sidebar'
  | 'compact-grid'
  | 'asymmetric'
  | 'academic-centered';

export type HeaderStyle = 'standard' | 'centered' | 'split' | 'accent-banner' | 'clean-border' | 'minimal';
export type SpacingScale = 'compact' | 'standard' | 'relaxed';
export type FontFamilyToken = 'inter' | 'serif' | 'system';

export interface TemplatePhotoConfig {
  supported: boolean;
  placement: 'header-left' | 'header-right' | 'sidebar' | 'header-center';
  defaultShape: 'circle' | 'square' | 'rounded';
  size: 'sm' | 'md' | 'lg';
  aspectRatio: '1:1' | '4:5';
}

export interface TemplateConfig {
  id: string;
  name: string;
  family: string;
  category: 'all' | 'modern' | 'executive' | 'minimal' | 'academic' | 'creative' | 'graduate';
  categoryLabel: string;
  description: string;
  pages: string;
  tag?: string;
  primaryColor: string;
  secondaryColor?: string;
  accentColor?: string;
  headerStyle: HeaderStyle;
  layoutEngine: LayoutEngine;
  fontFamily: FontFamilyToken;
  spacingScale: SpacingScale;
  photoConfig: TemplatePhotoConfig;
}

export const TEMPLATES_REGISTRY: TemplateConfig[] = [
  {
    id: 'apex-executive',
    name: 'Executive Prestige',
    family: 'Executive Prestige',
    category: 'executive',
    categoryLabel: 'Leadership & Strategy',
    description: 'Sophisticated navy banner with strong executive hierarchy, serif headers, and clear metrics focus for senior directors and VPs.',
    pages: '1-2 Pages',
    tag: 'Executive',
    primaryColor: '#1e3a8a',
    secondaryColor: '#1e40af',
    accentColor: '#3b82f6',
    headerStyle: 'accent-banner',
    layoutEngine: 'two-column',
    fontFamily: 'serif',
    spacingScale: 'standard',
    photoConfig: {
      supported: true,
      placement: 'header-right',
      defaultShape: 'rounded',
      size: 'md',
      aspectRatio: '1:1',
    },
  },
  {
    id: 'silicon-modern',
    name: 'Silicon Elite',
    family: 'Silicon Elite',
    category: 'modern',
    categoryLabel: 'Tech & Engineering',
    description: 'Modern technology resume with two-column balance, prominent project architectures, and categorized cloud competencies.',
    pages: '1 Page',
    tag: 'Popular',
    primaryColor: '#2563eb',
    secondaryColor: '#3b82f6',
    accentColor: '#60a5fa',
    headerStyle: 'split',
    layoutEngine: 'two-column',
    fontFamily: 'inter',
    spacingScale: 'standard',
    photoConfig: {
      supported: true,
      placement: 'header-left',
      defaultShape: 'circle',
      size: 'md',
      aspectRatio: '1:1',
    },
  },
  {
    id: 'nordic-minimal',
    name: 'Swiss Editorial',
    family: 'Swiss Editorial',
    category: 'minimal',
    categoryLabel: 'Minimalist & Design',
    description: 'Understated Swiss typography, generous negative space, hairline rules, and zero-distraction ATS readability.',
    pages: '1 Page',
    tag: 'ATS Optimized',
    primaryColor: '#0f172a',
    secondaryColor: '#334155',
    accentColor: '#64748b',
    headerStyle: 'clean-border',
    layoutEngine: 'single-column',
    fontFamily: 'system',
    spacingScale: 'relaxed',
    photoConfig: {
      supported: false,
      placement: 'header-right',
      defaultShape: 'rounded',
      size: 'md',
      aspectRatio: '1:1',
    },
  },
  {
    id: 'future-graduate',
    name: 'Future Graduate',
    family: 'Future Graduate',
    category: 'graduate',
    categoryLabel: 'Early Career & Grads',
    description: 'Education, academic awards, capstone projects, and technical skills prioritized for emerging professionals entering high-growth fields.',
    pages: '1 Page',
    tag: 'New',
    primaryColor: '#0d9488',
    secondaryColor: '#14b8a6',
    accentColor: '#2dd4bf',
    headerStyle: 'split',
    layoutEngine: 'single-column',
    fontFamily: 'inter',
    spacingScale: 'standard',
    photoConfig: {
      supported: true,
      placement: 'header-right',
      defaultShape: 'circle',
      size: 'sm',
      aspectRatio: '1:1',
    },
  },
  {
    id: 'prism-creative',
    name: 'Creative Atelier',
    family: 'Creative Atelier',
    category: 'creative',
    categoryLabel: 'Design & Marketing',
    description: 'Expressive asymmetric layout with an editorial left accent rail for design leaders, brand strategists, and creative directors.',
    pages: '1-2 Pages',
    tag: 'Portfolio',
    primaryColor: '#7c3aed',
    secondaryColor: '#9333ea',
    accentColor: '#a855f7',
    headerStyle: 'split',
    layoutEngine: 'asymmetric',
    fontFamily: 'inter',
    spacingScale: 'relaxed',
    photoConfig: {
      supported: true,
      placement: 'header-left',
      defaultShape: 'square',
      size: 'lg',
      aspectRatio: '4:5',
    },
  },
  {
    id: 'ats-classic',
    name: 'ATS Classic',
    family: 'ATS Classic',
    category: 'minimal',
    categoryLabel: 'Corporate & ATS',
    description: 'Strict single-column flow with standardized typographical hierarchy, zero parser traps, and 100% ATS parser fidelity.',
    pages: '1-2 Pages',
    tag: '100% ATS Safe',
    primaryColor: '#18181b',
    secondaryColor: '#27272a',
    accentColor: '#52525b',
    headerStyle: 'minimal',
    layoutEngine: 'single-column',
    fontFamily: 'serif',
    spacingScale: 'compact',
    photoConfig: {
      supported: false,
      placement: 'header-right',
      defaultShape: 'circle',
      size: 'sm',
      aspectRatio: '1:1',
    },
  },
  {
    id: 'oxford-academic',
    name: 'Academic Research',
    family: 'Academic Research',
    category: 'academic',
    categoryLabel: 'Academia & Science',
    description: 'Formal academic curriculum vitae format designed for publications, research fellowships, teaching appointments, and grants.',
    pages: 'Multi-Page',
    tag: 'Comprehensive',
    primaryColor: '#0f766e',
    secondaryColor: '#115e59',
    accentColor: '#14b8a6',
    headerStyle: 'centered',
    layoutEngine: 'academic-centered',
    fontFamily: 'serif',
    spacingScale: 'standard',
    photoConfig: {
      supported: false,
      placement: 'header-center',
      defaultShape: 'rounded',
      size: 'md',
      aspectRatio: '1:1',
    },
  },
  {
    id: 'finance-professional',
    name: 'Finance Professional',
    family: 'Finance Professional',
    category: 'executive',
    categoryLabel: 'Finance & Advisory',
    description: 'Compact, conservative format with high data density, hairline section dividers, and tabular alignment for investment banking and PE.',
    pages: '1 Page',
    tag: 'Finance',
    primaryColor: '#1e293b',
    secondaryColor: '#334155',
    accentColor: '#475569',
    headerStyle: 'clean-border',
    layoutEngine: 'compact-grid',
    fontFamily: 'serif',
    spacingScale: 'compact',
    photoConfig: {
      supported: false,
      placement: 'header-right',
      defaultShape: 'square',
      size: 'sm',
      aspectRatio: '1:1',
    },
  },
  {
    id: 'product-leader',
    name: 'Product Leader',
    family: 'Product Leader',
    category: 'modern',
    categoryLabel: 'Product & Strategy',
    description: 'Two-column layout with dedicated right sidebar for product vision, methodologies, KPI metrics, and tooling.',
    pages: '1-2 Pages',
    tag: 'Leadership',
    primaryColor: '#312e81',
    secondaryColor: '#3730a3',
    accentColor: '#4f46e5',
    headerStyle: 'split',
    layoutEngine: 'right-sidebar',
    fontFamily: 'inter',
    spacingScale: 'standard',
    photoConfig: {
      supported: true,
      placement: 'sidebar',
      defaultShape: 'circle',
      size: 'md',
      aspectRatio: '1:1',
    },
  },
  {
    id: 'vanguard-tech',
    name: 'Data Science Specialist',
    family: 'Data Science Specialist',
    category: 'modern',
    categoryLabel: 'AI & Data Science',
    description: 'Technical left-sidebar architecture isolating programming stacks, data pipelines, and ML frameworks from core systems impact.',
    pages: '1 Page',
    tag: 'Technical',
    primaryColor: '#4338ca',
    secondaryColor: '#4f46e5',
    accentColor: '#6366f1',
    headerStyle: 'split',
    layoutEngine: 'left-sidebar',
    fontFamily: 'inter',
    spacingScale: 'standard',
    photoConfig: {
      supported: true,
      placement: 'sidebar',
      defaultShape: 'rounded',
      size: 'md',
      aspectRatio: '1:1',
    },
  },
];

// Aliases mapping legacy/route IDs to canonical template items
const TEMPLATE_ALIASES: Record<string, string> = {
  'template-executive': 'apex-executive',
  'template-tech-minimal': 'silicon-modern',
  'template-nordic': 'nordic-minimal',
  'template-academic': 'oxford-academic',
  'sample-preview': 'silicon-modern',
  'default-modern': 'silicon-modern',
  'swiss-editorial': 'nordic-minimal',
  'creative-atelier': 'prism-creative',
  'datascience-specialist': 'vanguard-tech',
  'executive-prestige': 'apex-executive',
  'silicon-elite': 'silicon-modern',
};

export function getTemplateById(id: string | undefined): TemplateConfig {
  if (!id) return TEMPLATES_REGISTRY[0];
  const targetId = TEMPLATE_ALIASES[id] || id;
  const found = TEMPLATES_REGISTRY.find((t) => t.id === targetId);
  return found || TEMPLATES_REGISTRY[0];
}
