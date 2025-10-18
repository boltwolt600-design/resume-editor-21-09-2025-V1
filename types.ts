
export interface ResumeSection {
  id: string;
  title: string;
  content: string;
}

export interface ResumeContact {
  email: string;
  phone: string;
  linkedin: string;
}

export interface ResumeData {
  name: string;
  title: string;
  contact: ResumeContact;
  sections: ResumeSection[];
}

export type SidebarTab = 'Design' | 'Formatting' | 'Sections' | 'AI Copilot';

export type TemplateName = 'Professional Classic' | 'Tech Modern' | 'Professional Photo' | 'Executive Classic' | 'Creative Modern' | 'Creative Photo';

export interface Aisuggestions {
  atsScore: number;
  suggestions: string;
  enhancedText: string;
  gapJustification: string;
}
