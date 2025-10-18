import { ResumeData } from './types';

export const SECTION_PLACEHOLDERS: { [key: string]: string } = {
  'PROFESSIONAL SUMMARY': '[Add your professional summary here]',
  'CORE SKILLS': '• Skill 1\n• Skill 2\n• Skill 3',
  'EXPERIENCE': 'Job Title | Company Name | Start Date - End Date\n• Achievement or responsibility\n• Achievement or responsibility',
  'EDUCATION': 'Degree in [Field of Study]\nUniversity Name | Graduation Year',
  'PROJECTS': 'Project Name | Link to project\n• Description of the project and your role.',
  'CERTIFICATIONS': 'Certification Name | Issuing Body | Year',
  'LANGUAGES': '• Language (Proficiency)',
  'VOLUNTEERING': 'Organization | Role | Start Date - End Date\n• Key responsibilities and achievements.',
  'PUBLICATIONS': 'Title of Publication | Where it was published | Year',
  'PROFESSIONAL AFFILIATIONS': 'Name of Affiliation | Role',
  'INTERESTS': '• Interest 1\n• Interest 2',
  'AWARDS & HONORS': 'Award/Honor Name | Issuing Organization | Year',
  'REFERENCES': 'Available upon request.',
  'CUSTOM SECTION': '[Add your custom content here]'
};

export const DEFAULT_RESUME_DATA: ResumeData = {
  name: 'YOUR NAME',
  title: 'Your Title/Position',
  contact: {
    email: 'Your Email',
    phone: 'Your Phone',
    linkedin: 'Your LinkedIn',
  },
  sections: [
    { id: 'summary', title: 'PROFESSIONAL SUMMARY', content: SECTION_PLACEHOLDERS['PROFESSIONAL SUMMARY'] },
    { id: 'skills', title: 'CORE SKILLS', content: SECTION_PLACEHOLDERS['CORE SKILLS'] },
    { id: 'experience', title: 'EXPERIENCE', content: SECTION_PLACEHOLDERS['EXPERIENCE'] },
    { id: 'education', title: 'EDUCATION', content: SECTION_PLACEHOLDERS['EDUCATION'] },
  ],
};

export const ALL_SECTIONS = [
  'Heading', 'Professional Summary', 'Core Skills', 'Experience', 'Education', 'Projects', 'Certifications', 'Languages', 'Volunteering', 'Publications', 'Professional Affiliations', 'Interests', 'Awards & Honors', 'References', 'Custom Section'
];